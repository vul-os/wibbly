import { defineConfig } from 'vite';

/**
 * There was no vite.config.js before this, and the normal build must keep
 * behaving exactly as it did. So every value below defaults to what Vite
 * already assumed — `base: '/'`, `outDir: 'dist'` — and only changes when the
 * demo build sets the env vars.
 *
 * WIBBLY_BASE is the important one. The demo is dropped at
 * `/products/wibbly/play/` on the marketing site; without a matching `base`
 * every hashed asset is requested from `/assets/...`, which does not exist
 * there, and the page 404s its way to a blank screen. The vendored model is
 * resolved against `import.meta.env.BASE_URL` in src/mode.js for the same
 * reason.
 *
 *   npm run build        → base '/',                        dist/
 *   npm run build:demo   → base '/products/wibbly/play/',    dist-demo/
 */
export default defineConfig(() => ({
  base: process.env.WIBBLY_BASE || '/',
  build: {
    outDir: process.env.WIBBLY_OUTDIR || 'dist',
    emptyOutDir: true,
  },
}));
