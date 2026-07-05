import { describe, it, expect } from 'vitest';
import { runtimeContext } from '../scripts/gameState/runtimeContext';
import {go} from "../scripts/main";

// This test ensures basic navigation and location stack/bridge behavior.
describe('NavigationSmoke', () => {
  it('can go to a location and back', () => {
    const startLoc = runtimeContext.CurrentLocation;
    go('thePark');
    expect(runtimeContext.CurrentLocation).toBe('thePark');
    go('home');
    expect(runtimeContext.CurrentLocation).toBe('home');
    // Restore original location
    go(startLoc);
  });

  it('location stack push/pop works', () => {
    const stackLen = runtimeContext.LocStack.length;
    go('thePark');
    expect(runtimeContext.LocStack.length).toBe(stackLen + 1);
    go('home');
    expect(runtimeContext.LocStack.length).toBe(stackLen + 2);
    // Pop back
    runtimeContext.LocStack.pop();
    expect(runtimeContext.LocStack.length).toBe(stackLen + 1);
    runtimeContext.LocStack.pop();
    expect(runtimeContext.LocStack.length).toBe(stackLen);
  });
});
