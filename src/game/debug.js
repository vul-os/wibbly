// Opt-in debug logging for the tennis game.
//
// The game logic used to call `console.log` directly on the hot path — every
// animation frame, every collision check, every AI decision. That spammed the
// browser console for real players (and the test runner) and added per-frame
// overhead. These logs are genuinely useful when developing the game, so
// rather than delete them we route them through here, OFF by default.
//
// Turn it on explicitly:
//   • append `?debug=1` to the play URL, or
//   • run `localStorage.setItem('wibbly:debug', '1')` in the console, or
//   • call `setDebugEnabled(true)` from code.
//
// In a non-browser context (Node, the vitest runner) there is no `window`, so
// it stays off — which is why the unit tests no longer print collision spam.

let enabled = false;

try {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location?.search ?? '');
    const viaQuery = params.get('debug') === '1';
    const viaStorage = window.localStorage?.getItem('wibbly:debug') === '1';
    enabled = viaQuery || viaStorage;
  }
} catch {
  // Sandboxed iframe / storage disabled / SSR — stay off.
  enabled = false;
}

/** Enable or disable debug logging at runtime. */
export function setDebugEnabled(on) {
  enabled = !!on;
}

/** Whether debug logging is currently on. */
export function isDebugEnabled() {
  return enabled;
}

/** console.log, but only when debug logging is enabled. */
export function debugLog(...args) {
  if (enabled) {
    console.log(...args);
  }
}
