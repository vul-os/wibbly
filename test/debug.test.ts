import { afterEach, describe, expect, it, vi } from 'vitest';
import { debugLog, isDebugEnabled, setDebugEnabled } from '../games/tennis/debug';

describe('game debug logging', () => {
  afterEach(() => {
    setDebugEnabled(false);
    vi.restoreAllMocks();
  });

  it('is off by default outside a browser (no window → no ?debug, no localStorage)', () => {
    expect(isDebugEnabled()).toBe(false);
  });

  it('debugLog stays silent while disabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    debugLog('collision spam', 1, 2, 3);
    expect(spy).not.toHaveBeenCalled();
  });

  it('debugLog forwards to console.log once enabled, with all args intact', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    setDebugEnabled(true);
    expect(isDebugEnabled()).toBe(true);
    debugLog('Ball hit', 'right', 42);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Ball hit', 'right', 42);
  });

  it('can be turned back off', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    setDebugEnabled(true);
    setDebugEnabled(false);
    debugLog('should not print');
    expect(spy).not.toHaveBeenCalled();
  });
});
