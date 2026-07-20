import { keypointMap, type BoundPerson, type Landmark } from './types';
import type { WristSample } from './recognizers/swing';

/**
 * Skeleton rendering helper.
 *
 * This exists as an OPTIONAL helper the consumer calls with a canvas THEY own.
 * The library never creates or attaches a canvas. The old detector drew into a
 * <canvas> it appended to document.body along with a "Hide Camera" button and
 * inline styles — that coupling is the whole reason it was unusable as a
 * library, and it is not reintroduced here.
 */

export const POSE_CONNECTIONS: Array<[string, string]> = [
  ['nose', 'left_eye'],
  ['left_eye', 'left_ear'],
  ['nose', 'right_eye'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

const PLAYER_COLORS = ['#00ff88', '#ffb300', '#4fd1c7', '#ff6b9d', '#a78bfa', '#f87171'];

export interface DrawOptions {
  minScore?: number;
  /** Highlight this arm per player, e.g. from Calibration handedness. */
  highlightArm?: (playerId: string) => 'left' | 'right' | null;
  /** Optional wrist trail per player, e.g. SwingRecognizer.historyFor(id). */
  trailFor?: (playerId: string) => readonly WristSample[];
  showLabels?: boolean;
}

export function colorForPlayer(playerId: string, index: number): string {
  const m = /(\d+)$/.exec(playerId);
  const n = m ? parseInt(m[1], 10) - 1 : index;
  return PLAYER_COLORS[((n % PLAYER_COLORS.length) + PLAYER_COLORS.length) % PLAYER_COLORS.length];
}

/**
 * Draw bound skeletons onto a 2D context. Coordinates are normalized [0,1] and
 * scaled to the context's canvas size here.
 */
export function drawSkeletons(
  ctx: CanvasRenderingContext2D,
  people: BoundPerson[],
  options: DrawOptions = {},
): void {
  const { canvas } = ctx;
  const W = canvas.width;
  const H = canvas.height;
  const minScore = options.minScore ?? 0.3;
  const scale = Math.max(1, W / 320);

  ctx.clearRect(0, 0, W, H);

  people.forEach((person, index) => {
    const color = colorForPlayer(person.playerId, index);
    const map = keypointMap(person);
    const px = (kp: Landmark) => ({ x: kp.x * W, y: kp.y * H });

    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2 * scale;
    for (const [a, b] of POSE_CONNECTIONS) {
      const ka = map[a];
      const kb = map[b];
      if (!ka || !kb || ka.score < minScore || kb.score < minScore) continue;
      const pa = px(ka);
      const pb = px(kb);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    const arm = options.highlightArm?.(person.playerId) ?? null;
    if (arm) {
      const s = map[`${arm}_shoulder`];
      const e = map[`${arm}_elbow`];
      const w = map[`${arm}_wrist`];
      if (s && e && w && s.score >= minScore && e.score >= minScore && w.score >= minScore) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 4 * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const ps = px(s);
        const pe = px(e);
        const pw = px(w);
        ctx.moveTo(ps.x, ps.y);
        ctx.lineTo(pe.x, pe.y);
        ctx.lineTo(pw.x, pw.y);
        ctx.stroke();
      }
    }

    for (const kp of person.keypoints) {
      if (kp.score < minScore) continue;
      const p = px(kp);
      const isSwingWrist = arm !== null && kp.name === `${arm}_wrist`;
      ctx.fillStyle = isSwingWrist ? color : 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, (isSwingWrist ? 7 : 3.5) * scale * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    const trail = options.trailFor?.(person.playerId) ?? [];
    if (trail.length > 1) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 3 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(trail[0].wristX * W, trail[0].wristY * H);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].wristX * W, trail[i].wristY * H);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (options.showLabels) {
      const head = map['nose'];
      const anchor = head && head.score >= minScore ? px(head) : null;
      if (anchor) {
        ctx.fillStyle = color;
        ctx.font = `${Math.max(11, 12 * scale * 0.6)}px system-ui, sans-serif`;
        ctx.fillText(person.playerId, anchor.x - 20, anchor.y - 14 * scale * 0.6);
      }
    }
  });
}
