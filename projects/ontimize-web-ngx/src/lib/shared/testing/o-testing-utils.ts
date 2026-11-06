import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement, ChangeDetectorRef, Injector } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { APP_CONFIG, AppConfig } from '../../config/app-config';
import { appConfigFactory, AuthService, LocalStorageService } from '../../services';
import { Config } from '../../types/config.type';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { OTranslatePipe } from '../../pipes/o-translate.pipe';
import { OIntegerPipe } from '../../pipes/o-integer.pipe';
import { OSafePipe } from '../../pipes/o-safe.pipe';
import { OMomentPipe } from '../../pipes/o-moment.pipe';
import { OLuxonPipe } from '../../pipes/o-luxon.pipe';
import { OIconPipe } from '../../pipes/o-icon.pipe';
import { ORealPipe } from '../../pipes/o-real.pipe';
import { OCurrencyPipe } from '../../pipes/o-currency.pipe';
import { OPercentPipe } from '../../pipes/o-percentage.pipe';

import { OTableExportButtonService } from '../../components/table/extensions/export-button/o-table-export-button.service';
import { NameConvention } from '../../services/name-convention/name-convention.service';
import { OFilterBuilderComponentStateService } from '../../services/state/o-filter-builder-component-state.service';
import { DialogService } from '../../services/dialog.service';
import { OntimizeRequestArgumentsAdapter } from '../../services/request-adapter/ontimize-request-arguments.adapter';
import { NavigationService } from '../../services/navigation.service';
import { O_JSON_API_CONFIG } from '../../injection-tokens';
import { OntimizeExportDataProviderService } from '../../services/ontimize-export-data-provider.service';
import { OErrorDialogManager } from '../../services/o-error-dialog-manager.service';
import { LoginStorageService } from '../../services/login-storage.service';
import { OntimizeServiceResponseParser } from '../../services/parser/o-service-response.parser';
import { OntimizeServiceResponseAdapter } from '../../services/ontimize/ontimize-service-response.adapter';
import { PaginationContextService } from '../../services/pagination-context.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';


/**
 * Common testing utilities for Ontimize Web NGX components
 */
export class OTestingUtils {

  /**
   * Mock configuration for testing
   */
  static mockConfiguration(): Config {
    return {
      uuid: 'com.ontimize.web.test',
      title: 'Ontimize Web Testing',
      locale: 'en'
    };
  }

  /**
   * Get common declarations (pipes, directives) for testing
   * Note: Standalone pipes/directives should NOT be here — use getCommonTestingModuleConfig().imports instead
   */
  static getCommonDeclarations() {
    return [];
  }

