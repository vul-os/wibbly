/**
 * @vulos/wibbly-magnetite — the bridge from a wibbly `GestureEvent` to a
 * magnetite session.
 *
 *   wire.ts       exact serde shape + canonical signing bytes of magnetite's
 *                 `AttestedEvent` / `SignedAttestedEvent` (seam §3.7)
 *   adapter.ts    GestureEvent → AttestedEvent, monotonic seq, capture time
 *   preflight.ts  client-side mirror of PlausibilityGate — AN OPTIMISATION,
 *                 NOT A SECURITY BOUNDARY
 *   identity.ts   optional WebCrypto Ed25519 signing, zero dependencies
 *   transport.ts  the mocking seam + adapter over magnetite-web-client
 *   session.ts    MagnetiteSession: connect / stream / degrade / teardown
 *
 * Everything here is CLIENT-ATTESTED input. It cannot be replay-verified, and a
 * determined cheater can synthesise events indistinguishable from real ones.
 * Read the README before describing this as anything it is not.
 */

export * from './wire';
export * from './adapter';
export * from './preflight';
export * from './identity';
export * from './transport';
export * from './session';
