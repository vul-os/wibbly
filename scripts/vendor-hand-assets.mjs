#!/usr/bin/env node
/**
 * Vendor the MediaPipe HandLandmarker assets into `public/models/hand-landmarker/`
 * so hand tracking runs same-origin, with no CDN and no external request — the
 * same self-contained posture the vendored MoveNet pose model already has, and
 * the same posture `verify:demo` enforces for the demo build.
 *
 * The hand tracker (`packages/wibbly-input/src/hand-tracker.ts`) already
 * DEFAULTS to these exact vendored paths:
 *   - model:      `models/hand-landmarker/hand_landmarker.task`  (HAND_LANDMARKER_TASK_VENDORED_PATH)
 *   - wasm base:  `models/hand-landmarker/wasm/`                 (TASKS_VISION_WASM_VENDORED_PATH)
 * so once this script has run, `new HandLandmarkTracker().init()` works with no
 * config. Nothing here is wired to a game yet (hand games are still to come),
 * which is why these ~25 MB are fetched on demand by this script rather than
 * committed to git by default — see docs below and README.
 *
 * Two independent things are vendored:
 *   1. The **model** (`hand_landmarker.task`, 7,819,105 bytes, float16) —
 *      downloaded from Google's model store (pinned version, not "latest", so a
 *      re-run is reproducible).
 *   2. The **Wasm runtime** (`vision_wasm*` — the SIMD and non-SIMD variants
 *      FilesetResolver picks between at runtime) — COPIED out of the already
 *      installed `@mediapipe/tasks-vision` npm package, so it matches the
 *      version this repo builds against and needs no network at all.
 *
 * Usage:  npm run vendor:hands     (or: node scripts/vendor-hand-assets.mjs)
 * Then, if you want them in the repo (self-hosters get hands out of the box,
 * matching the committed MoveNet model), `git add public/models/hand-landmarker`.
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'models', 'hand-landmarker');
const WASM_OUT = path.join(OUT_DIR, 'wasm');
const WASM_SRC = path.join(ROOT, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');

// Pinned model version (float16/1) — a fixed generation, so this script is
// reproducible. hand-tracker.ts records the same 7,819,105-byte expectation.
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const MODEL_OUT = path.join(OUT_DIR, 'hand_landmarker.task');
const MODEL_EXPECTED_BYTES = 7819105;

const mib = (n) => `${(n / 1024 / 1024).toFixed(2)} MiB`;

async function vendorModel() {
  process.stdout.write(`  model: fetching ${MODEL_URL.split('/float16/')[1]} … `);
  const res = await fetch(MODEL_URL);
  if (!res.ok) throw new Error(`model download failed: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength !== MODEL_EXPECTED_BYTES) {
    throw new Error(
      `model size mismatch: got ${buf.byteLength}, expected ${MODEL_EXPECTED_BYTES}. ` +
        `The pinned version may have changed — verify before trusting it.`,
    );
  }
  await writeFile(MODEL_OUT, buf);
  const sha = createHash('sha256').update(buf).digest('hex');
  console.log(`ok (${mib(buf.byteLength)}, sha256 ${sha.slice(0, 16)}…)`);
  return sha;
}

async function vendorWasm() {
  if (!existsSync(WASM_SRC)) {
    throw new Error(
      `@mediapipe/tasks-vision not installed (${WASM_SRC} missing). Run npm install first.`,
    );
  }
  await mkdir(WASM_OUT, { recursive: true });
  const files = (await readdir(WASM_SRC)).filter((f) => f.startsWith('vision_wasm'));
  let total = 0;
  for (const f of files) {
    await copyFile(path.join(WASM_SRC, f), path.join(WASM_OUT, f));
    total += (await stat(path.join(WASM_OUT, f))).size;
  }
  console.log(`  wasm : copied ${files.length} files from @mediapipe/tasks-vision (${mib(total)})`);
  return total;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log('Vendoring MediaPipe HandLandmarker assets → public/models/hand-landmarker/');
  const sha = await vendorModel();
  const wasmBytes = await vendorWasm();
  console.log('');
  console.log('Done. Hand tracking now resolves same-origin with no config.');
  console.log(`  model sha256: ${sha}`);
  console.log(`  total on disk: ~${mib(MODEL_EXPECTED_BYTES + wasmBytes)}`);
  console.log('');
  console.log('To ship them (self-hosters get hands out of the box, like the MoveNet model):');
  console.log('  git add public/models/hand-landmarker && git commit');
}

main().catch((e) => {
  console.error('\nvendor-hand-assets failed:', e.message);
  process.exit(1);
});
