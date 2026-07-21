/**
 * WebRTC peer connection setup: turn a host's offer into a guest's answer and
 * get a working `PeerTransport` out the other end, with zero signalling
 * infrastructure. This implements the design in site/docs/MULTIPLAYER.md —
 * read that first for the "why" of the shape below.
 *
 * There is no server to broker the SDP exchange, so this trades a small
 * amount of user effort (copy a link or scan a QR code, paste one answer
 * back) for needing to run nothing: the whole offer and answer are single
 * opaque strings (see codec.ts), carried by whatever out-of-band channel the
 * two players already have open.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HONESTY — two separate limitations, both real, neither papered over
 *
 * 1. NO FREE TURN. STUN (below) only helps a peer discover its own public
 *    address; it does not relay traffic. A relay (TURN) is itself a server,
 *    and running one is exactly the ongoing operational surface this package
 *    exists to avoid — so there isn't one. Free STUN resolves NAT traversal
 *    for the common case (an ordinary home or mobile connection behind a
 *    typical NAT). Peers where EITHER side sits behind symmetric NAT or
 *    carrier-grade NAT (CGNAT) will fail to open a `DataChannel`, with no
 *    workaround available from inside a browser tab. Same-network (same
 *    Wi-Fi/LAN) play is unaffected by any of this.
 *
 * 2. IP ADDRESSES ARE NOT PRIVATE FROM YOUR OPPONENT. This is a normal,
 *    unavoidable property of any direct peer connection, not a wibbly
 *    decision or a bug: to open a DataChannel at all, each side's ICE
 *    candidates — which are drawn from that device's own local and
 *    STUN-reflexive network addresses — are exchanged with the other side as
 *    part of the offer/answer, even when STUN (not TURN) is all that is
 *    used. Camera frames genuinely never leave the device — that privacy
 *    property is real and is the one this package's whole design optimises
 *    for. But it is a claim about video, not about network metadata: the
 *    peer you connect to *does* learn your IP address (and you learn theirs),
 *    the same way it would in any other browser-to-browser WebRTC call, game
 *    with direct P2P netcode, or plain old direct-connect multiplayer. Do not
 *    describe this transport as anonymous or IP-hiding anywhere downstream.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { dataChannelTransport, type DataChannelLike, type PeerTransport } from './transport';
import { decodeDescription, encodeDescription, type DescriptionLike } from './codec';

/**
 * Free public STUN, chosen only to resolve NAT — see the module doc for what
 * this does and does not do. Neither of these servers, nor any STUN server,
 * relays media or data; they only tell a peer its own reflexive address, so
 * using them does not add a third party who can see message contents.
 */
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
];

const DEFAULT_ICE_GATHER_TIMEOUT_MS = 4_000;
const DATA_CHANNEL_LABEL = 'wibbly-p2p';

/**
 * Minimal `RTCPeerConnection` surface this module needs — injectable so tests
 * can run with no real WebRTC. Shaped to match the real DOM interface so a
 * genuine `RTCPeerConnection` satisfies it with no wrapper.
 */
export interface RTCPeerConnectionLike {
  readonly iceGatheringState: string;
  readonly localDescription: DescriptionLike | null;
  createDataChannel(label: string): DataChannelLike;
  createOffer(): Promise<DescriptionLike>;
  createAnswer(): Promise<DescriptionLike>;
  setLocalDescription(desc?: DescriptionLike): Promise<void>;
  setRemoteDescription(desc: DescriptionLike): Promise<void>;
  close(): void;
  addEventListener(type: 'icegatheringstatechange', cb: () => void): void;
  addEventListener(type: 'datachannel', cb: (ev: { channel: DataChannelLike }) => void): void;
}

export type RTCPeerConnectionFactory = (config: {
  iceServers: RTCIceServer[];
}) => RTCPeerConnectionLike;

function defaultFactory(config: { iceServers: RTCIceServer[] }): RTCPeerConnectionLike {
  if (typeof RTCPeerConnection !== 'function') {
    throw new Error(
      'RTCPeerConnection is not available in this environment. Pass an explicit `rtcFactory` ' +
        '(tests do this; there is no way to open a real WebRTC connection outside a browser).',
    );
  }
  return new RTCPeerConnection(config) as unknown as RTCPeerConnectionLike;
}

