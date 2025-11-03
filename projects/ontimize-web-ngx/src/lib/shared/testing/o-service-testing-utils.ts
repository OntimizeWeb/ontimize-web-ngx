import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../../config/app-config';
import { AppConfig } from '../../config/app-config';
import { appConfigFactory, AuthService, LocalStorageService } from '../../services';
import { Config } from '../../types/config.type';
import { Injector } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

// Import base testing utils
import { OTestingUtils } from './o-testing-utils';

// Import service-specific dependencies
import { NameConvention } from '../../services/name-convention/name-convention.service';
import { DialogService } from '../../services/dialog.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';
import { OUserInfoService } from '../../services/o-user-info.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
import { IconService } from '../../services/icon.service';
import { SnackBarService } from '../../services/snackbar.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { ElementRef, Renderer2, NgZone } from '@angular/core';
import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';

// Import specific adapter for the NullInjectorError fix
import { OntimizeRequestArgumentsAdapter } from '../../services/request-adapter/ontimize-request-arguments.adapter';

/**
 * Specialized testing utilities for Ontimize service tests
 * Services often have complex interdependencies that require specific provider configurations
 */
export class OServiceTestingUtils extends OTestingUtils {

  /**
   * Mock configuration specifically for service testing
   */
  static mockServiceConfiguration(): Config {
    return {
      uuid: 'com.ontimize.web.service.test',
      title: 'Ontimize Service Testing',
      locale: 'en',
      applicationLocales: ['en', 'es'],
      serviceType: 'OntimizeEE',
      apiEndpoint: 'http://localhost:8080/test-api',
      bundle: {
        endpoint: 'http://localhost:8080/test-bundle'
      }
    };
  }

  /**
   * Get testing module configuration specifically for service tests
   * Includes all necessary providers for service dependencies
   */
  static getServiceTestingModuleConfig() {
    const baseConfig = OTestingUtils.getCommonTestingModuleConfig();
    
    return {
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatDialogModule,
        MatSnackBarModule,
        ...baseConfig.imports
      ],
      providers: [
        // Override config for services
        { provide: APP_CONFIG, useValue: OServiceTestingUtils.mockServiceConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] },
        
        // Core Angular services
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {}, data: {} }
          }
        },
        
        // Ontimize core services
        {
          provide: AuthService,
          useClass: AuthService,
          deps: [Injector]
        },
        {
          provide: LocalStorageService,
          useClass: LocalStorageService,
          deps: [Injector]
        },
        {
          provide: NameConvention,
          useClass: NameConvention
        },
        {
          provide: DialogService,
          useClass: DialogService
        },
        {
          provide: SnackBarService,
          useValue: jasmine.createSpyObj('SnackBarService', ['open', 'dismiss'])
        },
        {
          provide: IconService,
          useValue: jasmine.createSpyObj('IconService', ['addIcon', 'getIcon'])
        },
        
        // Advanced Ontimize services - Use MOCKS to avoid dependency issues
        {
          provide: OntimizeService,
          useValue: jasmine.createSpyObj('OntimizeService', [
            'query', 'insert', 'update', 'delete', 'advancedQuery',
            'configureService', 'getDefaultServiceConfiguration'
          ])
        },
        {
          provide: OUserInfoService,
          useValue: jasmine.createSpyObj('OUserInfoService', [
            'getUserInfo', 'setUserInfo', 'getMenuPermissions'
          ])
        },
        {
          provide: OModulesInfoService,
          useValue: jasmine.createSpyObj('OModulesInfoService', [
            'getModulesInfo', 'setModulesInfo'
          ])
        },
        {
          provide: OTranslateService,
          useValue: jasmine.createSpyObj('OTranslateService', [
            'get', 'set', 'use', 'getDefaultLang', 'getBrowserLang'
          ])
        },
        {
          provide: OFormLayoutManagerService,
          useValue: jasmine.createSpyObj('OFormLayoutManagerService', [
            'addFormLayoutManager', 'getFormLayoutManager', 'removeFormLayoutManager'
          ])
        },
        
        // Common Angular services that services often need
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'])
        },
        {
          provide: Location,
          useValue: jasmine.createSpyObj('Location', ['back', 'forward', 'go', 'path'])
        },
        {
          provide: DOCUMENT,
          useValue: document
        },
        {
          provide: NgZone,
          useValue: jasmine.createSpyObj('NgZone', ['run', 'runOutsideAngular'])
        },
        {
          provide: ElementRef,
          useValue: jasmine.createSpyObj('ElementRef', [], { nativeElement: document.createElement('div') })
        },
        {
          provide: Renderer2,
          useValue: jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild', 'setAttribute', 'removeAttribute'])
        },
        
        // SPECIFIC fix for the mentioned NullInjectorError
        {
          provide: OntimizeRequestArgumentsAdapter,
          useValue: jasmine.createSpyObj('OntimizeRequestArgumentsAdapter', ['parseQueryParameters', 'getIdFromFilter'])
        }
      ]
    };
  }

  /**
   * Create mock HTTP client for service testing
   */
  static createMockHttpClient(): jasmine.SpyObj<any> {
    return jasmine.createSpyObj('HttpClient', [
      'get', 'post', 'put', 'delete', 'patch', 'head', 'options'
    ], {
      // Mock observables for HTTP methods
      get: of({}),
      post: of({}),
      put: of({}),
      delete: of({}),
      patch: of({}),
      head: of({}),
      options: of({})
    });
  }

  /**
   * Create mock Ontimize service response
   */
  static createMockOntimizeResponse(data: any = {}, code: number = 0): any {
    return {
      data: data,
      code: code,
      message: '',
      sqlTypes: {},
      startRecordIndex: 0,
      totalQueryRecordsNumber: Array.isArray(data) ? data.length : 1
    };
  }

  /**
   * Create mock for service configuration
   */
  static createMockServiceConfig(overrides: any = {}): any {
    return {
      urlBase: 'http://localhost:8080',
      path: '/test-service',
      kv: {},
      av: [],
      entity: 'TestEntity',
      service: 'TestService',
      ...overrides
    };
  }
}