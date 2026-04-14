import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, EnvironmentProviders, Injector, makeEnvironmentProviders } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { APP_CONFIG, AppConfig } from './app-config';
import { OHttpLoaderFactory, OTranslateParserFactory } from './o-modules';
import { appInitializerFactory, ONTIMIZE_PROVIDERS } from './o-providers';
import { OntimizeMatIconRegistry } from '../services/ontimize-icon-registry.service';
import { OntimizePermissionsService } from '../services/permissions/ontimize-permissions.service';
import { PermissionsGuardService } from '../services/permissions/permissions-can-activate.guard';
import { permissionsServiceFactory } from '../services/factories';
import { OTranslateService } from '../services/translate/o-translate.service';
import { Config } from '../types/config.type';

export interface ProvideOntimizeWebOptions {
  /** Pass `true` to disable animations (e.g. in test environments). Default: false */
  noAnimations?: boolean;
}

/**
 * Standalone alternative to `OntimizeWebModule.forRoot(config)`.
 *
 * Use with `bootstrapApplication()`:
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideOntimizeWeb(CONFIG),
 *     provideRouter(routes),
 *   ]
 * });
 * ```
 *
 * The returned providers include:
 * - `provideHttpClient()` with interceptors from DI
 * - `provideAnimations()` (or `provideNoopAnimations()` when `noAnimations: true`)
 * - TranslateModule providers (ngx-translate)
 * - NgxMaterialTimepickerModule providers
 * - All Ontimize singleton providers (services, adapters, MAT_RIPPLE_GLOBAL_OPTIONS, etc.)
 * - APP_INITIALIZER for translate, navigation and icon registry
 * - Permissions service providers
 */
export function provideOntimizeWeb(config: Config, options: ProvideOntimizeWebOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    // HTTP client — must come before services that use HttpClient
    provideHttpClient(withInterceptorsFromDi()),

    // Animations
    options.noAnimations ? provideNoopAnimations() : provideAnimations(),

    // ngx-translate (TranslateModule.forRoot providers)
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: OHttpLoaderFactory,
          deps: [HttpClient, Injector, AppConfig]
        },
        parser: {
          provide: TranslateParser,
          useFactory: OTranslateParserFactory
        }
      })
    ),

    // NgxMaterialTimepickerModule providers
    importProvidersFrom(NgxMaterialTimepickerModule),

    // App config token
    { provide: APP_CONFIG, useValue: config },

    // All Ontimize singleton providers (services, adapters, MAT_RIPPLE_GLOBAL_OPTIONS, etc.)
    ...ONTIMIZE_PROVIDERS,

    // OntimizeMatIconRegistry — not providedIn:'root', registered in CustomMaterialModule
    { provide: OntimizeMatIconRegistry, useClass: OntimizeMatIconRegistry },

    // Permissions providers (from OPermissionsModule)
    { provide: PermissionsGuardService, useClass: PermissionsGuardService },
    { provide: OntimizePermissionsService, useFactory: permissionsServiceFactory, deps: [Injector] },

    // APP_INITIALIZER — translate + navigation + icon registry
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [Injector, APP_CONFIG, OTranslateService],
      multi: true
    }
  ]);
}
