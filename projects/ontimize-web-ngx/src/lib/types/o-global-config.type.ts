import { InjectionToken } from "@angular/core";
import { ORowHeight } from "../util/codes";

export type OGlobalConfig = {
  storeState: boolean;
  rowHeight: ORowHeight;
};

export const O_GLOBAL_CONFIG = new InjectionToken<OGlobalConfig>('o-global-config');
