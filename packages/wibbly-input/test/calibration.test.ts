import { describe, expect, it } from 'vitest';
import { Calibration, MemoryStorage, checkFraming } from '../src/calibration';
import { makePerson, personWithWrist } from './fixtures';

describe('Calibration', () => {
  it('defaults to right-handed for an unknown player', () => {
    const cal = new Calibration(new MemoryStorage());
    expect(cal.handednessFor('player_1')).toBe('right');
    expect(cal.has('player_1')).toBe(false);
  });

  it('stores and reads back handedness per player', () => {
    const cal = new Calibration(new MemoryStorage());
    cal.setHandedness('player_1', 'left');
    cal.setHandedness('player_2', 'right');
    expect(cal.handednessFor('player_1')).toBe('left');
    expect(cal.handednessFor('player_2')).toBe('right');
  });

  it('persists across instances sharing storage', () => {
    const storage = new MemoryStorage();
    new Calibration(storage).setHandedness('player_1', 'left');
    expect(new Calibration(storage).handednessFor('player_1')).toBe('left');
  });

  it('survives a corrupt payload instead of throwing at startup', () => {
    const storage = new MemoryStorage();
    storage.setItem('wibbly.calibration.v1', '{not json');
    const cal = new Calibration(storage);
    expect(cal.list()).toHaveLength(0);
    expect(cal.handednessFor('player_1')).toBe('right');
  });

  it('rejects entries with an invalid handedness value', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      'wibbly.calibration.v1',
      JSON.stringify([{ playerId: 'player_1', handedness: 'sideways' }]),
    );
    expect(new Calibration(storage).list()).toHaveLength(0);
  });

  it('widens the reach envelope from observed poses', () => {
    const cal = new Calibration(new MemoryStorage());
    cal.setHandedness('p', 'right');

    // Arm tucked in, then fully extended.
    cal.observeReach('p', personWithWrist(0.5, 'right', { x: 0.46, y: 0.44 }));
    const tight = cal.get('p').reach!;
    cal.observeReach('p', personWithWrist(0.5, 'right', { x: 0.15, y: 0.30 }));
    const wide = cal.get('p').reach!;

    expect(wide.min).toBeCloseTo(tight.min, 6);
    expect(wide.max).toBeGreaterThan(tight.max);
  });

  it('tracks the calibrated arm, so handedness changes what reach means', () => {
    const cal = new Calibration(new MemoryStorage());
    cal.setHandedness('p', 'left');
    const updated = cal.observeReach('p', personWithWrist(0.5, 'left', { x: 0.9, y: 0.3 }));
    expect(updated?.reach!.max).toBeGreaterThan(0.2);
  });

  it('refuses to learn reach from a low-confidence pose', () => {
    const cal = new Calibration(new MemoryStorage());
    const person = personWithWrist(0.5, 'right', { x: 0.2, y: 0.3, score: 0.05 });
    expect(cal.observeReach('p', person)).toBeNull();
    expect(cal.get('p').reach).toBeNull();
  });

  it('derives a torso scale as a distance-from-camera proxy', () => {
    const cal = new Calibration(new MemoryStorage());
    cal.observeReach('near', makePerson({ cx: 0.5, scale: 0.12 }));
    cal.observeReach('far', makePerson({ cx: 0.5, scale: 0.04 }));
    expect(cal.get('near').torsoScale!).toBeGreaterThan(cal.get('far').torsoScale!);
  });

  it('clears a single player without disturbing others', () => {
    const cal = new Calibration(new MemoryStorage());
    cal.setHandedness('a', 'left');
    cal.setHandedness('b', 'left');
    cal.clear('a');
    expect(cal.has('a')).toBe(false);
    expect(cal.handednessFor('b')).toBe('left');
  });

  it('degrades to memory when storage throws', () => {
    const hostile = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceeded');
      },
      removeItem: () => {},
    };
    const cal = new Calibration(hostile);
    expect(() => cal.setHandedness('p', 'left')).not.toThrow();
    expect(cal.handednessFor('p')).toBe('left');
  });
});

describe('checkFraming', () => {
  it('reports no-one when there is no pose', () => {
    const w = checkFraming(null);
    expect(w).toHaveLength(1);
    expect(w[0].code).toBe('framing');
  });

  it('passes a well-framed, well-lit person', () => {
    expect(checkFraming(makePerson({ cx: 0.5, keypointScore: 0.9 }))).toHaveLength(0);
  });

  it('warns about framing when the torso is not visible', () => {
    const person = makePerson({
      cx: 0.5,
      overrides: {
        left_hip: { x: 0.5, y: 0.9, score: 0.01 },
        right_hip: { x: 0.4, y: 0.9, score: 0.01 },
      },
    });
    expect(checkFraming(person).some((w) => w.code === 'framing')).toBe(true);
  });

  it('warns about lighting when every keypoint is weakly detected', () => {
    const person = makePerson({ cx: 0.5, keypointScore: 0.31 });
    expect(checkFraming(person).some((w) => w.code === 'lighting')).toBe(true);
  });
});
