/**
 * The game catalogue.
 *
 * `status` is the only thing that decides whether a card can be entered, and
 * exactly one entry is `playable`. Soccer and Boxing are tracked backlog items
 * in WIBBLY.md §8 — they have no code, so they are marked `planned`, are not
 * clickable, and carry the reason they are on the list at all. Nothing here
 * claims a release date.
 */

export const GAMES = [
  {
    id: 'tennis',
    name: 'Tennis',
    status: 'playable',
    path: '/play',
    blurb: 'Swing your arm to hit the ball. One camera, one player, one gesture.',
    detail:
      'The reference game. Three.js court, ball physics and an AI opponent, driven by the ' +
      'SwingRecognizer seam — or by the spacebar if you would rather not use a camera.',
    gesture: 'swing',
    art: 'tennis',
  },
  {
    id: 'soccer',
    name: 'Soccer',
    status: 'planned',
    blurb: 'Planned. The first game that needs a gesture below the waist.',
    detail:
      'A kick is a lower-body gesture, so it exercises leg keypoints the SwingRecognizer ' +
      'ignores. That is the point: it forces GestureRecognizer to be genuinely plural.',
    gesture: 'kick — not built',
    art: 'soccer',
  },
  {
    id: 'boxing',
    name: 'Boxing',
    status: 'planned',
    blurb: 'Planned. The first game that needs both hands tracked independently.',
    detail:
      'Two gesture streams from one player, with per-arm cooldowns, rather than one dominant ' +
      'hand — the assumption baked into Calibration.handedness today. Also the natural first ' +
      'test of two players on one camera.',
    gesture: 'punch ×2 — not built',
    art: 'boxing',
  },
  {
    id: 'palmworks',
    name: 'Palmworks',
    status: 'planned',
    blurb: 'Planned. Build a factory with your hands.',
    detail:
      'Place pumps, boilers, tanks and heat exchangers on a grid and route the pipework between ' +
      'them. The scene and 29 industrial objects are already in games/palmworks — what is missing ' +
      'is the hands: pinch to place, point to select, pinch-drag to connect two ports.',
    gesture: 'pinch + point — not built',
    art: 'palmworks',
  },
];

export const PLAYABLE_GAMES = GAMES.filter((g) => g.status === 'playable');