export interface WebRtcOptions {
  /** Defaults to {@link DEFAULT_ICE_SERVERS}. */
  iceServers?: RTCIceServer[];
  /** Defaults to `new RTCPeerConnection(...)`. Tests inject a fake here. */
  rtcFactory?: RTCPeerConnectionFactory;
  /** How long to wait for ICE gathering to finish before giving up. */
  iceGatherTimeoutMs?: number;
}

/**
 * Non-trickle ICE: rather than streaming candidates over a signalling channel
 * that doesn't exist, wait for gathering to finish and bake every candidate
 * into the one SDP blob that becomes the offer/answer code. Costs a little
 * latency up front; needed because there is nowhere to send a candidate
 * separately.
 */
function waitForIceGatheringComplete(pc: RTCPeerConnectionLike, timeoutMs: number): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `ICE gathering did not complete within ${timeoutMs}ms — check network connectivity ` +
            'or pass a larger `iceGatherTimeoutMs`',
        ),
      );
    }, timeoutMs);
    pc.addEventListener('icegatheringstatechange', function onChange() {
      if (pc.iceGatheringState === 'complete') {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

export interface HostOffer {
  /** Compact string to put in a link or QR code for the guest. */
  offerCode: string;
  /** Opens once the guest's answer is applied and ICE connects. */
  transport: PeerTransport;
  /**
   * Apply the guest's answer code, once you have it back. Resolves once the
   * remote description is set; the channel then opens on its own as ICE
   * connects — listen with `transport.onOpen()`, not this promise.
   */
  applyAnswer(answerCode: string): Promise<void>;
  /** Tear down the underlying `RTCPeerConnection` and its data channel. */
  close(): void;
}

/**
 * Host side: create an `RTCPeerConnection`, open a `DataChannel` on it, and
 * produce an offer code to hand the guest (link or QR — this package does
 * neither; that is UI). Await {@link HostOffer.applyAnswer} with the guest's
 * reply once it comes back to complete the handshake.
 */
export async function createHostOffer(opts: WebRtcOptions = {}): Promise<HostOffer> {
  const factory = opts.rtcFactory ?? defaultFactory;
  const pc = factory({ iceServers: opts.iceServers ?? DEFAULT_ICE_SERVERS });
  const channel = pc.createDataChannel(DATA_CHANNEL_LABEL);

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitForIceGatheringComplete(pc, opts.iceGatherTimeoutMs ?? DEFAULT_ICE_GATHER_TIMEOUT_MS);
  const offerCode = await encodeDescription(pc.localDescription ?? offer);

  return {
    offerCode,
    transport: dataChannelTransport(channel),
    async applyAnswer(answerCode: string) {
      const desc = await decodeDescription(answerCode);
      if (desc.type !== 'answer') {
        throw new Error(`expected an answer code but got type "${desc.type}"`);
      }
      await pc.setRemoteDescription(desc);
    },
    close() {
      channel.close();
      pc.close();
    },
  };
}

export interface GuestAnswer {
  /** Compact string to send back to the host. */
  answerCode: string;
  /** Opens once the host applies this answer and ICE connects. */
  transport: PeerTransport;
  close(): void;
}

/**
 * Guest side: consume a host's offer code, create the matching
 * `RTCPeerConnection`, and produce an answer code to send back.
 */
export async function createGuestAnswer(
  offerCode: string,
  opts: WebRtcOptions = {},
): Promise<GuestAnswer> {
  // Decoded and validated before anything WebRTC-shaped happens, so a
  // mistyped paste or a truncated QR scan fails with a clear message here
  // rather than deep inside setRemoteDescription.
  const offer = await decodeDescription(offerCode);
  if (offer.type !== 'offer') {
    throw new Error(`expected an offer code but got type "${offer.type}"`);
  }

  const factory = opts.rtcFactory ?? defaultFactory;
  const pc = factory({ iceServers: opts.iceServers ?? DEFAULT_ICE_SERVERS });

  // The host created the DataChannel; it arrives here via this event once
  // negotiation reaches that point, not by this side calling createDataChannel.
  const channelReady = new Promise<DataChannelLike>((resolve) => {
    pc.addEventListener('datachannel', (ev) => resolve(ev.channel));
  });

  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await waitForIceGatheringComplete(pc, opts.iceGatherTimeoutMs ?? DEFAULT_ICE_GATHER_TIMEOUT_MS);
  const answerCode = await encodeDescription(pc.localDescription ?? answer);

  const channel = await channelReady;
  return {
    answerCode,
    transport: dataChannelTransport(channel),
    close() {
      channel.close();
      pc.close();
    },
  };
}
