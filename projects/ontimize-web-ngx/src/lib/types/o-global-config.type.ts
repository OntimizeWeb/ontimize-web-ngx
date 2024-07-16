import { InjectionToken } from "@angular/core";

export type OGlobalConfig = {
  storeState: boolean;
};

export const O_GLOBAL_CONFIG = new InjectionToken<OGlobalConfig>('o-global-config');
