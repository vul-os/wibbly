/**
 * The pre-flight is a mirror of magnetite's `PlausibilityGate`, so these tests
 * are deliberately parallel to the Rust tests in `input.rs` — same scenarios,
 * same expected verdicts. If one side changes, the pair should disagree.
 *
 * Reminder while reading: passing this gate proves nothing. It is a local
 * optimisation to avoid spending server-side rate budget.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PREFLIGHT_LIMITS, PreflightGate } from '../src/preflight';
import type { AttestedEventWire } from '../src/wire';

const P1 = 'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c';
const P2 = '11'.repeat(32);

function ev(over: Partial<AttestedEventWire> = {}): AttestedEventWire {
  return {
    player: P1,
    kind: 'swing',
    confidence: 0.9,
    vector: [1, 0, 0],
    speed_mps: 6,
    t_capture_ms: 10_000,
    seq: 1,
    ...over,
  };
}

describe('PreflightLimits defaults', () => {
  it('match PlausibilityLimits::default() in input.rs', () => {
    expect(DEFAULT_PREFLIGHT_LIMITS).toEqual({
      maxEventsPerSec: 20,
      cooldownMs: 100,
      maxSpeedMps: 20.0,
      minConfidence: 0.35,
      maxFutureSkewMs: 2_000,
      maxAgeMs: 5_000,
      acceptedKinds: [],
    });
  });
});

describe('PreflightGate', () => {
  let g: PreflightGate;
  beforeEach(() => {
    g = new PreflightGate();
  });

  it('admits a plausible event', () => {
    expect(g.admit(ev(), 10_000)).toEqual({ ok: true });
  });

  it('refuses superhuman speed', () => {
    const r = g.admit(ev({ speed_mps: 400 }), 10_000);
    expect(r).toMatchObject({ ok: false, reason: 'speed_unreachable' });
  });

  it('admits at exactly the speed ceiling — the boundary is inclusive, as in Rust', () => {
    // Rust: `s > self.limits.max_speed_mps` — strictly greater is refused.
    expect(g.admit(ev({ speed_mps: 20 }), 10_000).ok).toBe(true);
  });

  it('refuses a same-kind event inside its cooldown but not a different kind', () => {
    const gate = new PreflightGate({ cooldownMs: 500 });
    expect(gate.admit(ev({ seq: 1, t_capture_ms: 10_000 }), 10_000).ok).toBe(true);
    expect(gate.admit(ev({ seq: 2, t_capture_ms: 10_100 }), 10_100)).toMatchObject({
      reason: 'cooldown',
    });
    // Different kind, own clock.
    expect(gate.admit(ev({ kind: 'punch', seq: 3, t_capture_ms: 10_100 }), 10_100).ok).toBe(true);
    // Same kind, after the cooldown.
    expect(gate.admit(ev({ seq: 4, t_capture_ms: 10_600 }), 10_600).ok).toBe(true);
  });

  it('caps events per second per player, and each player has their own budget', () => {
    const gate = new PreflightGate({ maxEventsPerSec: 3, cooldownMs: 0 });
    for (let s = 1; s <= 3; s++) {
      expect(gate.admit(ev({ seq: s, t_capture_ms: 10_000 + s }), 10_000 + s).ok).toBe(true);
    }
    expect(gate.admit(ev({ seq: 9, t_capture_ms: 10_010 }), 10_010)).toMatchObject({
      reason: 'rate_exceeded',
    });
    expect(gate.admit(ev({ player: P2, seq: 1, t_capture_ms: 10_010 }), 10_010).ok).toBe(true);
    // The window slides.
    expect(gate.admit(ev({ seq: 10, t_capture_ms: 11_500 }), 11_500).ok).toBe(true);
  });

  it('does not let rejected events consume the honest rate budget', () => {
    const gate = new PreflightGate({ maxEventsPerSec: 2, cooldownMs: 0 });
    for (let i = 0; i < 10; i++) {
      expect(gate.admit(ev({ speed_mps: 999 }), 10_000).ok).toBe(false);
    }
    expect(gate.admit(ev({ seq: 1, t_capture_ms: 10_000 }), 10_000).ok).toBe(true);
    expect(gate.admit(ev({ seq: 2, t_capture_ms: 10_001 }), 10_001).ok).toBe(true);
  });

  it('refuses replayed or non-advancing sequence numbers', () => {
    const gate = new PreflightGate({ cooldownMs: 0 });
    expect(gate.admit(ev({ seq: 5, t_capture_ms: 10_000 }), 10_000).ok).toBe(true);
    expect(gate.admit(ev({ seq: 5, t_capture_ms: 10_100 }), 10_100)).toMatchObject({
      reason: 'sequence_replayed',
    });
    expect(gate.admit(ev({ seq: 4, t_capture_ms: 10_100 }), 10_100)).toMatchObject({
      reason: 'sequence_replayed',
    });
    expect(gate.admit(ev({ seq: 6, t_capture_ms: 10_100 }), 10_100).ok).toBe(true);
  });

  it('refuses nonsense confidence', () => {
    for (const c of [0.01, NaN, 1.5, -0.1, Infinity]) {
      expect(g.admit(ev({ confidence: c }), 10_000)).toMatchObject({
        reason: 'implausible_confidence',
      });
    }
  });

  it('admits exactly at the confidence floor', () => {
    expect(g.admit(ev({ confidence: 0.35 }), 10_000).ok).toBe(true);
  });

  it('refuses timestamps too far in the future or too far in the past', () => {
    expect(g.admit(ev({ t_capture_ms: 99_000_000 }), 10_000)).toMatchObject({
      reason: 'future_timestamp',
    });
    expect(g.admit(ev({ t_capture_ms: 1_000 }), 10_000_000)).toMatchObject({
      reason: 'stale_timestamp',
    });
    // Inside the tolerated skew is fine.
    expect(g.admit(ev({ t_capture_ms: 11_500 }), 10_000).ok).toBe(true);
  });

  it('refuses kinds outside an allowlist when one is set', () => {
    const gate = new PreflightGate({ acceptedKinds: ['swing'] });
    expect(gate.admit(ev({ seq: 1, t_capture_ms: 10_000 }), 10_000).ok).toBe(true);
    expect(gate.admit(ev({ kind: 'teleport', seq: 2, t_capture_ms: 10_500 }), 10_500)).toMatchObject(
      { reason: 'unknown_kind' },
    );
  });

  it('checks in the same order as the Rust gate', () => {
    // An event that is bad in several ways must report the FIRST failure the
    // server would report, or a local log will not match a server log.
    const gate = new PreflightGate({ acceptedKinds: ['swing'] });
    const awful = ev({ kind: 'teleport', confidence: 5, speed_mps: 900, t_capture_ms: 0 });
    expect(gate.admit(awful, 10_000).reason).toBe('unknown_kind');
    const noKindProblem = ev({ confidence: 5, speed_mps: 900, t_capture_ms: 0 });
    expect(gate.admit(noKindProblem, 10_000).reason).toBe('implausible_confidence');
  });

  it('forgets only the named player', () => {
    const gate = new PreflightGate({ cooldownMs: 0 });
    gate.admit(ev({ seq: 9, t_capture_ms: 10_000 }), 10_000);
    gate.admit(ev({ player: P2, seq: 9, t_capture_ms: 10_000 }), 10_000);
    gate.forget(P1);
    expect(gate.admit(ev({ seq: 1, t_capture_ms: 10_100 }), 10_100).ok).toBe(true);
    expect(gate.admit(ev({ player: P2, seq: 1, t_capture_ms: 10_100 }), 10_100)).toMatchObject({
      reason: 'sequence_replayed',
    });
  });

  it('accepts a plausible synthetic event — this is the documented ceiling', () => {
    // Mirrors magnetite's a_plausible_synthetic_event_is_indistinguishable_from
    // _a_real_one. Hand-written numbers, no camera involved, admitted. Neither
    // this gate nor the server's can tell the difference, and no later check
    // can either. The test exists so the limit stays written down.
    const fabricated = ev({ confidence: 0.97, vector: [0, 1, 0], speed_mps: 7.5, seq: 1 });
    expect(g.admit(fabricated, 10_000).ok).toBe(true);
  });
});
