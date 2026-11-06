import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { OFormGlobalConfig } from "../../types/form/o-form-global-config.type";

/**
 * A plain OFormGlobalConfig applies once, at each form's construction. Provide an
 * Observable<OFormGlobalConfig> instead for a config that can change at runtime and
 * be re-applied to every already-constructed `o-form` (e.g. a user-toggled app setting).
 */
export const O_FORM_GLOBAL_CONFIG = new InjectionToken<OFormGlobalConfig | Observable<OFormGlobalConfig>>('o-form-config');