#!/usr/bin/env node
/**
 * Verify the vendored MoveNet weights.
 *
 * Two independent checks, because "the files are present" is not the same as
 * "the files are the model":
 *
 *   1. Every shard named in model.json's weight manifest exists.
 *   2. The shards' total size on disk equals the byte count the manifest
 *      itself implies from its tensor shapes and dtypes. A truncated,
 *      half-downloaded or HTML-error-page shard fails this.
 *
 * It also prints SHA-256 for each file so a change can be spotted in a diff.
 *
 *   node scripts/verify-model.mjs
 */

import { createHash } from 'node:crypto';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'models', 'movenet-multipose-lightning');
const MODEL = path.join(DIR, 'model.json');

/** Bytes per element, keyed by the dtype names tfjs writes into a manifest. */
const DTYPE_BYTES = {
  float32: 4,
  float16: 2,
  int32: 4,
  int64: 8,
  bool: 1,
  uint8: 1,
  uint16: 2,
  complex64: 8,
};

function fail(msg) {
  console.error(`FAIL  ${msg}`);
  process.exitCode = 1;
}

if (!existsSync(MODEL)) {
  fail(`missing ${path.relative(ROOT, MODEL)} — the model is not vendored.`);
  console.error('      See public/models/movenet-multipose-lightning/README.md');
  process.exit(1);
}

const model = JSON.parse(readFileSync(MODEL, 'utf8'));
const groups = model.weightsManifest ?? [];

let declared = 0;
const shards = [];
for (const group of groups) {
  for (const w of group.weights) {
    const elements = (w.shape ?? []).reduce((a, b) => a * b, 1);
    // A quantized tensor is stored in its quantization dtype, not its logical one.
    const dtype = w.quantization ? w.quantization.dtype : w.dtype;
    const bytes = DTYPE_BYTES[dtype];
    if (bytes === undefined) {
      fail(`unknown dtype "${dtype}" for tensor ${w.name}`);
      process.exit(1);
    }
    declared += elements * bytes;
  }
  for (const p of group.paths) shards.push(p);
}

let onDisk = 0;
for (const shard of shards) {
  const p = path.join(DIR, shard);
  if (!existsSync(p)) {
    fail(`manifest names ${shard} but it is not on disk`);
    continue;
  }
  onDisk += statSync(p).size;
}

console.log(`model   : MoveNet MultiPose Lightning (${model.format}, ${model.generatedBy})`);
console.log(`shards  : ${shards.length}`);
console.log(`declared: ${declared.toLocaleString()} bytes (from the manifest's own shapes/dtypes)`);
console.log(`on disk : ${onDisk.toLocaleString()} bytes`);

if (declared !== onDisk) {
  fail('shard bytes do not match the manifest — the weights are truncated or wrong.');
} else {
  console.log('OK      shard bytes match the manifest exactly.');
}

console.log('\nsha256:');
for (const f of ['model.json', ...shards]) {
  const p = path.join(DIR, f);
  if (!existsSync(p)) continue;
  const h = createHash('sha256').update(readFileSync(p)).digest('hex');
  console.log(`  ${h}  ${f}`);
}

const total = statSync(MODEL).size + onDisk;
console.log(`\ntotal on disk: ${(total / 1024 / 1024).toFixed(2)} MiB`);
