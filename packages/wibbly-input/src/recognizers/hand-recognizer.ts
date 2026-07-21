import { landmarkInFrame, type BoundHand, type GestureEvent, type PlayerId } from '../types';

/**
 * §3.3 seam, hand half — hand skeletons → game events. Same family as
 * `GestureRecognizer` (recognizers/swing.ts), kept as a separate interface
 * rather than widened onto it because the two operate over genuinely
 * different skeleton shapes (`BoundPerson` vs `BoundHand`) — forcing them onto
 * one signature would mean either union-typing every recognizer's input or
 * smuggling hands through as fake People, both worse than two small parallel
 * interfaces.
 */
export interface HandGestureRecognizer {
  feed(hands: BoundHand[], tNow: number): GestureEvent[];
  reset(playerId?: PlayerId): void;
}

/**
 * Per-landmark usability gate shared by every hand recognizer: a landmark is
 * usable only if it is both confidently detected AND still plausibly in
 * frame. Neither check alone is sufficient — see the doc comments on
 * `Hand`/`landmarkInFrame` in types.ts for why MediaPipe's `visibility` field
 * cannot be trusted on its own to flag a partially-off-screen hand.
 *
 * NOTE ON `visibility`/score RELIABILITY (read before tuning `minScore`):
 * this package could not verify against a real MediaPipe HandLandmarker run
 * (no GPU/browser in this environment) whether `visibility` is populated
 * meaningfully for hand landmarks the way it is for BlazePose body landmarks
 * — MediaPipe's own NormalizedLandmark type is shared across all Tasks Vision
 * solutions and some solutions leave it at a constant. If it turns out to be
 * always ~1 for hands in practice, `landmarkInFrame` becomes the load-bearing
 * check and `minScore` becomes a no-op — which is a safe direction to be
 * wrong in (never MORE willing to reject a real hand), not a silent failure.
 */
export function usableLandmark(
  lm: { x: number; y: number; score: number } | undefined,
  minScore: number,
): boolean {
  return !!lm && lm.score >= minScore && landmarkInFrame(lm);
}

/**
 * Generic hysteresis + debounce state machine, shared by PinchRecognizer and
 * PointRecognizer. Both gestures reduce to "is some continuous signal past a
 * threshold", and both have the same failure mode: a signal hovering right at
 * one threshold flips on/off every frame ("chatter" — explicitly called out
 * as a hard case this library must handle). Two independent fixes stacked,
 * because either alone is insufficient:
 *
 *   - HYSTERESIS: entering and leaving are governed by two different
 *     predicates with a gap between them, so a signal sitting in the gap
 *     cannot retrigger without an unambiguous move past the FAR side.
 *   - DEBOUNCE: entering additionally requires `enterFrames` consecutive
 *     qualifying frames, so a single noisy frame cannot start a gesture the
 *     very next tick reverses.
 *
 * Generic over `T` rather than fixed to `number`: PinchRecognizer's signal is
 * one scalar ratio, but PointRecognizer's is four finger-extension ratios at
 * once — a single-number gate would force an artificial reduction of that
 * tuple before the caller even gets a chance to reason about it consistently
 * with its own predicates.
 *
 * A brief tracking dropout (hand at the frame edge for one frame) must NOT
 * immediately end an active gesture — see `feedMissing`.
 */
export class HysteresisGate<T> {
  private active = false;
  private streak = 0;
  private missed = 0;

  constructor(
    private readonly shouldEnter: (value: T) => boolean,
    private readonly shouldExit: (value: T) => boolean,
    private readonly enterFrames: number,
    private readonly maxMissedFrames: number,
  ) {}

  get isActive(): boolean {
    return this.active;
  }

  /** Feed a real measurement for this frame. */
  feed(value: T): 'enter' | 'exit' | 'hold' | null {
    this.missed = 0;

    if (!this.active) {
      if (this.shouldEnter(value)) {
        this.streak += 1;
        if (this.streak >= this.enterFrames) {
          this.active = true;
          this.streak = 0;
          return 'enter';
        }
      } else {
        this.streak = 0;
      }
      return null;
    }

    if (this.shouldExit(value)) {
      this.active = false;
      this.streak = 0;
      return 'exit';
    }
    return 'hold';
  }

  /** Feed "no usable measurement this frame" (occluded, low confidence, out of frame). */
  feedMissing(): 'exit' | null {
    if (!this.active) {
      this.streak = 0;
      return null;
    }
    this.missed += 1;
    if (this.missed > this.maxMissedFrames) {
      this.active = false;
      this.missed = 0;
      return 'exit';
    }
    return null;
  }

  reset(): void {
    this.active = false;
    this.streak = 0;
    this.missed = 0;
  }
}

/**
 * Per-(player, hand) state key. A player has at most one left and one right
 * hand, so `handedness` is sufficient sub-identity WITHOUT a full hand
 * binder — see the module doc in pinch.ts for the honest limitation this
 * implies (a second, unrelated person's hand can only be told apart from the
 * primary player's if something upstream already gave it a different
 * `playerId`; this package ships no such multi-person hand binder yet).
 */
export function handStateKey(playerId: PlayerId, handedness: 'left' | 'right'): string {
  return `${playerId}:${handedness}`;
}
