/**
 * The magnetite authority, wired into the tennis render loop.
 *
 * This is the concrete answer to "is wibbly actually built on magnetite?".
 * `@vulos/wibbly-authority` loads a real magnetite `AuthoritativeGame` compiled
 * to wasm and runs it as a `Topology::SingleRoom` match — the bottom rung of
 * magnetite's topology ladder, hosted by this browser tab with no server. This
 * adapter starts one such match alongside the tennis game and steps it from the
 * same animation loop, fed by the match's own gesture events: a swing becomes
 * an authoritative input, and the magnetite simulation advances deterministic
 * state in response.
 *
 * ── Full app only ──────────────────────────────────────────────────────────
 * Never constructed in demo mode. The demo embeds under a `default-src 'self'`
 * CSP with no `wasm-unsafe-eval`, and wasm compilation is blocked there (it is
 * the one known-benign violation `verify:demo` already documents). The caller
 * gates on `isDemo()`; this module additionally refuses, so a future edit that
 * forgets the gate fails loudly rather than tripping a CSP violation in the
 * marketing embed.
 *
 * ── What this does NOT do ───────────────────────────────────────────────────
 * It does not verify gesture input and changes nothing about anti-cheat.
 * magnetite classes camera gesture input `InputClass::Attested` — never
 * replay-verifiable. Determinism here is a property of the simulation given its
 * inputs, not of the inputs. See packages/wibbly-authority/src/index.ts.
 */

import { MagnetiteAuthority, singleRoomConfig, makeInput } from '@vulos/wibbly-authority';
import { assetUrl, isDemo } from '../mode';

/** Where the vendored magnetite module lives, resolved against the deploy base. */
export const AUTHORITY_WASM_PATH = 'magnetite/arena-authority.wasm';

/** Per-tick telemetry surfaced to the HUD and to `window.__WIBBLY_MAGNETITE__`. */
export interface AuthorityTelemetry {
  ready: true;
  tick: number;
  stateHash: string;
  players: number;
}

/** Reported instead of {@link AuthorityTelemetry} when the authority failed to start or step. */
export interface AuthorityFailure {
  ready: false;
  error: string;
}

/** Rising-edge signals fed into one authoritative tick. */
export interface AuthoritySignals {
  p1Swing?: boolean;
}

/**
 * Start a magnetite authority for the current match. Resolves to a runner, or
 * rejects if the module cannot be fetched/instantiated. Refuses in demo mode.
 */
export async function startMagnetiteAuthority(fetchImpl: typeof fetch = fetch): Promise<MagnetiteAuthorityRunner> {
  if (isDemo()) {
    throw new Error('magnetite authority must not run in demo mode — wasm is blocked by the demo CSP');
  }
  const url = assetUrl(AUTHORITY_WASM_PATH);
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`magnetite module fetch failed: ${res.status}`);
  const bytes = await res.arrayBuffer();
  const auth = await MagnetiteAuthority.instantiate(bytes, singleRoomConfig({ seed: 1, max_players: 4 }));
  // Two players, mirroring the two on the tennis court. The reference ABI has
  // no on_join, so they are seeded via restore — exactly as magnetite's own SDK
  // tests spawn players.
  auth.restorePlayers([
    { id: 1, x: -50, y: 0, angle: 0 },
    { id: 2, x: 50, y: 0, angle: Math.PI },
  ]);
  return new MagnetiteAuthorityRunner(auth);
}

/** Drives one magnetite match, one authoritative tick per rendered frame. */
export class MagnetiteAuthorityRunner {
  private readonly auth: MagnetiteAuthority;
  private lastHash: string;
  private rejects: number;

  constructor(auth: MagnetiteAuthority) {
    this.auth = auth;
    this.lastHash = '0';
    this.rejects = 0;
  }

  /**
   * Advance the authority one tick. `signals.p1Swing` (a rising swing edge)
   * becomes player 1's `attack` input, so a real gesture drives real
   * authoritative state. Returns telemetry for the HUD.
   */
  step(signals: AuthoritySignals = {}): AuthorityTelemetry {
    const seq = this.auth.tick;
    const inputs: Array<[number, ReturnType<typeof makeInput>]> = [
      [1, makeInput({ keys: { attack: !!signals.p1Swing }, sequence: seq, timestamp_ms: seq * 16 })],
      [2, makeInput({ sequence: seq, timestamp_ms: seq * 16 })],
    ];
    const out = this.auth.step(inputs);
    this.lastHash = out.state_hash;
    this.rejects += out.rejects.length;
    return this.telemetry();
  }

  /** Snapshot of the authority's live state for display/diagnostics. */
  telemetry(): AuthorityTelemetry {
    return { ready: true, tick: this.auth.tick, stateHash: this.lastHash, players: 2 };
  }
}
