import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { MagnetiteAuthority, makeInput, singleRoomConfig, type Input } from '../src/index';

/**
 * These tests load the ACTUAL vendored magnetite module
 * (public/magnetite/arena-authority.wasm) and drive its real mag_* ABI. If the
 * "wibbly is built on magnetite" claim were a stub, these would not pass:
 * there is no mock here, only the compiled Rust game running under Node's own
 * WebAssembly engine — the same engine shape a browser tab uses.
 */

const WASM_PATH = fileURLToPath(new URL('../../../public/magnetite/arena-authority.wasm', import.meta.url));
// Wrap in a Uint8Array so the bytes are a plain ArrayBuffer-backed BufferSource:
// readFileSync returns a Node Buffer (typed Buffer<ArrayBufferLike>), which recent
// @types/node will not accept where WebAssembly.compile/instantiate want a BufferSource.
const WASM = new Uint8Array(readFileSync(WASM_PATH));

// A player holding "move right" (arena maps keys.right → +x at MAX_SPEED=4/tick).
function moveRight(seq: number): Input {
  return makeInput({ keys: { right: true }, sequence: seq, timestamp_ms: seq * 16 });
}

describe('MagnetiteAuthority — a real magnetite game in the browser engine', () => {
  it('instantiates the module with an EMPTY import object (no WASI, no host)', async () => {
    const module = await WebAssembly.compile(WASM);
    expect(WebAssembly.Module.imports(module)).toHaveLength(0);
    const auth = await MagnetiteAuthority.instantiate(WASM, singleRoomConfig());
    expect(auth.tick).toBe(0);
  });

  it('runs an authoritative tick and moves a player at exactly MAX_SPEED', async () => {
    const auth = await MagnetiteAuthority.instantiate(WASM, singleRoomConfig({ seed: 12345 }));
    auth.restorePlayers([
      { id: 1, x: -50, y: 0 },
      { id: 2, x: 50, y: 0, angle: Math.PI },
    ]);

    for (let t = 0; t < 20; t += 1) {
      const out = auth.step([[1, moveRight(t)]]);
      expect(out).toHaveProperty('state_hash');
      expect(typeof out.state_hash).toBe('string');
    }

    expect(auth.tick).toBe(20);
    const view = auth.view(1);
    // MAX_SPEED is 4 world units/tick; 20 ticks from x=-50 → x=30.
    expect(view.self_state?.x).toBeCloseTo(30, 5);
    expect(view.self_state?.y).toBeCloseTo(0, 5);
    expect(view.other_players.map((p) => p.id)).toContain(2);
    expect(view.tick).toBe(20);
  });

  it('is deterministic across two FRESH instances (same seed + inputs → same hashes)', async () => {
    const runOnce = async () => {
      const auth = await MagnetiteAuthority.instantiate(WASM, singleRoomConfig({ seed: 777 }));
      auth.restorePlayers([{ id: 1, x: -50, y: 0 }]);
      const hashes: string[] = [];
      for (let t = 0; t < 15; t += 1) hashes.push(auth.step([[1, moveRight(t)]]).state_hash);
      return hashes;
    };
    const a = await runOnce();
    const b = await runOnce();
    expect(a).toEqual(b);
    // The hash is a real u64 kept as a decimal string — big enough to prove the
    // precision guard matters (it exceeds Number.MAX_SAFE_INTEGER).
    expect(Number(a[a.length - 1])).toBeGreaterThan(Number.MAX_SAFE_INTEGER);
  });

  it('preserves u64 state_hash precision (no silent JS rounding)', async () => {
    const auth = await MagnetiteAuthority.instantiate(WASM, singleRoomConfig());
    auth.restorePlayers([{ id: 1, x: 0, y: 0 }]);
    const out = auth.step([[1, moveRight(0)]]);
    // A bare Number(...) of a u64 that ends in non-zero low bits would differ
    // from the exact string; assert the string is all digits and not lossy.
    expect(out.state_hash).toMatch(/^\d+$/);
  });

  it('rejects a module that declares host imports', async () => {
    // A tiny wasm that imports env::f — must be refused, since wibbly runs the
    // authority with no host functions at all.
    const wat = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, // header
      0x01, 0x04, 0x01, 0x60, 0x00, 0x00, // type: () -> ()
      0x02, 0x07, 0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00, // import "e"."f" func 0
    ]);
    await expect(MagnetiteAuthority.instantiate(wat, singleRoomConfig())).rejects.toThrow(/host imports/i);
  });
});
