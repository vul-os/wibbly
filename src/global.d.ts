/**
 * Global `window` augmentations for the runtime hooks the app itself sets.
 *
 * The mode/model/peer-transport overrides (`__WIBBLY_MODE__`,
 * `__WIBBLY_MODEL_URL__`, `__WIBBLY_PEER_TRANSPORT__`) are declared locally as
 * a `WibblyWindow`-shaped parameter in src/mode.ts instead, so that its
 * resolver functions stay pure and testable against a plain object with no
 * dependency on this global augmentation. This file covers the remaining
 * diagnostic globals the app writes onto the real `window` at runtime.
 */
import type { AuthorityFailure, AuthorityTelemetry } from '../games/tennis/magnetite-authority';
import type { BackendInfo } from '@vulos/wibbly-input';

declare global {
  interface Window {
    /** Live magnetite authority telemetry, or a failure record — see games/tennis/game.tsx. */
    __WIBBLY_MAGNETITE__?: AuthorityTelemetry | AuthorityFailure;
    /** Which pose-tracker backend actually got selected — see src/pages/demo.tsx. */
    __WIBBLY_BACKEND__?: BackendInfo;
  }
}

export {};
