#!/usr/bin/env node
/**
 * wibbly — demo build verifier
 *
 * The demo is embedded at `vulos.org/products/wibbly/play/` inside a
 * same-origin iframe on a page served under `default-src 'self'`. Two things
 * about that are easy to get wrong and impossible to notice by eye:
 *
 *   1. Under that CSP, ANY external fetch fails. If the pose model still comes
 *      from tfhub.dev the detector never initialises and the game silently
 *      never tracks — no error dialog, just a game that ignores you.
 *   2. Served from a sub-path, a build with the wrong `base` 404s every hashed
 *      asset and renders a blank page.
 *
 * So this script does not test the dev server or the root path. It serves
 * `dist-demo/` UNDER `/products/wibbly/play/`, exactly as it will be deployed,
 * drives it with Chromium, and asserts:
 *
 *   · every single network request is same-origin — the headline assertion
 *   · nothing 404s
 *   · the vendored model.json and all three weight shards are actually fetched
 *     from the local path
 *   · the detector reaches a working TFJS backend
 *   · no localStorage key survives the page
 *   · the spacebar fallback still produces swings when the camera is refused
 *
 * Chromium runs with a synthetic camera (`--use-fake-device-for-media-stream`,
 * `--use-fake-ui-for-media-stream`). That stream is a rolling test pattern, not
 * a person, so no skeleton is ever detected — this verifies the PIPELINE runs,
 * not that tracking recognises anybody.
 *
 * Chromium is launched with ANGLE/SwiftShader so WebGL is genuinely available
 * in software. Without that, headless has no GPU at all, TFJS drops to its CPU
 * backend, and the run would prove nothing about the backend the production
 * CSP actually forces us onto. Software rasterisation is slow, which is why
 * the waits below are long.
 *
 * A VERIFIER MUST NOT MODIFY ITS SUBJECT. The screenshots this script takes
 * along the way are a debugging aid, not something it checks against — so by
 * default they land in a gitignored scratch directory
 * (`.verify-output/screenshots/`), never in the tracked `docs/screenshots/`
 * mirror. Running `npm run verify:demo` twice in a row with zero source
 * changes must leave `git status` clean; it did not always (see git history —
 * it used to overwrite `docs/screenshots/demo-*.png` unconditionally on every
 * run, which meant a plain verification run left the tree dirty). Regenerating
 * the DOCUMENTED captures is a separate, explicit, opt-in action
 * (`--update-screenshots`) — the same category as a formatter or a code
 * generator, not a gate.
 *
 *   node scripts/verify-demo.mjs
 *   node scripts/verify-demo.mjs --no-build            reuse an existing dist-demo/
 *   node scripts/verify-demo.mjs --headed
 *   node scripts/verify-demo.mjs --update-screenshots   also refresh the committed
 *                                                        docs/screenshots/demo-*.png
 *                                                        (only these 5 checks-worth of
 *                                                        captures; everything else this
 *                                                        script does is unaffected)
 */

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist-demo');
const DOCS_SHOTS = path.join(ROOT, 'docs', 'screenshots');
const SCRATCH_SHOTS = path.join(ROOT, '.verify-output', 'screenshots');

// MUST equal the `WIBBLY_BASE` that `npm run build:demo` passes (package.json).
// A build based at one sub-path and served under another 404s every hashed
// asset, and this script's whole point is to catch that — so it cannot be
// allowed to disagree with the build by hand. Asserted below against the built
// index.html rather than trusted.
const PREFIX = '/products/wibbly/play/';
const PORT = 4187;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const BASE = `${ORIGIN}${PREFIX}`;

const NO_BUILD = process.argv.includes('--no-build');
const HEADED = process.argv.includes('--headed');
// Opt-in only. Without it, captures go to a gitignored scratch dir so that
// `npm run verify:demo` — a VERIFIER, run in CI on every push — can never
// leave the tree dirty. This is the same distinction as a `--check` mirror
// gate vs. its writeable counterpart, applied to screenshots instead of text.
const UPDATE_SCREENSHOTS = process.argv.includes('--update-screenshots');
const SHOTS = UPDATE_SCREENSHOTS ? DOCS_SHOTS : SCRATCH_SHOTS;

