/**
 * @vulos/wibbly-authority — a real magnetite authority, running in a browser tab.
 *
 * This is the module that makes "wibbly is built on magnetite" literally true.
 * It loads a real magnetite `AuthoritativeGame` — the reference arena-shooter
 * from `magnetite/game-templates/authoritative`, compiled to
 * `wasm32-unknown-unknown` — and drives magnetite's sandbox `mag_*` ABI from
 * JavaScript. The simulation is authoritative and deterministic; the browser
 * tab is the host. In magnetite's own words this is a `Topology::SingleRoom`
 * match, and running it client-side is "the browser as the bottom rung of the
 * topology ladder": the same game module a dedicated or sharded magnetite host
 * would run, run here instead with no server in the path.
 *
 * ── What is real here, and what is NOT ──────────────────────────────────────
 * REAL: a magnetite game module, compiled from magnetite's Rust, executes and
 * advances authoritative state in response to inputs, in the tab. The wasm is
 * self-contained — `WebAssembly.Module.imports()` is empty, so it instantiates
 * under an ordinary `WebAssembly.instantiate(bytes, {})` with no WASI shim, no
 * host functions, no `unsafe-eval`-free... (it does need wasm compilation, which
 * a `default-src 'self'` CSP without `wasm-unsafe-eval` blocks — so this never
 * runs in wibbly's demo embed; see src/mode.js).
 *
 * NOT: this does not verify gesture input, and running it changes nothing about
 * anti-cheat. magnetite classes camera gesture input `InputClass::Attested` —
 * nondeterministic, never replay-verifiable. An authority (in a tab or on a
 * rented box) can rate-limit and plausibility-check gesture events but cannot
 * prove a swing was real. Determinism here is a property of the *simulation
 * given its inputs*, not of the inputs. Nothing about hosting the sim in the
 * browser makes an attested input trustworthy.
 *
 * ── The mag_* ABI (from magnetite-sandbox/src/lib.rs) ───────────────────────
 *   mag_alloc(len) -> ptr           bump-allocate `len` bytes for host writes
 *   mag_free(ptr, len)              no-op for the bump allocator
 *   mag_init(cfg_ptr, cfg_len)      init from a JSON MatchConfig
 *   mag_step(in_ptr, in_len) -> ptr advance one tick; ptr → length-prefixed JSON
 *   mag_snapshot() -> ptr           full state → length-prefixed JSON
 *   mag_restore(ptr, len)           replace state from length-prefixed JSON
 *   mag_view(player_id) -> ptr      per-player view → length-prefixed JSON
 * Every `-> ptr` return points at `[u32 little-endian length][JSON bytes]`.
 */

/* ── magnetite JSON shapes (mirrors magnetite-sdk serde output) ───────────── */

/** magnetite `Topology` — only `SingleRoom` is used for the in-browser rung. */
export type Topology =
  | 'SingleRoom'
  | { Dedicated: { tick_hz: number } }
  | { Sharded: { tick_hz: number; cell_size: number; max_per_shard: number } };

/** magnetite `MatchConfig`. */
export interface MatchConfig {
  topology: Topology;
  max_players: number;
  tick_hz: number;
  seed: number;
  snapshot_every: number;
}

/** magnetite `KeyState`. */
export interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  crouch: boolean;
  attack: boolean;
  secondary_attack: boolean;
  interact: boolean;
  sprint: boolean;
}

/** magnetite `MouseState`. */
export interface MouseState {
  x: number;
  y: number;
  delta_x: number;
  delta_y: number;
  left_button: boolean;
  right_button: boolean;
  middle_button: boolean;
  scroll: number;
}

/** magnetite `Input` — one client input frame. */
export interface Input {
  keys: KeyState;
  mouse: MouseState;
  sequence: number;
  timestamp_ms: number;
}

/** A player in the arena game's snapshot/view. */
export interface ShooterPlayer {
  id: number;
  x: number;
  y: number;
  angle: number;
  hp: number;
  alive: boolean;
  last_shot_tick: number;
  score: number;
}

export interface Projectile {
  id: number;
  owner: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ticks_left: number;
}

