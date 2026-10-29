import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { OTableGlobalConfig } from "../../../types/table/o-table-global-config.type";

/**
 * A plain OTableGlobalConfig applies once, at each table's construction. Provide an
 * Observable<OTableGlobalConfig> instead for a config that can change at runtime and
 * be re-applied to every already-constructed `o-table` (e.g. a user-toggled app setting).
 */
export const O_TABLE_GLOBAL_CONFIG = new InjectionToken<OTableGlobalConfig | Observable<OTableGlobalConfig>>('o-table-config');