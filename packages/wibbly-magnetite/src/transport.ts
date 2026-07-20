/**
 * The transport seam, and the default adapter over `magnetite-web-client`.
 *
 * Why a seam rather than importing the client directly:
 *
 *  1. `magnetite-web-client` is not published to a registry and lives in a
 *     sibling repo (`magnetite/magnetite-web-client`). Wibbly is not going to
 *     hard-depend on a relative path outside its own tree.
 *  2. Tests must run in node with no live server, so the transport has to be
 *     replaceable. It is the whole mocking surface for this package.
 *  3. `MagnetiteClient`'s documented public API is `connect / disconnect /
 *     sendInput / onState / playerId / matchConfig / state`. **There is no
 *     public method for sending a frame that is not a `ClientNet::InputFrame`**,
 *     and an attested event is not one. Confining that awkwardness to one
 *     adapter is better than smearing it across the session.
 */

/** Minimal transport contract the session needs. */
export interface MagnetiteTransport {
  connect(): void | Promise<void>;
  disconnect(): void;
  /** Send a serialized frame. Returns false if the socket is not open. */
  send(frame: string): boolean;
  readonly isConnected: boolean;
  /** Register an open handler. Called again on every reconnect. */
  onOpen(cb: () => void): void;
  onClose(cb: () => void): void;
  onError(cb: (err: unknown) => void): void;
}

/** The subset of `MagnetiteClient` this package touches. */
export interface MagnetiteClientLike {
  connect(): unknown;
  disconnect(): void;
  readonly playerId?: string | null;
  /** Not in magnetite today — honoured first if a future version adds it. */
  sendRaw?(frame: string): boolean;
  /** `ConnectionManager`, reached only as documented in {@link clientTransport}. */
  _conn?: {
    send(frame: string): void;
    readonly isConnected: boolean;
    onOpen: (() => void) | null;
    onClose: ((e?: unknown) => void) | null;
    onError: ((e?: unknown) => void) | null;
  };
}

/**
 * Adapt a `MagnetiteClient` (from `createClient`) to {@link MagnetiteTransport}.
 *
 * ── The one ugly part, stated plainly ───────────────────────────────────────
 * To put bytes on the wire we need `ConnectionManager.send`, which the client
 * owns as `_conn` and does not re-export. We prefer a public `sendRaw` if a
 * future magnetite adds one, then fall back to `_conn`, then fail loudly with
 * an actionable message rather than silently dropping every event.
 *
 * This is a genuine upstream gap, not cleverness: magnetite has no client→server
 * attested-event path at all (see `ATTESTED_FRAME_TYPE` in wire.ts). When one
 * lands, this fallback should be deleted.
 */
export function clientTransport(client: MagnetiteClientLike): MagnetiteTransport {
  const conn = client._conn;
  const sender: (frame: string) => boolean = client.sendRaw
    ? (f) => client.sendRaw!(f)
    : conn
      ? (f) => {
          if (!conn.isConnected) return false;
          conn.send(f);
          return true;
        }
      : () => {
          throw new Error(
            'magnetite client exposes neither sendRaw() nor a _conn ConnectionManager; ' +
              'cannot send attested events. Pass an explicit `transport` to MagnetiteSession.',
          );
        };

  return {
    connect: () => void client.connect(),
    disconnect: () => client.disconnect(),
    send: sender,
    get isConnected() {
      return conn ? conn.isConnected : false;
    },
    onOpen(cb) {
      if (conn) conn.onOpen = cb;
    },
    onClose(cb) {
      if (conn) conn.onClose = () => cb();
    },
    onError(cb) {
      if (conn) conn.onError = (e) => cb(e);
    },
  };
}
