#!/usr/bin/env node
/**
 * wibbly — Playwright screenshotter
 *
 * Captures every real surface at 1440×900 into docs/screenshots/.
 *
 * What it does:
 *   1. `vite build` (unless dist/index.html already exists and --no-build is set)
 *   2. `vite preview` on port 4183 — the SPA, with react-router fallback
 *   3. A tiny static server on port 4184 for site/, mounted at the same
 *      `/products/magnetite/wibbly/` prefix the mini-site's font URLs assume
 *   4. Drives Chromium over both, screenshots each route, tears everything down
 *
 * Camera:
 *   wibbly is a webcam app, so Chromium is launched with
 *     --use-fake-device-for-media-stream  (synthetic capture, no real camera)
 *     --use-fake-ui-for-media-stream      (auto-grant, no permission prompt)
 *   The synthetic stream is a rolling test pattern, NOT a person. Pose
 *   detection therefore finds no skeleton and no gesture ever fires. Nothing
 *   here composites or fakes gameplay that did not happen.
 *
 * Known headless behaviour (measured, not assumed):
 *   Under headless Chromium + SwiftShader, TFJS cannot bring up an accelerated
 *   backend — the console reports "Initialization of backend webgpu failed"
 *   (no adapter) and "Initialization of backend webgl failed / WebGL is not
 *   supported on this device". It then falls back to the CPU backend, which
 *   DOES come up, after roughly 10-12 seconds. Consequences:
 *     · the setup flow reaches its live-preview steps for real;
 *     · pose estimation runs, but the synthetic stream is a test pattern, so
 *       checkFraming() honestly reports "no one detected";
 *     · Three.js gets its own WebGL context, so the court renders normally.
 *   The long settle times below are that CPU fallback, not padding.
 *
 * Usage:
 *   npm run screenshots
 *   npm run screenshots -- --no-build          reuse an existing dist/
 *   npm run screenshots -- --headed            real GPU; captures camera preview
 *   BASE_URL=https://wibbly.example npm run screenshots   external app instance
 *
 * Prerequisites (one time):
 *   npm install
 *   npm install -D playwright     # not yet declared in package.json
 *   npx playwright install chromium
 */

import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'docs', 'screenshots')
const SITE = path.join(ROOT, 'site')
const DIST = path.join(ROOT, 'dist')

const NO_BUILD = process.argv.includes('--no-build')
const HEADED   = process.argv.includes('--headed')
const EXTERNAL_URL = process.env.BASE_URL || null

const APP_PORT = 4183
const SITE_PORT = 4184
const APP_BASE = EXTERNAL_URL ?? `http://localhost:${APP_PORT}`
const SITE_BASE = `http://localhost:${SITE_PORT}`

const VIEWPORT = { width: 1440, height: 900 }

// ── Routes ────────────────────────────────────────────────────────────────────
//
// Read off src/main.jsx: `/`, `/setup`, `/play` (+ `/tennis` → /play), `*` → 404.
//
// `/play` redirects first-time visitors to `/setup`, so the play captures seed
// localStorage to look like a returning player. That is a real app state, not a
// staged one — it is exactly what the second visit looks like.

const SEEN_SETUP = { seen: true, outcome: 'camera', at: 1 }

