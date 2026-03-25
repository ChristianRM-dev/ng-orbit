import { InjectionToken, type EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { OrbitNotifyService } from './orbit-notify.service';
import type { OrbitNotifyConfig } from './notify.types';

/**
 * Injector-scoped config token used by {@link OrbitNotifyService}.
 */
export const ORBIT_NOTIFY_CONFIG = new InjectionToken<OrbitNotifyConfig>(
  'ORBIT_NOTIFY_CONFIG',
  {
    factory: () => ({})
  }
);

/**
 * Provides the notify service and optional defaults for the current injector tree.
 */
export function provideOrbitNotify(
  config: Partial<OrbitNotifyConfig> = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    OrbitNotifyService,
    {
      provide: ORBIT_NOTIFY_CONFIG,
      useValue: config
    }
  ]);
}