/** The arena game's full snapshot (mag_snapshot / mag_restore payload). */
export interface ArenaSnapshot {
  players: ShooterPlayer[];
  projectiles: Projectile[];
  tick: number;
}

/** Per-player view (mag_view payload). */
export interface ArenaView {
  self_state: ShooterPlayer | null;
  other_players: ShooterPlayer[];
  projectiles: Projectile[];
  tick: number;
}

/**
 * Result of one authoritative tick. `state_hash` is a `u64` in magnetite and
 * therefore kept as a DECIMAL STRING here — a JS `number` cannot hold it
 * without silently dropping its low bits, and this hash is exactly the value a
 * replay verifier compares byte-for-byte, so lossy is not an option.
 */
export interface StepOutput {
  rejects: Array<[number, unknown]>;
  state_hash: string;
}

/** Convenience helpers for building neutral inputs. */
export function defaultKeys(): KeyState {
  return {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    crouch: false,
    attack: false,
    secondary_attack: false,
    interact: false,
    sprint: false,
  };
}

export function defaultMouse(): MouseState {
  return { x: 0, y: 0, delta_x: 0, delta_y: 0, left_button: false, right_button: false, middle_button: false, scroll: 0 };
}

export function makeInput(partial: { keys?: Partial<KeyState>; mouse?: Partial<MouseState>; sequence?: number; timestamp_ms?: number } = {}): Input {
  return {
    keys: { ...defaultKeys(), ...(partial.keys ?? {}) },
    mouse: { ...defaultMouse(), ...(partial.mouse ?? {}) },
    sequence: partial.sequence ?? 0,
    timestamp_ms: partial.timestamp_ms ?? 0,
  };
}

/** A single spawned player for `restorePlayers`. */
export interface SpawnSpec {
  id: number;
  x: number;
  y: number;
  angle?: number;
}

/* ── The wasm ABI surface we expect the module to export ──────────────────── */

interface MagExports {
  memory: WebAssembly.Memory;
  mag_alloc(len: number): number;
  mag_free(ptr: number, len: number): void;
  mag_init(cfgPtr: number, cfgLen: number): void;
  mag_step(inPtr: number, inLen: number): number;
  mag_snapshot(): number;
  mag_restore(ptr: number, len: number): void;
  mag_view(playerId: bigint): number;
}

const REQUIRED_EXPORTS = ['memory', 'mag_alloc', 'mag_free', 'mag_init', 'mag_step', 'mag_snapshot', 'mag_restore', 'mag_view'] as const;

/**
 * A live magnetite authority backed by a wasm game module.
 *
 * One instance == one match. The reference ABI keeps a module-global tick
 * counter that `mag_init` does NOT reset, so re-initialising the same instance
 * continues the tick sequence rather than restarting it — construct a fresh
 * instance per match. (magnetite's determinism is a per-fresh-instance property
 * and is verified in magnetite's own Rust test suite; this class does not, and
 * cannot, add or subtract from that guarantee.)
 */
export class MagnetiteAuthority {
  readonly config: MatchConfig;
  private readonly exports: MagExports;
  private readonly enc = new TextEncoder();
  private readonly dec = new TextDecoder();
  private stepCount = 0;

  private constructor(exports: MagExports, config: MatchConfig) {
    this.exports = exports;
    this.config = config;
  }

  /**
   * Compile + instantiate a magnetite game module and initialise a match.
   *
   * `wasm` is the module bytes (from `fetch(...).arrayBuffer()` in a browser,
   * or `fs.readFile` in a test). The module is instantiated with an EMPTY
   * import object — magnetite's `wasm32-unknown-unknown` build links no host
   * functions, and this throws loudly if that ever stops being true.
   */
  static async instantiate(wasm: BufferSource, config: MatchConfig): Promise<MagnetiteAuthority> {
    const module = await WebAssembly.compile(wasm);
    const imports = WebAssembly.Module.imports(module);
    if (imports.length > 0) {
      const names = imports.map((i) => `${i.module}::${i.name}`).join(', ');
      throw new Error(
        `magnetite module declares host imports (${names}); wibbly's authority runs it with no host, ` +
          `so a build that needs a shim would silently mis-run rather than fail. Rebuild for ` +
          `wasm32-unknown-unknown, which links none.`,
      );
    }
    const instance = await WebAssembly.instantiate(module, {});
    const exports = instance.exports as unknown as MagExports;
    for (const name of REQUIRED_EXPORTS) {
      if (!(name in (instance.exports as object))) {
        throw new Error(`magnetite module is missing required export \`${name}\``);
      }
    }
    const self = new MagnetiteAuthority(exports, config);
    self.writeInit(config);
    return self;
  }