const APP_ROUTES = [
  {
    name: 'title',
    path: '/',
    description: 'Title screen — game selection (tennis playable, soccer/boxing planned)',
  },
  {
    name: 'setup-intro',
    path: '/setup',
    description: 'First-run setup, step 1 — camera explained before the browser prompt fires',
  },
  {
    name: 'setup-handedness',
    path: '/setup',
    description: 'First-run setup, step 2 — handedness, written to Calibration',
    // Press the real button and let the real pipeline start. Headless has no
    // GPU, so TFJS falls back to its CPU backend — slow, but it does come up,
    // which is why this step reaches the live preview at all.
    action: async (page) => {
      await page.getByRole('button', { name: /turn on my camera/i }).click({ force: true, timeout: 60_000 })
      await page.waitForSelector('.wb-setup__hands', { timeout: 60_000 })
      await page.waitForTimeout(2_500)
    },
  },
  {
    name: 'setup-framing',
    path: '/setup',
    description: 'First-run setup, step 3 — live checkFraming() verdict over the camera preview',
    action: async (page) => {
      await page.getByRole('button', { name: /turn on my camera/i }).click({ force: true, timeout: 60_000 })
      await page.waitForSelector('.wb-setup__hands', { timeout: 60_000 })
      // force+long timeout: CPU-backend inference starves the compositor, so
      // Playwright's stability check can otherwise time out on a static button.
      await page.getByRole('button', { name: /check my framing/i }).click({ force: true, timeout: 60_000 })
      // Let the pipeline score real frames. The synthetic stream is a test
      // pattern, not a person, so the honest verdict here is "no one detected".
      await page.waitForTimeout(6_000)
    },
  },
  {
    name: 'play',
    path: '/play',
    description: 'Tennis — Three.js court and HUD, synthetic camera stream',
    storage: SEEN_SETUP,
    // The game mounts async: WebGL scene, then the GLB court, then getUserMedia
    // + a TFJS model download. Wait on the canvas, then give the rest time.
    waitFor: 'canvas',
    settleMs: 16_000,
  },
  {
    name: 'in-game-menu',
    path: '/play',
    description: 'In-game menu over the paused court — Controls tab',
    storage: SEEN_SETUP,
    waitFor: 'canvas',
    settleMs: 16_000,
    action: async (page) => {
      await page.keyboard.press('Escape')
      await page.waitForTimeout(900)
    },
  },
  {
    name: 'in-game-menu-camera',
    path: '/play',
    description: 'In-game menu, Camera tab — real handedness control, disabled planned controls',
    storage: SEEN_SETUP,
    waitFor: 'canvas',
    settleMs: 16_000,
    action: async (page) => {
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
      // Scoped to the tab nav on purpose: the camera preview inset carries a
      // "Collapse camera preview" button that sits EARLIER in the DOM, so an
      // unscoped /camera/i match collapsed the inset and captured the Controls
      // tab instead of this one.
      await page.locator('.menu-tabs .tab-btn', { hasText: /camera/i }).first().click({ force: true, timeout: 60_000 })
      await page.waitForTimeout(500)
    },
  },
  {
    name: 'in-game-menu-settings',
    path: '/play',
    description: 'In-game menu, Settings tab — wired settings vs visibly disabled planned ones',
    storage: SEEN_SETUP,
    waitFor: 'canvas',
    settleMs: 16_000,
    action: async (page) => {
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
      await page.locator('.menu-tabs .tab-btn', { hasText: /settings/i }).first().click({ force: true, timeout: 60_000 })
      await page.waitForTimeout(500)
    },
  },
  {
    name: 'not-found',
    path: '/this-route-does-not-exist',
    description: '404',
  },
]

// The mini-site is a single self-contained page with a light and a dark palette
// resolved before paint from localStorage 'vulos-theme'.
const SITE_ROUTES = [
  {
    name: 'site-landing',
    path: '/products/magnetite/wibbly/landing.html',
    description: 'Mini-site landing page',
    themes: ['light', 'dark'],
    settleMs: 1_200,
  },
]

// ── Process / server management ───────────────────────────────────────────────

const children = []
let siteServer = null

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function waitForHTTP(url, maxMs = 60_000) {
  const deadline = Date.now() + maxMs
  let lastErr = 'no attempt made'
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(2_000) })
      if (r.status < 600) return
    } catch (e) { lastErr = e.message }
    await sleep(400)
  }
  throw new Error(`${url} did not become ready within ${maxMs}ms (last error: ${lastErr})`)
}

function buildApp() {
  if (NO_BUILD && existsSync(path.join(DIST, 'index.html'))) {
    console.log('  reusing existing dist/ (--no-build)')
    return
  }
  console.log('  vite build …')
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' })
  } catch (err) {
    // Surface the REAL compiler output. A broken build must fail loudly here,
    // never quietly produce an empty screenshot set.
    console.error('\n  BUILD FAILED — stdout:\n' + (err.stdout || '(none)'))
    console.error('\n  BUILD FAILED — stderr:\n' + (err.stderr || '(none)'))
    throw new Error('vite build failed; see output above')
  }
  console.log('  built')
}

async function startPreview() {
  console.log(`  vite preview on :${APP_PORT} …`)
  const proc = spawn('npx', ['vite', 'preview', '--port', String(APP_PORT), '--strictPort'], {
    cwd: ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  children.push(proc)
  proc.stdout.on('data', d => process.stdout.write(`  [preview] ${d}`))
  proc.stderr.on('data', d => process.stderr.write(`  [preview] ${d}`))
  await waitForHTTP(`http://localhost:${APP_PORT}/`)
  console.log(`  app ready at ${APP_BASE}`)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
}

// Serve site/ under BOTH `/` and `/products/magnetite/wibbly/`. The landing page's font
// and asset URLs are absolute and assume the deployed prefix, so serving it at
// the root alone would photograph a page with fallback system fonts.
async function startSiteServer() {
  siteServer = createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, SITE_BASE).pathname)
    if (rel.startsWith('/products/magnetite/wibbly')) rel = rel.slice('/products/magnetite/wibbly'.length)
    if (rel === '' || rel === '/') rel = '/landing.html'
    const file = path.join(SITE, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''))
    if (!file.startsWith(SITE) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('not found')
      return
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' })
    res.end(readFileSync(file))
  })
  await new Promise((resolve, reject) => {
    siteServer.once('error', reject)
    siteServer.listen(SITE_PORT, resolve)
  })
  console.log(`  site ready at ${SITE_BASE}/products/magnetite/wibbly/`)
}

