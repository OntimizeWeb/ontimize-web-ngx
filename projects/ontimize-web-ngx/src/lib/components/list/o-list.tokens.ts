import { InjectionToken } from '@angular/core';

import { OListGlobalConfig } from '../../types/o-list-global-config.type';

/**
 * Injection token that can be used to set global options for o-list, application- or module-wide.
 * Currently only exposes the loading skeleton's threshold/minVisible delays — the same mechanism
 * `O_TABLE_GLOBAL_CONFIG` provides for o-table.
 */
export const O_LIST_GLOBAL_CONFIG = new InjectionToken<OListGlobalConfig>('o-list-config');
