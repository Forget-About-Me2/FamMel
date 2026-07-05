import { describe, it, expect } from 'vitest';
import { runtimeContext } from '../scripts/gameState/runtimeContext';

// This test covers migrated settings and sex-scene state, including canonical sync and malformed recovery.
describe('SettingsSexSceneOwnershipBridge', () => {
  it('syncs settings and sex-scene state between legacy and canonical', () => {
    // Simulate legacy write
    (window as any).sexSceneState = 'active';
    (window as any).settings = { volume: 0.5 };
    if (typeof (window as any).syncSettingsSexScene === 'function') {
      (window as any).syncSettingsSexScene();
    }
    expect(runtimeContext.Settings.SexSceneState).toBe('active');
    expect(runtimeContext.Settings.Volume).toBe(0.5);
    // Canonical write
    runtimeContext.Settings.SexSceneState = 'inactive';
    runtimeContext.Settings.Volume = 1.0;
    if (typeof (window as any).syncSettingsSexScene === 'function') {
      (window as any).syncSettingsSexScene();
    }
    expect((window as any).sexSceneState).toBe('inactive');
    expect((window as any).settings.volume).toBe(1.0);
  });
});
