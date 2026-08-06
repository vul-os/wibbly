import { defineConfig } from 'vitest/config';

/**
 * palmworks had no test runner at all before the gesture-input work this
 * config supports — see src/gestures/**. jsdom (not vite's default 'node')
 * because the DOM-adapter layer (virtual-pointer.ts) needs a real `document`
 * to dispatch synthetic PointerEvents against and read them back; the pure
 * logic tests (gesture-controller, plant-scene-logic) do not care either way.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'jsdom',
  },
});
