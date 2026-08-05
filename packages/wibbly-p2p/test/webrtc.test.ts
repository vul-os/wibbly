/**
 * webrtc.ts drives an `RTCPeerConnection` through offer/answer/ICE, none of
 * which exists in node. Every test here injects a fake `RTCPeerConnectionLike`
 * via `rtcFactory` — the same "the transport is the mocking seam" approach
 * this package has always used, just one level lower (mocking the connection
 * itself rather than the channel it produces).
 *
 * The fakes model exactly the surface webrtc.ts touches: offer/answer
 * creation, ICE-gathering-state, and a `datachannel` event on the answering
 * side. They do not model real ICE negotiation or NAT traversal — nothing
 * that requires a live network could be proven in this suite regardless (see
 * this package's README for what that means was, and was not, verified).
 */

import { describe, expect, it } from 'vitest';
import { createGuestAnswer, createHostOffer, type RTCPeerConnectionLike } from '../src/webrtc';
import { decodeDescription } from '../src/codec';
import type { DataChannelLike } from '../src/transport';

class FakeDataChannel implements DataChannelLike {
  readyState: 'connecting' | 'open' | 'closing' | 'closed' = 'connecting';
  peer: FakeDataChannel | null = null;
  private listeners: Record<string, ((arg?: unknown) => void)[]> = {};

  addEventListener(type: 'open', cb: () => void): void;
  addEventListener(type: 'close', cb: () => void): void;
  addEventListener(type: 'error', cb: (ev: unknown) => void): void;
  addEventListener(type: 'message', cb: (ev: { data: unknown }) => void): void;
  // A rest-parameter `(...args: unknown[]) => void` implementation looks
  // like the obvious catch-all here, but it isn't actually a valid overload
  // target: contravariance means `unknown` (that signature's param type)
  // would have to be assignable to `{ data: unknown }` (the 'message'
  // overload's param type), and it isn't — only the reverse holds. Spelling
  // out the exact union of the four overloads' callback shapes is what
  // makes each overload a genuine subtype of the implementation signature.
  addEventListener(
    type: string,
    cb: (() => void) | ((ev: unknown) => void) | ((ev: { data: unknown }) => void),
  ): void {
    (this.listeners[type] ??= []).push(cb as (arg?: unknown) => void);
  }
  private emit(type: string, arg?: unknown): void {
    for (const cb of this.listeners[type] ?? []) cb(arg);
  }
  open(): void {
    this.readyState = 'open';
    this.emit('open');
  }
  send(data: string): void {
    if (this.readyState !== 'open') throw new Error('FakeDataChannel: send() while not open');
    queueMicrotask(() => this.peer?.emit('message', { data }));
  }
  close(): void {
    if (this.readyState === 'closed') return;
    this.readyState = 'closed';
    this.emit('close');
  }
}

class FakePeerConnection implements RTCPeerConnectionLike {
  iceGatheringState = 'complete';
  localDescription: { type: string; sdp: string } | null = null;
  createdChannel: FakeDataChannel | null = null;
  closed = false;
  private dcListeners: ((ev: { channel: DataChannelLike }) => void)[] = [];
  private iceListeners: (() => void)[] = [];
  // createGuestAnswer registers its 'datachannel' listener only after an
  // `await` (decodeDescription, then setRemoteDescription), so a test that
  // fires the event right after calling createGuestAnswer can genuinely win
  // the race against that registration. Buffer it rather than require every
  // test to know that internal timing detail.
  private pendingChannel: DataChannelLike | null = null;

  createDataChannel(): DataChannelLike {
    const ch = new FakeDataChannel();
    this.createdChannel = ch;
    return ch;
  }
  async createOffer() {
    return { type: 'offer', sdp: 'fake-offer-sdp' };
  }
  async createAnswer() {
    return { type: 'answer', sdp: 'fake-answer-sdp' };
  }
  async setLocalDescription(desc?: { type: string; sdp: string }) {
    if (desc) this.localDescription = desc;
  }
  async setRemoteDescription() {
    // Real negotiation isn't modeled — nothing here depends on the remote
    // description's content, only on the datachannel event firing.
  }
  close(): void {
    this.closed = true;
  }
  addEventListener(type: 'icegatheringstatechange', cb: () => void): void;
  addEventListener(type: 'datachannel', cb: (ev: { channel: DataChannelLike }) => void): void;
  // Same reasoning as FakeDataChannel's addEventListener above: the union of
  // the two overloads' exact callback shapes, not a lossy rest-parameter
  // catch-all, is what makes this a valid implementation signature.
  addEventListener(
    type: 'icegatheringstatechange' | 'datachannel',
    cb: (() => void) | ((ev: { channel: DataChannelLike }) => void),
  ): void {
    if (type === 'datachannel') {
      const dcCb = cb;
      this.dcListeners.push(dcCb);
      if (this.pendingChannel) {
        const channel = this.pendingChannel;
        this.pendingChannel = null;
        dcCb({ channel });
      }
    } else {
      this.iceListeners.push(cb as () => void);
    }
  }
  fireDataChannel(channel: DataChannelLike): void {
    if (this.dcListeners.length === 0) {
      this.pendingChannel = channel;
      return;
    }
    for (const cb of this.dcListeners) cb({ channel });
  }
  setIceGatheringState(state: string): void {
    this.iceGatheringState = state;
    for (const cb of this.iceListeners) cb();
  }
}

