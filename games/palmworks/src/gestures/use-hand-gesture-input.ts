import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { HandInput, type GestureEvent } from '@vulos/wibbly-input/hand';
import { GestureController } from './gesture-controller';
import { PlacementRouter, type LocateResult } from './placement-router';
import { VirtualPointer, mirrorX } from './virtual-pointer';
import type { GestureRaycastHandle } from '../pages/viz/components/GestureRaycastBridge';
import type { PlantSceneHandle } from '../pages/viz/components/PlantScene';

export type HandGestureStatus = 'idle' | 'starting' | 'live' | 'unavailable';

export interface UseHandGestureInputOptions {
  sceneRef: RefObject<PlantSceneHandle | null>;
  raycastRef: RefObject<GestureRaycastHandle | null>;
}

export interface HandGestureInputState {
  status: HandGestureStatus;
  /** Set on 'unavailable' — a human-readable reason, never a raw exception. */
  message: string | null;
  /** Last known cursor position in viewport pixels, for an on-screen indicator. Null when not live. */
  cursor: { clientX: number; clientY: number } | null;
  start: () => void;
  stop: () => void;
}

/** DOM attribute PlantworksViz's palette buttons carry — see index.tsx. */
const PALETTE_TYPE_ATTR = 'data-component-type';

function locateFromDom(clientX: number, clientY: number): LocateResult {
  const el = document.elementFromPoint(clientX, clientY);
  const paletteEl = el?.closest(`[${PALETTE_TYPE_ATTR}]`);
  const componentType = paletteEl?.getAttribute(PALETTE_TYPE_ATTR);
  if (componentType) return { kind: 'palette', componentType };
  return { kind: 'other' };
}

/**
 * Wires the platform's hand-tracking seam (`HandInput`, `@vulos/wibbly-
 * input/hand`) to this game's existing mouse-driven engine: point supplies a
 * cursor, pinch supplies down/move/up, `PlacementRouter` picks off palette
 * pick-ups, and everything else goes through `VirtualPointer` as real DOM
 * events — see that file's module doc for exactly why that reuses
 * `PlantScene`'s real, unmodified click/drag handlers.
 *
 * Camera permission: `HandInput` (like `WibblyInput`, the tennis
 * equivalent) only touches `getUserMedia` inside `start()` — never at
 * construction, never at import time. This hook mirrors that: nothing here
 * runs until the caller invokes the returned `start()`, which
 * `index.tsx` wires to an explicit "Enable hand tracking" button, never to
 * mount.
 */
export function useHandGestureInput({ sceneRef, raycastRef }: UseHandGestureInputOptions): HandGestureInputState {
  const [status, setStatus] = useState<HandGestureStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ clientX: number; clientY: number } | null>(null);

  const handInputRef = useRef<HandInput | null>(null);
  const controllerRef = useRef<GestureController>(new GestureController());
  const placementRef = useRef<PlacementRouter | null>(null);
  const pointerRef = useRef<VirtualPointer | null>(null);
  // Guards start() against being invoked twice concurrently (a double
  // click on "Enable hand tracking" before the first call resolves).
  const startingRef = useRef(false);

  const toClientPoint = useCallback((x: number, y: number) => {
    // mirrorX: a front-facing camera is not a mirror — see virtual-
    // pointer.ts's own doc comment on why the display flips x.
    return {
      clientX: mirrorX(x) * (typeof window !== 'undefined' ? window.innerWidth : 0),
      clientY: y * (typeof window !== 'undefined' ? window.innerHeight : 0),
    };
  }, []);

  const stop = useCallback(() => {
    handInputRef.current?.stop();
    handInputRef.current = null;
    controllerRef.current.reset();
    placementRef.current?.reset();
    pointerRef.current?.reset();
    startingRef.current = false;
    setStatus('idle');
    setCursor(null);
  }, []);

  const start = useCallback(() => {
    if (handInputRef.current || startingRef.current) return;

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      // No crash, no dead screen — a clear, honest message. Mouse play is
      // completely unaffected; this only concerns the gesture layer.
      setStatus('unavailable');
      setMessage('No camera API is available in this browser. Palmworks stays fully playable with the mouse.');
      return;
    }

    startingRef.current = true;
    setStatus('starting');
    setMessage(null);

    const placement = new PlacementRouter({
      locate: (x, y) => {
        const { clientX, clientY } = toClientPoint(x, y);
        return locateFromDom(clientX, clientY);
      },
      raycastGround: (x, y) => {
        const { clientX, clientY } = toClientPoint(x, y);
        return raycastRef.current?.screenToGround(clientX, clientY) ?? null;
      },
      onPlace: (componentType, worldX, worldZ) => {
        sceneRef.current?.addObject(componentType, { x: worldX, z: worldZ });
      },
    });
    placementRef.current = placement;

    const pointer = new VirtualPointer({ toClientPoint });
    pointerRef.current = pointer;

    const hand = new HandInput({
      onGesture: (event: GestureEvent) => {
        if (event.vector) setCursor(toClientPoint(event.vector.x, event.vector.y));
        for (const command of controllerRef.current.feed(event)) {
          const consumedByPlacement = placement.route(command);
          if (!consumedByPlacement) pointer.dispatch(command);
        }
      },
      onError: (err) => {
        console.error('[palmworks] hand-gesture pipeline error:', err);
      },
    });
    handInputRef.current = hand;

    hand
      .start()
      .then(() => {
        startingRef.current = false;
        if (handInputRef.current !== hand) return; // stop() ran while starting
        setStatus('live');
      })
      .catch((err: unknown) => {
        startingRef.current = false;
        // Camera denied, no hand-tracking assets vendored, WASM blocked by
        // CSP, or a machine with no webcam at all — every one of these is
        // the documented, supported "no camera" path, never a crash. Mouse
        // play was never touched.
        const reason = err instanceof Error ? err.message : String(err);
        console.warn('[palmworks] hand tracking unavailable, staying mouse-only:', err);
        setStatus('unavailable');
        setMessage(`Hand tracking is unavailable (${reason}). Palmworks stays fully playable with the mouse.`);
        handInputRef.current = null;
      });
  }, [sceneRef, raycastRef, toClientPoint]);

  // Unmount safety net: never leave a camera running behind a torn-down page.
  useEffect(() => {
    return () => {
      handInputRef.current?.stop();
      handInputRef.current = null;
    };
  }, []);

  return { status, message, cursor, start, stop };
}
