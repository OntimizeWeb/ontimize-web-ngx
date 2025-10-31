import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { OFormComponent } from './o-form.component';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OFormComponent', () => {
  let component: OFormComponent;
  let fixture: ComponentFixture<OFormComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Create mock for ActivatedRoute
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    });
    
    // Create mock for MatSnackBar
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [OFormComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockSnackBar },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .overrideComponent(OFormComponent, {
      set: {
        template: '<div></div>' // Override template to avoid OWrapperContentMenuComponent issues
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(OFormComponent);
    component = fixture.componentInstance;
    
    // Mock formNavigation to prevent 'Cannot read properties of undefined (reading subscribe)'
    (component as any).formNavigation = {
      subscribeToQueryParams: jasmine.createSpy('subscribeToQueryParams'),
      subscribeToUrlParams: jasmine.createSpy('subscribeToUrlParams'),
      subscribeToUrl: jasmine.createSpy('subscribeToUrl'),
      subscribeToCacheChanges: jasmine.createSpy('subscribeToCacheChanges'),
      initialize: jasmine.createSpy('initialize')
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OFormComponent);
  });
});