function teardown() {
  for (const p of children) { try { p.kill('SIGTERM') } catch {} }
  children.length = 0
  if (siteServer) { try { siteServer.close() } catch {} ; siteServer = null }
}

// ── Capture ───────────────────────────────────────────────────────────────────

// Console errors that are EXPECTED under headless SwiftShader and are not app
// faults: TFJS cannot bring up an accelerated backend (see the header note), so
// it logs WebGPU/WebGL init failures and the app's own pose runtime
// (`[wibbly-input]`) logs its explicit, deliberate fallback to the CPU backend.
// The JS-health guard below filters these out so it only reports genuinely
// unexpected errors — otherwise it would cry wolf on every single run.
const BENIGN_CONSOLE = /Initialization of backend (webgpu|webgl) failed|WebGL is not supported|Automatic fallback to software WebGL|Failed to create WebGL|GroupMarkerNotSet|falling back to CPU|Pose tracking could not start the preferred backend/i

function recordIssues(page, pageIssues) {
  page.on('pageerror', (e) => {
    pageIssues.push({ type: 'pageerror', text: String(e?.message ?? e) })
    console.warn(`     [pageerror] ${e?.message ?? e}`)
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !BENIGN_CONSOLE.test(msg.text())) {
      pageIssues.push({ type: 'console.error', text: msg.text() })
    }
  })
}