  /** Current authoritative tick (number of `step` calls on this instance). */
  get tick(): number {
    return this.stepCount;
  }

  /** Copy `bytes` into the guest bump arena and return the pointer. */
  private write(bytes: Uint8Array): number {
    const ptr = this.exports.mag_alloc(bytes.length);
    new Uint8Array(this.exports.memory.buffer, ptr, bytes.length).set(bytes);
    return ptr;
  }

  private writeJson(value: unknown): { ptr: number; len: number } {
    const bytes = this.enc.encode(JSON.stringify(value));
    return { ptr: this.write(bytes), len: bytes.length };
  }

  /** Read a `[u32 len][payload]` length-prefixed blob returned by an export. */
  private readPrefixed(ptr: number): string {
    const view = new DataView(this.exports.memory.buffer);
    const len = view.getUint32(ptr, true);
    return this.dec.decode(new Uint8Array(this.exports.memory.buffer, ptr + 4, len));
  }

  private writeInit(config: MatchConfig): void {
    const { ptr, len } = this.writeJson(config);
    this.exports.mag_init(ptr, len);
  }

  /**
   * Inject a set of spawned players. The reference ABI exposes no `on_join`, so
   * players are seeded exactly the way magnetite's own SDK tests do it: build a
   * snapshot and `mag_restore` it. Without this the arena is empty and every
   * input is rejected `Unauthorized`.
   */
  restorePlayers(players: SpawnSpec[]): void {
    const snapshot: ArenaSnapshot = {
      players: players.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        angle: p.angle ?? 0,
        hp: 100,
        alive: true,
        last_shot_tick: 0,
        score: 0,
      })),
      projectiles: [],
      tick: 0,
    };
    this.restore(snapshot);
  }

  /** Replace authoritative state from a full snapshot. */
  restore(snapshot: ArenaSnapshot): void {
    const { ptr, len } = this.writeJson(snapshot);
    this.exports.mag_restore(ptr, len);
  }

  /**
   * Advance the simulation one authoritative tick given `(playerId, Input)`
   * pairs, and return the tick's `StepOutput` (rejects + `state_hash`).
   */
  step(inputs: Array<[number, Input]>): StepOutput {
    const { ptr, len } = this.writeJson(inputs);
    const outPtr = this.exports.mag_step(ptr, len);
    this.stepCount += 1;
    const raw = this.readPrefixed(outPtr);
    // state_hash is a u64; pull it out as an exact decimal string before
    // JSON.parse can round it. rejects is small and safe to parse normally.
    const hashMatch = raw.match(/"state_hash":\s*(\d+)/);
    const state_hash = hashMatch ? hashMatch[1] : '0';
    let rejects: Array<[number, unknown]> = [];
    try {
      rejects = (JSON.parse(raw).rejects as Array<[number, unknown]>) ?? [];
    } catch {
      rejects = [];
    }
    return { rejects, state_hash };
  }

  /** Serialise the full authoritative state. */
  snapshot(): ArenaSnapshot {
    const raw = this.readPrefixed(this.exports.mag_snapshot());
    return JSON.parse(raw) as ArenaSnapshot;
  }

  /** The interest-filtered authoritative view for one player. */
  view(playerId: number): ArenaView {
    const raw = this.readPrefixed(this.exports.mag_view(BigInt(playerId)));
    return JSON.parse(raw) as ArenaView;
  }
}

/** Build the `Topology::SingleRoom` config the in-browser rung uses. */
export function singleRoomConfig(overrides: Partial<MatchConfig> = {}): MatchConfig {
  return {
    topology: 'SingleRoom',
    max_players: 4,
    tick_hz: 60,
    seed: 1,
    snapshot_every: 300,
    ...overrides,
  };
}