  /**
   * Common testing module configuration
   */
  static getCommonTestingModuleConfig() {
    return {
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatDialogModule,
        MatSnackBarModule,
        OTranslatePipe
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
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
        { provide: APP_CONFIG, useValue: OTestingUtils.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {}, data: {} }
          }
        },
        {
          provide: ChangeDetectorRef,
          useValue: jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges', 'detach', 'reattach'])
        },
        {
          provide: OTableExportButtonService,
          useValue: {
            export$: new Subject<string>()
          }
        },
        {
          provide: NameConvention,
          useClass: NameConvention
        },
        {
          provide: OFilterBuilderComponentStateService,
          useClass: OFilterBuilderComponentStateService
        },
        {
          provide: DialogService,
          useClass: DialogService
        },
        {
          provide: OntimizeRequestArgumentsAdapter,
          useValue: jasmine.createSpyObj('OntimizeRequestArgumentsAdapter', ['parseQueryParameters', 'getIdFromFilter', 'setPaginationContextService'])
        },
        {
          provide: NavigationService,
          useValue: jasmine.createSpyObj('NavigationService', ['navigate', 'getPreviousRouteData', 'getLastItem'])
        },
        {
          provide: O_JSON_API_CONFIG,
          useValue: {}
        },
        {
          provide: OntimizeExportDataProviderService,
          useValue: jasmine.createSpyObj('OntimizeExportDataProviderService', ['getExportOptions', 'getColumnDataTypes', 'arrangeColumns'])
        },
        {
          provide: OErrorDialogManager,
          useValue: jasmine.createSpyObj('OErrorDialogManager', ['openErrorDialog', 'showError'])
        },
        {
          provide: LoginStorageService,
          useClass: LoginStorageService
        },
        {
          provide: OntimizeServiceResponseParser,
          useValue: jasmine.createSpyObj('OntimizeServiceResponseParser', ['parseSuccessfulResponse', 'parseUnsuccessfulResponse'])
        },
        {
          provide: OntimizeServiceResponseAdapter,
          useValue: jasmine.createSpyObj('OntimizeServiceResponseAdapter', ['adapt', 'handleError'])
        },
        {
          provide: PaginationContextService,
          useValue: jasmine.createSpyObj('PaginationContextService', ['setContext', 'getContext'])
        },
        {
          provide: OntimizeService,
          useValue: jasmine.createSpyObj('OntimizeService', ['configureService', 'query', 'advancedQuery', 'insert', 'update', 'delete'])
        },
        // Pipes used via inject() in components
        { provide: OIntegerPipe, useClass: OIntegerPipe, deps: [Injector] },
        { provide: ORealPipe, useClass: ORealPipe, deps: [Injector] },
        { provide: OCurrencyPipe, useClass: OCurrencyPipe, deps: [Injector] },
        { provide: OPercentPipe, useClass: OPercentPipe, deps: [Injector] },
        { provide: OSafePipe, useClass: OSafePipe, deps: [Injector] },
        { provide: OMomentPipe, useClass: OMomentPipe, deps: [Injector] },
        { provide: OLuxonPipe, useClass: OLuxonPipe, deps: [Injector] },
        { provide: OIconPipe, useClass: OIconPipe, deps: [Injector] },
      ]
    };
  }

  /**
   * Create a mock form group for input components
   */
  static createMockFormGroup(controlName: string = 'testControl', initialValue: any = null): FormGroup {
    const formGroup = new FormGroup({});
    formGroup.addControl(controlName, new FormControl(initialValue));
    return formGroup;
  }

  /**
   * Create a basic test component wrapper
   */
  static createTestComponent<T>(componentClass: any, template: string = '<ng-content></ng-content>'): ComponentFixture<any> {
    @Component({
      template: template
    })
    class TestComponent { }

    const fixture = TestBed.createComponent(TestComponent);
    return fixture;
  }

  /**
   * Get element by CSS selector
   */
  static getElement<T = HTMLElement>(fixture: ComponentFixture<any>, selector: string): T {
    const debugElement: DebugElement = fixture.debugElement.query(By.css(selector));
    return debugElement ? debugElement.nativeElement : null;
  }

  /**
   * Get all elements by CSS selector
   */
  static getAllElements<T = HTMLElement>(fixture: ComponentFixture<any>, selector: string): T[] {
    const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.css(selector));
    return debugElements.map(de => de.nativeElement);
  }

  /**
   * Trigger event on element
   */
  static triggerEvent(element: HTMLElement, eventName: string, eventData?: any): void {
    const event = new Event(eventName, { bubbles: true });
    if (eventData) {
      Object.assign(event, eventData);
    }
    element.dispatchEvent(event);
  }

  /**
   * Wait for async operations
   */
  static async waitForAsync(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Mock Ontimize service response
   */
  static createMockServiceResponse(data: any = {}, code: number = 0): any {
    return {
      code: code,
      data: data,
      message: '',
      sqlTypes: {},
      startRecordIndex: 0,
      totalQueryRecordsNumber: Array.isArray(data) ? data.length : 1
    };
  }

  /**
   * Mock error service response
   */
  static createMockErrorResponse(message: string = 'Test error', code: number = 1): any {
    return {
      code: code,
      message: message,
      data: null
    };
  }
}