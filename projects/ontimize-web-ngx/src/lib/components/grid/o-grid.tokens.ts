import { InjectionToken } from '@angular/core';

import { OGridGlobalConfig } from '../../types/o-grid-global-config.type';

/**
 * Injection token that can be used to set global options for o-grid, application- or module-wide.
 * Currently only exposes the loading skeleton's threshold/minVisible delays — the same mechanism
 * `O_TABLE_GLOBAL_CONFIG` provides for o-table.
 */
export const O_GRID_GLOBAL_CONFIG = new InjectionToken<OGridGlobalConfig>('o-grid-config');