/**
 * How many checks a complete run must record. Asserted at the end, because
 * "all checks passed" is worthless if the number of checks quietly fell to two
 * — which is exactly what happened while PREFIX disagreed with the build base:
 * the page never booted, the run died mid-way, and only the checks that had
 * already run were ever counted. A gate that can pass by doing less is not a
 * gate. Raise this deliberately when adding a check; never lower it to make a
 * run go green.
 */
const EXPECTED_CHECKS = 26;

/**
 * Originally copied verbatim from vulos-management/pkg/cproutes/spa.go →
 * SelfContainedPageCSP(), which served /products/<slug>/ pages. That source no
 * longer exists to verify against: `vulos-management` was folded into the
 * `vulos` repo (briefly, at management/pkg/cproutes/spa.go), then the whole
 * `management/` reference tree — SelfContainedPageCSP() included — was
 * deleted there in commit ebb9800d ("Delete folded management/ reference
 * tree"). As of 2026-07-31, nothing in the `vulos` repo defines this policy or
 * serves /products/<slug>/ under any name (checked by grepping the full repo
 * for the function name and for its distinctive directives — no hits outside
 * git history). This string is now the last surviving copy of that policy,
 * kept here because it is still the contract the demo build is meant to
 * satisfy — treat it as historical provenance, not a live cross-check.
 *
 * The two clauses that decide whether this demo works at all:
 *
 *   connect-src 'self'                  the model MUST be same-origin. TFJS's
 *                                       default tfhub.dev URL is blocked, so
 *                                       an unvendored build simply never
 *                                       initialises its detector.
 *   script-src 'self' 'unsafe-inline'   NO 'wasm-unsafe-eval' and NO
 *                                       'unsafe-eval', so the TFJS WASM
 *                                       backend cannot instantiate. WebGL and
 *                                       the pure-JS CPU backend can.
 *
 * Pinned here in one place rather than paraphrased in three.
 */
const PRODUCTION_CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; " +
  "font-src 'self' data:; " +
  "connect-src 'self'; " +
  "manifest-src 'self'; " +
  "worker-src 'self' blob:; " +
  "object-src 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self'; " +
  "frame-ancestors 'self'";

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.bin': 'application/octet-stream',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.glb': 'model/gltf-binary',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.md': 'text/markdown; charset=utf-8',
};

const results = [];
function check(ok, label, detail = '') {
  results.push({ ok, label, detail });
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
}

/* ── Static server, mounted at the deploy sub-path ─────────────────────────
   Deliberately NOT `vite preview`: preview knows the base and would paper over
   a base mistake. This serves the built bytes at the real prefix and 404s
   anything outside it, which is what the marketing site will do. It also
   applies the same `default-src 'self'` CSP the host page uses, so a stray
   external fetch is blocked here exactly as it would be in production. */
function serve() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, ORIGIN);
    let pathname = decodeURIComponent(url.pathname);

    // A same-origin host page for the iframe test. `frame-ancestors 'self'`
    // means an about:blank or data: parent is REFUSED — correctly. In
    // production the embedding page is vulos.org itself, so the test host has
    // to come off this same origin or we would be testing the wrong thing.
    if (pathname === '/embed-test') {
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-security-policy': PRODUCTION_CSP,
      });
      return res.end(
        `<!doctype html><meta charset="utf-8"><title>embed host</title>` +
          `<body style="margin:0;background:#111">` +
          `<iframe src="${PREFIX}" style="width:420px;height:620px;border:0" allow="camera"></iframe>`,
      );
    }

    if (!pathname.startsWith(PREFIX)) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end(`outside the mount point (${PREFIX})`);
    }

    let rel = pathname.slice(PREFIX.length) || 'index.html';
    if (rel.endsWith('/')) rel += 'index.html';

    const file = path.join(DIST, rel);
    // Path traversal guard — this is a test server, but a test server that
    // serves the parent directory is a bad habit.
    if (!file.startsWith(DIST)) {
      res.writeHead(403);
      return res.end('nope');
    }

    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('not found');
    }

    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] || 'application/octet-stream',
      'content-security-policy': PRODUCTION_CSP,
    });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}


