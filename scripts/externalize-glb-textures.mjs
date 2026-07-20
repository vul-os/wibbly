#!/usr/bin/env node
/**
 * Move textures embedded inside a .glb out into sibling image files.
 *
 * WHY THIS EXISTS
 *
 * `court.glb` carried its 2 MB base-colour PNG inside the binary chunk. To use
 * it, THREE.GLTFLoader wraps those bytes in a Blob, takes a `blob:` object URL,
 * and loads it through ImageBitmapLoader — which is a `fetch`. The page this
 * demo is embedded in is served under:
 *
 *   connect-src 'self'
 *
 * `blob:` is not `'self'`, so the fetch is refused, GLTFLoader logs
 * "Couldn't load texture", and the court renders untextured. Nothing throws,
 * nothing 404s, and no request appears in the network log — it just quietly
 * looks worse. That is exactly the class of bug that survives review.
 *
 * The fix is at the asset level, not the policy level: pull the image out to a
 * real file and reference it by URI, so it is fetched same-origin like any
 * other asset. No CSP exemption needed, and the fix holds for anyone else
 * serving this app under a strict policy.
 *
 * The glTF spec permits `images[].uri` in a .glb, so this stays a single .glb
 * plus its texture files. The orphaned bufferView is removed and every
 * remaining bufferView is re-packed, so the file gets ~2 MB smaller rather
 * than carrying dead bytes.
 *
 *   node scripts/externalize-glb-textures.mjs public/models/court.glb
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' };
const GLB_MAGIC = 0x46546c67; // 'glTF'
const CHUNK_JSON = 0x4e4f534a;
const CHUNK_BIN = 0x004e4942;

const file = process.argv[2];
if (!file || !existsSync(file)) {
  console.error('usage: node scripts/externalize-glb-textures.mjs <file.glb>');
  process.exit(1);
}

const buf = readFileSync(file);
if (buf.readUInt32LE(0) !== GLB_MAGIC) {
  console.error(`${file}: not a .glb`);
  process.exit(1);
}

/* ── Parse ─────────────────────────────────────────────────────────────── */

let offset = 12;
let json = null;
let bin = null;
while (offset < buf.length) {
  const length = buf.readUInt32LE(offset);
  const type = buf.readUInt32LE(offset + 4);
  const data = buf.subarray(offset + 8, offset + 8 + length);
  if (type === CHUNK_JSON) json = JSON.parse(data.toString('utf8'));
  else if (type === CHUNK_BIN) bin = data;
  offset += 8 + length;
}
if (!json) {
  console.error('no JSON chunk');
  process.exit(1);
}

const images = json.images ?? [];
const embedded = images.filter((i) => i.bufferView !== undefined);
if (embedded.length === 0) {
  console.log(`${file}: no embedded textures — nothing to do.`);
  process.exit(0);
}

const dir = path.dirname(file);
const bufferViews = json.bufferViews ?? [];

/* ── Write each embedded image out, and mark its bufferView for removal ─── */

const dropped = new Set();
for (const image of images) {
  if (image.bufferView === undefined) continue;
  const view = bufferViews[image.bufferView];
  const ext = EXT[image.mimeType] ?? '.bin';
  // Authoring tools often store the name WITH an extension already
  // ("Atlas.png"), which would otherwise yield "Atlas.png.png".
  const stem = (image.name || 'texture').replace(/[^\w.-]/g, '_').replace(/\.(png|jpe?g|webp)$/i, '');
  const name = `${stem}${ext}`;
  const start = view.byteOffset ?? 0;
  const bytes = bin.subarray(start, start + view.byteLength);

  writeFileSync(path.join(dir, name), bytes);
  console.log(`  extracted ${name} (${bytes.length.toLocaleString()} bytes)`);

  dropped.add(image.bufferView);
  delete image.bufferView;
  delete image.mimeType; // inferred from the file extension now
  image.uri = name; // resolved relative to the .glb by GLTFLoader
}

/* ── Re-pack the binary chunk without the extracted views ──────────────── */

const keep = bufferViews
  .map((view, index) => ({ view, index }))
  .filter(({ index }) => !dropped.has(index));

// Old bufferView index → new index, so accessors keep pointing at the right data.
const remap = new Map();
keep.forEach(({ index }, newIndex) => remap.set(index, newIndex));

const parts = [];
let cursor = 0;
const rebuilt = keep.map(({ view }) => {
  // glTF requires 4-byte alignment for bufferView offsets.
  const pad = (4 - (cursor % 4)) % 4;
  if (pad) {
    parts.push(Buffer.alloc(pad));
    cursor += pad;
  }
  const start = view.byteOffset ?? 0;
  parts.push(bin.subarray(start, start + view.byteLength));
  const next = { ...view, byteOffset: cursor };
  cursor += view.byteLength;
  return next;
});

const newBin = Buffer.concat(parts);
json.bufferViews = rebuilt;
if (json.buffers?.[0]) json.buffers[0].byteLength = newBin.length;

// Anything that referenced a bufferView by index has to be renumbered.
for (const accessor of json.accessors ?? []) {
  if (accessor.bufferView !== undefined) accessor.bufferView = remap.get(accessor.bufferView);
  if (accessor.sparse) {
    for (const part of [accessor.sparse.indices, accessor.sparse.values]) {
      if (part?.bufferView !== undefined) part.bufferView = remap.get(part.bufferView);
    }
  }
}
for (const mesh of json.meshes ?? []) {
  for (const prim of mesh.primitives ?? []) {
    const draco = prim.extensions?.KHR_draco_mesh_compression;
    if (draco?.bufferView !== undefined) draco.bufferView = remap.get(draco.bufferView);
  }
}

/* ── Write the .glb back out ───────────────────────────────────────────── */

function chunk(type, payload, padByte) {
  const pad = (4 - (payload.length % 4)) % 4;
  const body = pad ? Buffer.concat([payload, Buffer.alloc(pad, padByte)]) : payload;
  const header = Buffer.alloc(8);
  header.writeUInt32LE(body.length, 0);
  header.writeUInt32LE(type, 4);
  return Buffer.concat([header, body]);
}

const jsonChunk = chunk(CHUNK_JSON, Buffer.from(JSON.stringify(json), 'utf8'), 0x20);
const binChunk = chunk(CHUNK_BIN, newBin, 0x00);

const header = Buffer.alloc(12);
header.writeUInt32LE(GLB_MAGIC, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + jsonChunk.length + binChunk.length, 8);

const out = Buffer.concat([header, jsonChunk, binChunk]);
writeFileSync(file, out);

console.log(
  `  ${path.basename(file)}: ${buf.length.toLocaleString()} → ${out.length.toLocaleString()} bytes`,
);
console.log('  textures are now same-origin files — no blob: fetch, no CSP exemption needed.');