async function capture(page, base, route, theme, pageIssues = []) {
  const label = theme ? `${route.name}-${theme}` : route.name
  console.log(`  → ${label}: ${route.description}`)
  const issuesBefore = pageIssues.length
  try {
    await page.goto(`${base}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })

    if (route.waitFor) {
      await page.waitForSelector(route.waitFor, { timeout: 20_000 })
        .catch(() => console.warn(`     (selector ${route.waitFor} never appeared — capturing anyway)`))
    } else {
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    }
    await page.waitForTimeout(route.settleMs ?? 800)

    // Drive the real UI to reach a state that has no URL of its own (menu
    // tabs, setup steps). Real clicks and real keystrokes only.
    if (route.action) await route.action(page)

    const outPath = path.join(OUT, `${label}.png`)
    // Generous timeout: with no GPU, TFJS runs pose estimation on the CPU and
    // can starve the compositor enough to miss the 30s default.
    await page.screenshot({ path: outPath, fullPage: false, timeout: 90_000 })
    console.log(`     saved docs/screenshots/${label}.png`)
    return { label, description: route.description, status: 'ok', issues: pageIssues.slice(issuesBefore) }
  } catch (err) {
    console.warn(`     FAILED: ${err.message}`)
    return { label, description: route.description, status: 'failed', error: err.message, issues: pageIssues.slice(issuesBefore) }
  }
}

async function newContext(browser, theme, appStorage) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: theme ?? 'dark',
    locale: 'en-US',
    permissions: ['camera'],
  })
  if (theme) {
    await ctx.addInitScript(t => { try { localStorage.setItem('vulos-theme', t) } catch {} }, theme)
  }
  if (appStorage) {
    await ctx.addInitScript(s => {
      try { localStorage.setItem('wibbly.setup.v1', JSON.stringify(s)) } catch {}
    }, appStorage)
  }
  return ctx
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT, { recursive: true })

  console.log('\nwibbly screenshotter')
  console.log(`  app      : ${APP_BASE}${EXTERNAL_URL ? ' (external)' : ''}`)
  console.log(`  site     : ${SITE_BASE}/products/magnetite/wibbly/`)
  console.log(`  output   : docs/screenshots/`)
  console.log(`  viewport : ${VIEWPORT.width}×${VIEWPORT.height} @2x`)
  console.log(`  browser  : ${HEADED ? 'headed (real GPU)' : 'headless (SwiftShader)'}`)
  console.log('  camera   : synthetic (fake device) — a rolling test pattern, not a person,')
  console.log('             so no skeleton is detected and no gesture fires. Expected.')
  if (!HEADED) {
    console.log('             Headless SwiftShader also fails TFJS backend init, so the camera')
    console.log('             preview panel does not mount in play.png. Use --headed for that.')
  }
  console.log('')

  if (!EXTERNAL_URL) {
    buildApp()
    await startPreview()
  }
  await startSiteServer()

  const browser = await chromium.launch({
    headless: !HEADED,
    args: [
      // Auto-grant getUserMedia and feed it a synthetic stream, so the app runs
      // end to end on a machine with no camera and no human in front of it.
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      // TFJS wants a GL context in headless Chromium.
      '--use-gl=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
    ],
  })

  const results = []

  // App surfaces. One context per route: several of them differ only by
  // localStorage (first run vs returning player), and a shared context would
  // leak that state between captures.
  for (const route of APP_ROUTES) {
    const ctx = await newContext(browser, null, route.storage)
    const page = await ctx.newPage()
    const pageIssues = []
    recordIssues(page, pageIssues)
    results.push(await capture(page, APP_BASE, route, undefined, pageIssues))
    await ctx.close()
  }

  // Mini-site — light and dark.
  for (const route of SITE_ROUTES) {
    for (const theme of route.themes ?? [null]) {
      const ctx = await newContext(browser, theme)
      const page = await ctx.newPage()
      const pageIssues = []
      recordIssues(page, pageIssues)
      results.push(await capture(page, SITE_BASE, route, theme, pageIssues))
      await ctx.close()
    }
  }

  await browser.close()
  teardown()

  const ok = results.filter(r => r.status === 'ok')
  const failed = results.filter(r => r.status === 'failed')

  console.log(`\nDone — ${ok.length} captured, ${failed.length} failed`)
  for (const r of failed) console.log(`  FAILED ${r.label}: ${r.error}`)

  // JS-health guard (parity with the cackle/magnetite screenshotters). A saved
  // screenshot proves a surface painted, not that it ran cleanly — collect
  // console errors + uncaught exceptions per surface (minus the known-benign
  // headless-GPU noise, see BENIGN_CONSOLE) and surface them so a page that is
  // actually throwing is never silently shipped as "captured". Non-fatal.
  const withIssues = results.filter((r) => r.issues && r.issues.length)
  if (withIssues.length) {
    const total = withIssues.reduce((n, r) => n + r.issues.length, 0)
    console.warn(`\n  WARNING: ${total} console error(s)/uncaught exception(s) across ${withIssues.length} capture(s):`)
    for (const r of withIssues) {
      console.warn(`    ${r.label} — ${r.issues.length}:`)
      for (const it of r.issues.slice(0, 3)) {
        console.warn(`        ${it.type}: ${it.text.replace(/\s+/g, ' ').slice(0, 160)}`)
      }
    }
    console.warn('  A clean-looking screenshot of a page that threw is a false positive.')
  } else if (ok.length) {
    console.log('  no unexpected console errors or uncaught exceptions during capture')
  }

  writeFileSync(path.join(OUT, 'README.md'), [
    '# docs/screenshots',
    '',
    'Generated by `npm run screenshots` (`scripts/screenshots.mjs`). Do not edit by hand.',
    '',
    'Captured at 1440×900 @2x in Chromium with a **synthetic camera**',
    '(`--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`). That stream is a',
    'rolling test pattern, not a person, so no pose is detected and no gesture ever fires.',
    'Nothing here is composited or staged.',
    '',
    'Headless caveat: under SwiftShader, TFJS cannot initialize a WebGL or WebGPU backend and',
    'falls back to its CPU backend, which takes ~10-12s to come up. The pipeline therefore does',
    'run — the setup screens show a live preview — but it is looking at a test pattern, so no',
    'skeleton is drawn and the framing check correctly reports that it can see no one. Run',
    '`npm run screenshots -- --headed` on a machine with a GPU (and a person in frame) to see',
    'tracking actually succeed.',
    '',
    '| File | Surface | Status |',
    '|------|---------|--------|',
    ...results.map(r => `| ${r.label}.png | ${r.description} | ${r.status === 'ok' ? 'captured' : 'FAILED — ' + r.error} |`),
    '',
    '## Demo build (`demo-*.png`)',
    '',
    'These come from a DIFFERENT script — `npm run verify:demo`',
    '(`scripts/verify-demo.mjs`) — not from this one, so `npm run screenshots` neither',
    'produces nor refreshes them. They are captured at 1000×640, an iframe-shaped',
    'viewport rather than a desktop one, against `dist-demo/` served under the real',
    '`/products/magnetite/wibbly/play/` sub-path with the production CSP applied, and with',
    'ANGLE/SwiftShader enabled so TFJS gets a real (software) WebGL backend.',
    '',
    '| File | Surface |',
    '|------|---------|',
    '| demo-intro.png | The whole of demo onboarding — camera explainer and handedness on one card |',
    '| demo-play.png | Demo tennis with the camera live, "Demo" marker in the HUD |',
    '| demo-magnetite-cta.png | The dismissible magnetite panel, including the "does not work yet" warning |',
    '| demo-spacebar.png | The camera-denied path — still playable on the spacebar |',
    '| demo-iframe.png | The demo inside a 420px same-origin iframe |',
    '',
    'Regenerate: `npm run screenshots` (app) · `npm run verify:demo` (demo)',
    '',
  ].join('\n'))
  console.log('  wrote docs/screenshots/README.md\n')

  if (failed.length > 0) process.exit(1)
}

main().catch(err => {
  teardown()
  console.error('\nFatal:', err.message)
  process.exit(1)
})