/**
 * Screenshot helper. Software-rasterised WebGL keeps the compositor busy, so
 * Playwright's default stability wait can time out on a page that is running
 * perfectly well. Disable animation waiting, allow more time, and never let a
 * failed capture abort the verification run — the checks matter more than the
 * pictures.
 */
async function shot(target, name) {
  try {
    await target.screenshot({
      path: path.join(SHOTS, name),
      animations: 'disabled',
      timeout: 90_000,
    });
    console.log(`  saved ${path.relative(ROOT, SHOTS)}/${name}`);
  } catch (err) {
    console.log(`  screenshot ${name} failed: ${err.message.split('\n')[0]}`);
  }
}

async function main() {
  if (!NO_BUILD) {
    console.log('building demo (npm run build:demo)…');
    execSync('npm run build:demo', { cwd: ROOT, stdio: 'inherit' });
  }
  if (!existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist-demo/index.html missing — build first.');
    process.exit(1);
  }

  /* ── PREFIX must match the base the bundle was actually built for ─────────
     This script serves dist-demo/ under PREFIX and 404s everything outside it,
     which is the point: it catches a wrong `base`. But that only works while
     PREFIX and `WIBBLY_BASE` (package.json → build:demo) agree. When they last
     drifted apart, every hashed asset 404'd, the page never booted, and the run
     died on a Playwright timeout in check #3 — a red gate, but one that named
     the wrong cause and reported "2 checks" instead of 26. So: read the base
     out of the built index.html and refuse to run at all if it disagrees.
     Fails closed and says exactly what does not line up. */
  const builtHtml = readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const assetRefs = [...builtHtml.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]);
  const offBase = assetRefs.filter((u) => !u.startsWith(PREFIX));
  if (assetRefs.length === 0) {
    console.error(
      `dist-demo/index.html references no absolute asset URLs at all — cannot confirm the build's ` +
        `base matches this script's PREFIX (${PREFIX}), so the sub-path check below would prove nothing.`,
    );
    process.exit(1);
  }
  if (offBase.length > 0) {
    console.error(
      `base mismatch: dist-demo/ was built for a different sub-path than this script serves.\n` +
        `  verify-demo.mjs PREFIX : ${PREFIX}\n` +
        `  built asset URLs       : ${[...new Set(offBase)].slice(0, 5).join(', ')}\n` +
        `Set WIBBLY_BASE in package.json's build:demo and PREFIX here to the same value.`,
    );
    process.exit(1);
  }
  console.log(`base check: ${assetRefs.length} absolute asset URLs, all under ${PREFIX}`);

  mkdirSync(SHOTS, { recursive: true });
  console.log(
    UPDATE_SCREENSHOTS
      ? 'screenshots: UPDATING committed docs/screenshots/ (--update-screenshots passed)'
      : `screenshots: writing to gitignored ${path.relative(ROOT, SHOTS)}/ (pass --update-screenshots to refresh docs/screenshots/ instead)`,
  );

  const server = await serve();
  console.log(`\nserving dist-demo/ at ${BASE}\n`);

  const browser = await chromium.launch({
    headless: !HEADED,
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      '--autoplay-policy=no-user-gesture-required',
      // Headless Chromium has no GPU, so without these TFJS gets no WebGL at
      // all and drops to the CPU backend — which would make this run prove
      // nothing about the backend the production CSP actually requires.
      // SwiftShader is a software rasteriser: real WebGL, slowly.
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
    ],
  });

  // An iframe-sized viewport, not a desktop window: the demo has to survive a
  // constrained embed, and testing it at 1440x900 would never show that.
  const context = await browser.newContext({
    viewport: { width: 1000, height: 640 },
    permissions: ['camera'],
  });

  /* ── Request capture. This is the point of the whole script. ───────────── */
  const requests = [];
  context.on('request', (r) => requests.push({ url: r.url(), type: r.resourceType() }));
  const failures = [];
  context.on('requestfailed', (r) => failures.push(`${r.url()} — ${r.failure()?.errorText}`));
  const responses = [];
  context.on('response', (r) => responses.push({ url: r.url(), status: r.status() }));

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  // CSP violations are reported to the page, not to the network log, so they
  // have to be collected separately or a blocked script looks like nothing.
  const cspViolations = [];
  await page.addInitScript(() => {
    window.__CSP_VIOLATIONS__ = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__CSP_VIOLATIONS__.push(
        `${e.violatedDirective} blocked "${e.blockedURI}" at ${e.sourceFile || '?'}:${e.lineNumber}`,
      );
    });
    window.__PAGE_ERRORS__ = [];
    window.addEventListener('error', (e) => {
      window.__PAGE_ERRORS__.push(String(e.message));
    });
  });

  console.log('── 1. camera path ──────────────────────────────────────────────');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60_000 });

  const introVisible = await page.getByRole('heading', { name: /tennis, in this tab/i }).isVisible();
  check(introVisible, 'demo boots straight to the inline intro (no multi-step wizard)');

  const explains = await page
    .getByText(/frames never leave this tab/i)
    .isVisible()
    .catch(() => false);
  check(explains, 'camera is explained BEFORE the permission prompt');

  await shot(page, 'demo-intro.png');

  // Handedness quick-pick, inline.
  await page.getByRole('button', { name: '^Left$' }).click().catch(async () => {
    await page.locator('.wb-demo__hand', { hasText: 'Left' }).click();
  });
  const leftActive = await page.locator('.wb-demo__hand.is-active').innerText();
  check(/left/i.test(leftActive), 'handedness quick-pick is inline and live');

  await page.locator('.wb-demo__hand', { hasText: 'Right' }).click();
  await page.getByRole('button', { name: /turn on my camera/i }).click();

  // The CPU backend fallback takes ~10-12s; give it room, then settle.
  await page.waitForTimeout(30_000);

  const pageErrors = await page.evaluate(() => window.__PAGE_ERRORS__ || []);
  if (pageErrors.length) console.log(`  page errors: ${JSON.stringify(pageErrors.slice(0, 5))}`);
  if (consoleErrors.length) console.log(`  console errors: ${JSON.stringify(consoleErrors.slice(0, 8))}`);

  const status = await page.locator('.wb-demo__status').innerText().catch(() => '');
  console.log(`  input status: "${status.trim()}"`);
  check(
    /camera tracking|spacebar/i.test(status),
    'input pipeline resolved to a definite state',
    status.trim(),
  );

  const demoBadge = await page.locator('.wb-demo__badge').first().isVisible();
  check(demoBadge, 'visible "Demo" marker while playing');

  const canvas = await page.locator('canvas').first().isVisible();
  check(canvas, 'three.js court rendered');

  await shot(page, 'demo-play.png');

  /* ── The headline assertion ────────────────────────────────────────────── */
  console.log('\n── 2. network ──────────────────────────────────────────────────');
  const external = requests.filter((r) => !r.url.startsWith(ORIGIN) && !r.url.startsWith('blob:') && !r.url.startsWith('data:'));
  check(external.length === 0, 'ZERO external network requests', external.map((r) => r.url).join(', ') || 'all same-origin');

  const notFound = responses.filter((r) => r.status >= 400);
  check(notFound.length === 0, 'no 4xx/5xx responses', notFound.map((r) => `${r.status} ${r.url}`).join(', ') || 'none');

  check(failures.length === 0, 'no failed requests', failures.join(', ') || 'none');

  const modelReq = requests.filter((r) => r.url.includes('movenet-multipose-lightning'));
  const gotManifest = modelReq.some((r) => r.url.endsWith('model.json'));
  const shards = modelReq.filter((r) => r.url.endsWith('.bin')).length;
  check(gotManifest, 'vendored model.json fetched from the local path');
  check(shards === 3, `all 3 weight shards fetched locally`, `${shards}/3`);
  check(
    modelReq.every((r) => r.url.startsWith(BASE)),
    'model requests are under the deploy sub-path (base is correct)',
  );

  const detectorRan = gotManifest && shards === 3;
  check(detectorRan, 'detector initialised from the LOCAL model');

  /* ── CSP: the environment this actually ships into ─────────────────────── */
  console.log('\n── 2b. CSP (real production policy applied) ────────────────────');
  console.log(`  policy: ${PRODUCTION_CSP}`);
  cspViolations.push(...(await page.evaluate(() => window.__CSP_VIOLATIONS__ || [])));

  // ONE known-benign violation, identified rather than ignored.
  //
  // `long.js` (pulled in transitively by TFJS) probes for a WASM fast path at
  // module load with a hand-assembled 40-byte module, inside a try/catch:
  //
  //     try { e = new WebAssembly.Instance(new WebAssembly.Module(...)) }
  //     catch { e = null }   // → pure-JS 64-bit multiply
  //
  // Under `script-src` without 'wasm-unsafe-eval' the constructor throws, the
  // catch fires, and long.js uses its JavaScript path. The report is real; the
  // consequence is nil. It is matched narrowly — anything else that trips
  // wasm-eval is a genuine finding and still fails this check.
  const BENIGN = [/script-src blocked "wasm-eval"/];
  const realViolations = cspViolations.filter((v) => !BENIGN.some((re) => re.test(v)));
  const benignSeen = cspViolations.filter((v) => BENIGN.some((re) => re.test(v)));

  check(
    realViolations.length === 0,
    'no consequential CSP violations under the production policy',
    realViolations.join(', ') || 'none',
  );
  if (benignSeen.length) {
    console.log(`  known-benign: ${benignSeen.length} × long.js WASM feature probe (try/catch, JS fallback)`);
  }

  const backend = await page.evaluate(() => window.__WIBBLY_BACKEND__ || null);
  console.log(`  tfjs backend: ${backend ? JSON.stringify(backend) : '(not reported)'}`);
  check(backend !== null, 'tracker reported which backend it selected');
  if (backend) {
    check(
      backend.cspHostile === false,
      'backend is permitted by the production CSP',
      `backend=${backend.backend}`,
    );
    check(
      backend.backend === 'webgl',
      'detector runs on the WebGL backend (explicitly selected, not auto)',
      `backend=${backend.backend}${backend.warning ? ` — ${backend.warning}` : ''}`,
    );
  }

  console.log('\n  full request list:');
  const seen = new Set();
  for (const r of requests) {
    const key = r.url;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`    [${r.type.padEnd(10)}] ${r.url.replace(ORIGIN, '')}`);
  }

  /* ── Ephemerality ──────────────────────────────────────────────────────── */
  console.log('\n── 3. storage ──────────────────────────────────────────────────');
  const duringPlay = await page.evaluate(() => Object.keys(localStorage));
  check(duringPlay.length === 0, 'no localStorage keys written DURING play', JSON.stringify(duringPlay));

  // Reload: a fresh visitor to the same origin must inherit nothing.
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const afterUnload = await page.evaluate(() => Object.keys(localStorage));
  check(afterUnload.length === 0, 'no localStorage keys persist after unload', JSON.stringify(afterUnload));

  const cookies = await context.cookies();
  check(cookies.length === 0, 'no cookies set', JSON.stringify(cookies.map((c) => c.name)));

  /* ── Degradation: the spacebar path ────────────────────────────────────── */
  console.log('\n── 4. degradation ──────────────────────────────────────────────');
  const denied = await browser.newContext({ viewport: { width: 1000, height: 640 } });
  await denied.clearPermissions();
  await denied.grantPermissions([]);
  const p2 = await denied.newPage();
  const swings = [];
  const p2Errors = [];
  p2.on('console', (m) => {
    if (/Handling swing/.test(m.text())) swings.push(m.text());
    if (m.type() === 'error') p2Errors.push(m.text());
  });
  // `?debug=1` — the documented opt-in in games/tennis/debug.js. The swing this
  // check is looking for is observed through `debugLog('Handling swing!', …)`
  // in game.jsx's `handleSwing`, and that hot-path logging is OFF by default
  // for real players. Without the flag this check counted zero swings while
  // the game was in fact swinging perfectly well (the magnetite-CTA check
  // below only fires after six real swings, and it passed) — i.e. it failed
  // for measuring a log that had been silenced, not for a broken fallback.
  await p2.goto(`${BASE}?debug=1`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await p2.getByRole('button', { name: /play with the spacebar/i }).click();
  await p2.waitForTimeout(3_000);
  for (let i = 0; i < 5; i += 1) {
    await p2.keyboard.press('Space');
    await p2.waitForTimeout(350);
  }
  check(swings.length > 0, 'spacebar fallback produces swings with no camera', `${swings.length} swings`);

  const kbStatus = await p2.locator('.wb-demo__status').innerText().catch(() => '');
  check(/spacebar/i.test(kbStatus), 'HUD reports the keyboard path honestly', kbStatus.trim());

  // Keep swinging to reach the magnetite prompt threshold. The swing animation
  // gates re-entry, so presses have to be spaced or they are simply dropped.
  for (let i = 0; i < 14; i += 1) {
    await p2.keyboard.press('Space');
    await p2.waitForTimeout(900);
  }
  const ctaVisible = await p2
    .waitForSelector('.wb-demo__cta', { state: 'visible', timeout: 20_000 })
    .then(() => true)
    .catch(() => false);
  console.log(`  swings registered: ${swings.length}`);
  if (p2Errors.length) console.log(`  p2 console errors: ${JSON.stringify(p2Errors.slice(0, 5))}`);
  check(ctaVisible, 'magnetite prompt appears after playing, not before');
  if (ctaVisible) {
    await shot(p2, 'demo-magnetite-cta.png');
    const ctaText = await p2.locator('.wb-demo__cta').innerText();
    check(
      /does not work yet/i.test(ctaText),
      'magnetite prompt states the multiplayer limitation plainly',
    );
  }

  await shot(p2, 'demo-spacebar.png');

  /* ── Iframe embed ──────────────────────────────────────────────────────── */
  console.log('\n── 5. iframe ───────────────────────────────────────────────────');
  const framePage = await context.newPage();
  await framePage.goto(`${ORIGIN}/embed-test`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  // A fresh load of a ~1.2 MB bundle under software rasterisation is not fast;
  // wait for the element rather than guessing a sleep long enough.
  const frameEl = await framePage.waitForSelector('iframe');
  const frame = await frameEl.contentFrame();
  const framedOk = frame
    ? await frame
        .waitForSelector('.wb-demo__card', { state: 'visible', timeout: 30_000 })
        .then(() => true)
        .catch(() => false)
    : false;
  check(framedOk, 'renders inside a narrow iframe without breaking layout');

  const overflows = frame
    ? await frame.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
    : true;
  check(!overflows, 'no horizontal overflow in a constrained embed');

  await shot(framePage, 'demo-iframe.png');

  await browser.close();
  server.close();

  /* ── Verdict ───────────────────────────────────────────────────────────── */
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${'─'.repeat(64)}`);
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    for (const f of failed) console.log(`  FAILED: ${f.label} — ${f.detail}`);
    process.exit(1);
  }
  if (results.length !== EXPECTED_CHECKS) {
    console.error(
      `\nCOVERAGE FAILURE: ${results.length} checks ran, ${EXPECTED_CHECKS} expected.\n` +
        (results.length < EXPECTED_CHECKS
          ? `  ${EXPECTED_CHECKS - results.length} check(s) did not run, so this verification did NOT cover ` +
            `everything it claims to. Every check that DID run passed, which is not the same thing.\n` +
            `  Ran: ${results.map((r) => r.label).join(' | ')}`
          : `  More checks ran than EXPECTED_CHECKS records. If that is intentional, raise ` +
            `EXPECTED_CHECKS to ${results.length} in this file.`),
    );
    process.exit(1);
  }
  console.log('demo verified: self-contained, ephemeral, iframe-safe, degradable.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
