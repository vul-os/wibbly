#!/usr/bin/env node
/**
 * Vendor the MediaPipe HandLandmarker assets into
 * `games/palmworks/public/models/hand-landmarker/` so hand tracking runs
 * same-origin, with no CDN and no external request at play time — same
 * posture as the root repo's `scripts/vendor-hand-assets.mjs`, adapted for
 * this package's own directory layout (a separate npm project, its own
 * `node_modules` and its own `public/`, see games/palmworks/package.json's
 * doc comments elsewhere in this pass).
 *
 * `@vulos/wibbly-input`'s `HandLandmarkTracker` (packages/wibbly-input/src/
 * hand-tracker.ts) already DEFAULTS to these exact vendored paths:
 *   - model:      `models/hand-landmarker/hand_landmarker.task`
 *   - wasm base:  `models/hand-landmarker/wasm/`
 * resolved against `document.baseURI`, so once this script has run, hand
 * tracking works with no extra config from this game.
 *
 * Two independent things are vendored:
 *   1. The **model** (`hand_landmarker.task`, 7,819,105 bytes, float16) —
 *      downloaded from Google's model store (pinned version, not "latest",
 *      so a re-run is reproducible and verifiable by size).
 *   2. The **Wasm runtime** (`vision_wasm*`) — COPIED out of the already-
 *      installed `@mediapipe/tasks-vision` npm package (a real dependency
 *      of this package, see package.json), so it matches the version this
 *      game builds against and needs no network at all.
 *
 * Usage:  npm run vendor:hands   (from games/palmworks/)
 * These are NOT committed by default (~25 MB) — run this once after
 * `npm install` on a machine with network access, same as the root repo's
 * equivalent script; `git add public/models/hand-landmarker` afterward if
 * you want them shipped with the repo.
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

// Pinned model version (float16/1) — matches the root repo's script exactly,
// so the two never vendor two different generations of the same model.
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
    throw new Error(`@mediapipe/tasks-vision not installed (${WASM_SRC} missing). Run npm install first.`);
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
  console.log('Vendoring MediaPipe HandLandmarker assets → games/palmworks/public/models/hand-landmarker/');
  const sha = await vendorModel();
  const wasmBytes = await vendorWasm();
  console.log('');
  console.log('Done. Hand tracking now resolves same-origin with no config.');
  console.log(`  model sha256: ${sha}`);
  console.log(`  total on disk: ~${mib(MODEL_EXPECTED_BYTES + wasmBytes)}`);
}

main().catch((e) => {
  console.error('\nvendor-hand-assets failed:', e.message);
  process.exit(1);
});
