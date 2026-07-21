/**
 * @vulos/wibbly-p2p — wibbly's peer-to-peer multiplayer: host authority
 * in a browser tab, no backend, no accounts, no payments.
 *
 * (Renamed from @vulos/wibbly-magnetite: this package holds no magnetite code —
 * it is pure WebRTC P2P. The magnetite integration lives in
 * @vulos/wibbly-authority, which runs a real magnetite game module in the tab.)
 *
 *   message.ts       the wire envelope: GestureEvent <-> wire, opaque state,
 *                     per-connection sequence numbers
 *   inbound-gate.ts  rate limit + sanity-check + playerId authorization for
 *                    inbound peer messages — THE REAL DEFENSE, not an
 *                    optimisation mirroring something stricter downstream
 *   codec.ts         compact (gzip+base64url) encode/decode of an SDP blob,
 *                    so an offer/answer fits in a link or QR code
 *   webrtc.ts        RTCPeerConnection setup: host offer, guest answer,
 *                    free STUN, no free TURN, no signalling server
 *   transport.ts     the mocking seam + adapter over a real RTCDataChannel
 *   session.ts       PeerSession: connect / send / receive / degrade / teardown
 *
 * Read this before wiring it into a game:
 *
 * - Camera frames never leave the device. Only recognised `GestureEvent`s
 *   cross the wire. That is a real privacy property.
 * - It is NOT a security property. Gesture input is `InputClass::Attested`:
 *   nondeterministic, unverifiable, and a determined cheater can synthesise
 *   events indistinguishable from real ones — see site/docs/MULTIPLAYER.md.
 *   A dedicated server would not have changed that, which is the whole
 *   argument for host-in-browser authority instead of running one.
 * - Opening a `DataChannel` at all discloses each peer's IP address to the
 *   other, the same as any direct WebRTC connection — see webrtc.ts. That is
 *   independent of the camera-frame privacy property above; both are true.
 * - There is no free TURN relay. Same-network play always works; a peer
 *   behind symmetric NAT or CGNAT on either side cannot connect, with no
 *   workaround available from inside a browser tab.
 *
 * This package does not know tennis, or any other game, exists.
 */

export * from './message';
export * from './inbound-gate';
export * from './codec';
export * from './webrtc';
export * from './transport';
export * from './session';
