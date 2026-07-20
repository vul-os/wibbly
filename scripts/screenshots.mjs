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
 *      `/products/wibbly/` prefix the mini-site's font URLs assume
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
 * Known headless limitation (measured, not assumed):
 *   Under headless Chromium + SwiftShader, TFJS cannot bring up a backend —
 *   the console reports "Initialization of backend webgpu failed" (no adapter)
 *   and "Initialization of backend webgl failed / WebGL is not supported on
 *   this device". Three.js gets its own WebGL context and the court renders
 *   fine, but `WibblyInput.start()` rejects, the game degrades to the spacebar
 *   fallback, and the camera-preview panel never mounts. So `play.png` shows
 *   the real 3D scene and page chrome WITHOUT the preview overlay.
 *   Run with `--headed` on a machine with a real GPU to capture the preview.
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
// Read off src/main.jsx: `/`, `/about`, `/play` (+ `/tennis` alias), `*` → 404.
// src/pages/game-menu.jsx and game-container.jsx exist in the tree but are not
// mounted by the router, so there is no URL to photograph them at.

const APP_ROUTES = [
  {
    name: 'home',
    path: '/',
    description: 'Home — what wibbly is',
  },
  {
    name: 'about',
    path: '/about',
    description: 'About',
  },
  {
    name: 'play',
    path: '/play',
    description: 'Tennis reference game — Three.js court and page chrome, synthetic camera stream',
    // The game mounts async: WebGL scene, then the GLB court, then getUserMedia
    // + a TFJS model download. Wait on the canvas, then give the rest time.
    waitFor: 'canvas',
    settleMs: 9_000,
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
    path: '/products/wibbly/landing.html',
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

// Serve site/ under BOTH `/` and `/products/wibbly/`. The landing page's font
// and asset URLs are absolute and assume the deployed prefix, so serving it at
// the root alone would photograph a page with fallback system fonts.
async function startSiteServer() {
  siteServer = createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, SITE_BASE).pathname)
    if (rel.startsWith('/products/wibbly')) rel = rel.slice('/products/wibbly'.length)
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
  console.log(`  site ready at ${SITE_BASE}/products/wibbly/`)
}

function teardown() {
  for (const p of children) { try { p.kill('SIGTERM') } catch {} }
  children.length = 0
  if (siteServer) { try { siteServer.close() } catch {} ; siteServer = null }
}

// ── Capture ───────────────────────────────────────────────────────────────────

async function capture(page, base, route, theme) {
  const label = theme ? `${route.name}-${theme}` : route.name
  console.log(`  → ${label}: ${route.description}`)
  try {
    await page.goto(`${base}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })

    if (route.waitFor) {
      await page.waitForSelector(route.waitFor, { timeout: 20_000 })
        .catch(() => console.warn(`     (selector ${route.waitFor} never appeared — capturing anyway)`))
    } else {
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    }
    await page.waitForTimeout(route.settleMs ?? 800)

    const outPath = path.join(OUT, `${label}.png`)
    await page.screenshot({ path: outPath, fullPage: false })
    console.log(`     saved docs/screenshots/${label}.png`)
    return { label, description: route.description, status: 'ok' }
  } catch (err) {
    console.warn(`     FAILED: ${err.message}`)
    return { label, description: route.description, status: 'failed', error: err.message }
  }
}

async function newContext(browser, theme) {
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
  return ctx
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT, { recursive: true })

  console.log('\nwibbly screenshotter')
  console.log(`  app      : ${APP_BASE}${EXTERNAL_URL ? ' (external)' : ''}`)
  console.log(`  site     : ${SITE_BASE}/products/wibbly/`)
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

  // App surfaces — one context, no theming (the app has a single palette).
  {
    const ctx = await newContext(browser, null)
    const page = await ctx.newPage()
    page.on('pageerror', e => console.warn(`     [pageerror] ${e.message}`))
    for (const route of APP_ROUTES) results.push(await capture(page, APP_BASE, route))
    await ctx.close()
  }

  // Mini-site — light and dark.
  for (const route of SITE_ROUTES) {
    for (const theme of route.themes ?? [null]) {
      const ctx = await newContext(browser, theme)
      const page = await ctx.newPage()
      results.push(await capture(page, SITE_BASE, route, theme))
      await ctx.close()
    }
  }

  await browser.close()
  teardown()

  const ok = results.filter(r => r.status === 'ok')
  const failed = results.filter(r => r.status === 'failed')

  console.log(`\nDone — ${ok.length} captured, ${failed.length} failed`)
  for (const r of failed) console.log(`  FAILED ${r.label}: ${r.error}`)

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
    'Headless caveat: under SwiftShader, TFJS cannot initialize a WebGL or WebGPU backend, so',
    '`WibblyInput.start()` rejects, the game falls back to the spacebar path, and the camera',
    'preview panel is absent from `play.png`. The Three.js court and page chrome are real.',
    'Regenerate with `npm run screenshots -- --headed` on a machine with a GPU to include it.',
    '',
    '| File | Surface | Status |',
    '|------|---------|--------|',
    ...results.map(r => `| ${r.label}.png | ${r.description} | ${r.status === 'ok' ? 'captured' : 'FAILED — ' + r.error} |`),
    '',
    'Regenerate: `npm run screenshots`',
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
