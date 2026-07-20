/**
 * Client-side mirror of magnetite's `PlausibilityGate`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS NOT A SECURITY BOUNDARY. It is an optimisation, and nothing else.
 *
 * It runs in the player's own browser, in code the player controls, and any
 * player who wants to bypass it can delete it. The **server** gate in
 * `magnetite-seams/src/input.rs` is the authority; it re-checks every one of
 * these conditions and its verdict is the only one that counts.
 *
 * The reason it exists: the server's rate window is a *budget*, and an event
 * the server would reject still costs a round trip and (for `RateExceeded`) can
 * crowd the player's own honest events. Dropping obviously-bad events locally
 * spends that budget on events that might actually land. That is a latency and
 * throughput win for honest players — nothing is being defended.
 *
 * Because it is not a defence, it deliberately fails *open* in one direction:
 * the limits are copied from the server's defaults, and if a host runs stricter
 * limits we will send events it rejects. That is correct. A client-side gate
 * stricter than the server would silently eat a player's real input, which is a
 * far worse failure than a wasted frame.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AttestedEventWire } from './wire';

/**
 * Mirror of `magnetite_seams::input::PlausibilityLimits`.
 *
 * Defaults are copied verbatim from that file's `impl Default`. If they drift
 * upstream, this drifts with them or it is wrong.
 */
export interface PreflightLimits {
  /** `max_events_per_sec` — accepted events per player per trailing second. */
  maxEventsPerSec: number;
  /** `cooldown_ms` — minimum gap between two accepted events *of the same kind*. */
  cooldownMs: number;
  /** `max_speed_mps` — fastest limb speed a human is assumed to reach. */
  maxSpeedMps: number;
  /** `min_confidence` — confidence floor; below this is noise. */
  minConfidence: number;
  /** `max_future_skew_ms` — tolerated forward clock skew on `t_capture_ms`. */
  maxFutureSkewMs: number;
  /** `max_age_ms` — oldest capture timestamp still actionable. */
  maxAgeMs: number;
  /** `accepted_kinds` — if non-empty, only these kinds are accepted. */
  acceptedKinds: string[];
}

/** `PlausibilityLimits::default()`, verbatim from input.rs. */
export const DEFAULT_PREFLIGHT_LIMITS: PreflightLimits = {
  maxEventsPerSec: 20,
  cooldownMs: 100,
  maxSpeedMps: 20.0,
  minConfidence: 0.35,
  maxFutureSkewMs: 2_000,
  maxAgeMs: 5_000,
  acceptedKinds: [],
};

/**
 * Mirror of `magnetite_seams::input::Implausible`, in the same order the Rust
 * gate evaluates them so a local rejection names the same reason the server
 * would have named.
 *
 * Every value means "not physically reachable". **None of them means "cheating
 * proven"** — see the Rust type's docs.
 */
export type PreflightRejection =
  | 'unknown_kind'
  | 'implausible_confidence'
  | 'future_timestamp'
  | 'stale_timestamp'
  | 'speed_unreachable'
  | 'sequence_replayed'
  | 'cooldown'
  | 'rate_exceeded';

export interface PreflightResult {
  ok: boolean;
  reason?: PreflightRejection;
  /** Human-readable detail, for logging. Never shown as an accusation. */
  detail?: string;
}

const OK: PreflightResult = { ok: true };

/**
 * Per-player screening state. Mirrors the Rust `PlayerWindow`.
 *
 * As in Rust, **state advances only on acceptance**, so a burst of rejected
 * events cannot push a player's own legitimate events out of the rate window.
 */
interface PlayerWindow {
  recentMs: number[];
  lastKindMs: Map<string, number>;
  highSeq: number | null;
}

export class PreflightGate {
  private readonly limits: PreflightLimits;
  private readonly players = new Map<string, PlayerWindow>();

  constructor(limits: Partial<PreflightLimits> = {}) {
    this.limits = { ...DEFAULT_PREFLIGHT_LIMITS, ...limits };
  }

  get currentLimits(): Readonly<PreflightLimits> {
    return this.limits;
  }

  /**
   * Screen one event at wall-clock `nowMs`.
   *
   * The check order is the Rust gate's order exactly: kind → confidence →
   * future → stale → speed → sequence → cooldown → rate.
   */
  admit(ev: AttestedEventWire, nowMs: number): PreflightResult {
    const L = this.limits;

    if (L.acceptedKinds.length > 0 && !L.acceptedKinds.includes(ev.kind)) {
      return { ok: false, reason: 'unknown_kind', detail: ev.kind };
    }
    if (
      !Number.isFinite(ev.confidence) ||
      ev.confidence < 0 ||
      ev.confidence > 1 ||
      ev.confidence < L.minConfidence
    ) {
      return {
        ok: false,
        reason: 'implausible_confidence',
        detail: `${ev.confidence} vs floor ${L.minConfidence}`,
      };
    }
    if (ev.t_capture_ms > nowMs + L.maxFutureSkewMs) {
      return { ok: false, reason: 'future_timestamp', detail: `${ev.t_capture_ms - nowMs}ms ahead` };
    }
    if (nowMs - ev.t_capture_ms > L.maxAgeMs) {
      return { ok: false, reason: 'stale_timestamp', detail: `${nowMs - ev.t_capture_ms}ms old` };
    }
    if (ev.speed_mps !== null) {
      if (!Number.isFinite(ev.speed_mps) || ev.speed_mps > L.maxSpeedMps) {
        return {
          ok: false,
          reason: 'speed_unreachable',
          detail: `${ev.speed_mps} m/s vs limit ${L.maxSpeedMps}`,
        };
      }
    }

    let w = this.players.get(ev.player);
    if (!w) {
      w = { recentMs: [], lastKindMs: new Map(), highSeq: null };
      this.players.set(ev.player, w);
    }

    if (w.highSeq !== null && ev.seq <= w.highSeq) {
      return { ok: false, reason: 'sequence_replayed', detail: `seq ${ev.seq} ≤ ${w.highSeq}` };
    }
    const last = w.lastKindMs.get(ev.kind);
    if (last !== undefined) {
      // Rust uses saturating_sub on u64, so a capture timestamp older than the
      // last accepted one clamps to 0 elapsed and is refused. Mirror that.
      const elapsed = Math.max(0, ev.t_capture_ms - last);
      if (elapsed < L.cooldownMs) {
        return { ok: false, reason: 'cooldown', detail: `${elapsed}ms into ${L.cooldownMs}ms` };
      }
    }
    w.recentMs = w.recentMs.filter((t) => nowMs - t < 1_000);
    if (w.recentMs.length >= L.maxEventsPerSec) {
      return {
        ok: false,
        reason: 'rate_exceeded',
        detail: `${w.recentMs.length + 1}/s vs limit ${L.maxEventsPerSec}`,
      };
    }

    // Accepted — and only now does any state move.
    w.recentMs.push(nowMs);
    w.lastKindMs.set(ev.kind, ev.t_capture_ms);
    w.highSeq = ev.seq;
    return OK;
  }

  /** Forget a player's screening state. Mirrors `PlausibilityGate::forget`. */
  forget(player: string): void {
    this.players.delete(player);
  }

  reset(): void {
    this.players.clear();
  }
}