describe('createHostOffer', () => {
  it('produces a decodable offer code and a transport wrapping the created channel', async () => {
    const pc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => pc });

    const decoded = await decodeDescription(host.offerCode);
    expect(decoded).toEqual({ type: 'offer', sdp: 'fake-offer-sdp' });
    expect(pc.createdChannel).not.toBeNull();
    expect(host.transport.isConnected).toBe(false); // not open until the channel opens
  });

  it('rejects applyAnswer given an offer code instead of an answer code', async () => {
    const pc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => pc });
    await expect(host.applyAnswer(host.offerCode)).rejects.toThrow(/expected an answer code/);
  });

  it('rejects applyAnswer given a malformed code', async () => {
    const pc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => pc });
    await expect(host.applyAnswer('not a valid code')).rejects.toThrow();
  });

  it('waits for ICE gathering to complete before producing the offer code', async () => {
    const pc = new FakePeerConnection();
    pc.iceGatheringState = 'gathering';
    const pending = createHostOffer({ rtcFactory: () => pc, iceGatherTimeoutMs: 50 });

    // Resolve gathering shortly after — the promise must not have settled yet.
    setTimeout(() => pc.setIceGatheringState('complete'), 5);
    const host = await pending;
    expect(host.offerCode[0]).toMatch(/[gr]/);
  });

  it('times out with a clear error if ICE gathering never completes', async () => {
    const pc = new FakePeerConnection();
    pc.iceGatheringState = 'gathering';
    await expect(createHostOffer({ rtcFactory: () => pc, iceGatherTimeoutMs: 20 })).rejects.toThrow(
      /ICE gathering did not complete/,
    );
  });

  it('close() closes both the channel and the connection', async () => {
    const pc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => pc });
    host.close();
    expect(pc.closed).toBe(true);
    expect(pc.createdChannel!.readyState).toBe('closed');
  });
});

describe('createGuestAnswer', () => {
  it('rejects a malformed offer code immediately, before touching RTCPeerConnection at all', async () => {
    let factoryCalled = false;
    await expect(
      createGuestAnswer('garbage', { rtcFactory: () => ((factoryCalled = true), new FakePeerConnection()) }),
    ).rejects.toThrow();
    expect(factoryCalled).toBe(false);
  });

  it('rejects a well-formed code of the wrong type (an answer where an offer was expected)', async () => {
    const hostPc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => hostPc });
    hostPc.createdChannel!.open();
    // host.offerCode is a real offer; feed an *answer*-typed code instead by
    // round-tripping one from a second host offer's own answer flow shape.
    const notAnOffer = await (async () => {
      const decoded = await decodeDescription(host.offerCode);
      const fakeAnswerShaped = { type: 'answer', sdp: decoded.sdp };
      const { encodeDescription } = await import('../src/codec');
      return encodeDescription(fakeAnswerShaped);
    })();

    await expect(createGuestAnswer(notAnOffer, { rtcFactory: () => new FakePeerConnection() })).rejects.toThrow(
      /expected an offer code/,
    );
  });

  it('produces a decodable answer code', async () => {
    const hostPc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => hostPc });

    const guestPc = new FakePeerConnection();
    const guestPromise = createGuestAnswer(host.offerCode, { rtcFactory: () => guestPc });
    guestPc.fireDataChannel(new FakeDataChannel());
    const guest = await guestPromise;

    expect(await decodeDescription(guest.answerCode)).toEqual({ type: 'answer', sdp: 'fake-answer-sdp' });
  });
});

describe('host <-> guest, fully wired with fakes — data actually flows', () => {
  it('opens a working duplex transport with no real network involved', async () => {
    const hostPc = new FakePeerConnection();
    const host = await createHostOffer({ rtcFactory: () => hostPc });

    const guestPc = new FakePeerConnection();
    const guestPromise = createGuestAnswer(host.offerCode, { rtcFactory: () => guestPc });

    // Wire the two fake channels together, as if one RTCDataChannel connected
    // both ends, and simulate the guest receiving the host-created channel.
    const hostChannel = hostPc.createdChannel!;
    const guestChannel = new FakeDataChannel();
    hostChannel.peer = guestChannel;
    guestChannel.peer = hostChannel;
    guestPc.fireDataChannel(guestChannel);

    const guest = await guestPromise;
    await host.applyAnswer(guest.answerCode);

    // ICE "connects": both ends of the (fake) channel open.
    hostChannel.open();
    guestChannel.open();
    expect(host.transport.isConnected).toBe(true);
    expect(guest.transport.isConnected).toBe(true);

    const receivedByGuest: string[] = [];
    const receivedByHost: string[] = [];
    guest.transport.onMessage((m) => receivedByGuest.push(m));
    host.transport.onMessage((m) => receivedByHost.push(m));

    expect(host.transport.send('state:1')).toBe(true);
    expect(guest.transport.send('gesture:1')).toBe(true);

    await new Promise((r) => queueMicrotask(() => queueMicrotask(() => r(undefined))));
    expect(receivedByGuest).toEqual(['state:1']);
    expect(receivedByHost).toEqual(['gesture:1']);

    host.close();
    guest.close();
    expect(hostChannel.readyState).toBe('closed');
  });
});
