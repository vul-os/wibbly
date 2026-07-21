/**
 * The peer transport seam, and the default adapter over an `RTCDataChannel`.
 *
 * Why a seam rather than talking to `RTCDataChannel` directly:
 *
 *  1. Tests must run in node with no browser and no real WebRTC, so the
 *     transport has to be replaceable — it is the whole mocking surface for
 *     this package. (This is the same reason the seam existed in this
 *     package's previous life bridging to a magnetite WebSocket client; the
 *     shape below is kept close to that one on purpose.)
 *  2. `webrtc.ts` is where an `RTCPeerConnection` and its `RTCDataChannel` get
 *     created; this is where that channel gets handed off to `PeerSession`.
 *
 * One real difference from the shape this seam had before: it now needs
 * `onMessage`, because the old version only ever *sent* to a server and let
 * a separately-wrapped client push state back through its own `onState`. A
 * peer connection is inherently two-way on the one channel, so this seam
 * grew the one thing it structurally lacked rather than being replaced by a
 * different abstraction.
 */

/** Minimal transport contract `PeerSession` needs. */
export interface PeerTransport {
  connect(): void | Promise<void>;
  disconnect(): void;
  /** Send a serialized frame. Returns false if the channel is not open. */
  send(frame: string): boolean;
  readonly isConnected: boolean;
  /** Register an open handler. Called again on every reconnect. */
  onOpen(cb: () => void): void;
  onClose(cb: () => void): void;
  onError(cb: (err: unknown) => void): void;
  /** Register a handler for frames arriving from the peer. */
  onMessage(cb: (frame: string) => void): void;
}

/**
 * The subset of `RTCDataChannel` this package touches. Deliberately small and
 * shaped like the real DOM interface so `new RTCPeerConnection(...).createDataChannel(...)`
 * satisfies it with no adapter of its own — unlike the old magnetite client
 * bridge, there is no public-API gap to route around here.
 */
export interface DataChannelLike {
  send(data: string): void;
  close(): void;
  readonly readyState: 'connecting' | 'open' | 'closing' | 'closed';
  addEventListener(type: 'open', cb: () => void): void;
  addEventListener(type: 'close', cb: () => void): void;
  addEventListener(type: 'error', cb: (ev: unknown) => void): void;
  addEventListener(type: 'message', cb: (ev: { data: unknown }) => void): void;
}

/** Adapt a `DataChannelLike` (real or faked) to {@link PeerTransport}. */
export function dataChannelTransport(dc: DataChannelLike): PeerTransport {
  let openCb: (() => void) | null = null;
  let closeCb: (() => void) | null = null;
  let errCb: ((e: unknown) => void) | null = null;
  let msgCb: ((frame: string) => void) | null = null;

  dc.addEventListener('open', () => openCb?.());
  dc.addEventListener('close', () => closeCb?.());
  dc.addEventListener('error', (e) => errCb?.(e));
  dc.addEventListener('message', (ev) => {
    if (typeof ev.data !== 'string') {
      // A malicious or buggy peer could in principle send binary; refuse it
      // rather than guessing at a decoding, and surface it rather than
      // dropping silently.
      errCb?.(new Error(`received a non-string DataChannel message (${typeof ev.data}); ignoring`));
      return;
    }
    msgCb?.(ev.data);
  });

  return {
    connect: () => {
      // Nothing to do here: by the time a DataChannelLike exists, the
      // surrounding RTCPeerConnection has already been wired up by webrtc.ts
      // and the channel is already negotiating. `connect()` exists so this
      // seam's shape stays uniform for any future non-WebRTC transport (e.g.
      // a same-machine test transport) that does have setup work to do here.
    },
    disconnect: () => dc.close(),
    send: (frame) => {
      if (dc.readyState !== 'open') return false;
      dc.send(frame);
      return true;
    },
    get isConnected() {
      return dc.readyState === 'open';
    },
    onOpen(cb) {
      openCb = cb;
    },
    onClose(cb) {
      closeCb = cb;
    },
    onError(cb) {
      errCb = cb;
    },
    onMessage(cb) {
      msgCb = cb;
    },
  };
}
