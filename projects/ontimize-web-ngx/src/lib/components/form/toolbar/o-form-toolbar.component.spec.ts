import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OFormToolbarComponent } from './o-form-toolbar.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OFormBase } from '../o-form-base.class';

describe('OFormToolbarComponent', () => {
  let component: OFormToolbarComponent;
  let fixture: ComponentFixture<OFormToolbarComponent>;
  let mockOFormBase: jasmine.SpyObj<OFormBase>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Create mock for OFormBase
    mockOFormBase = jasmine.createSpyObj('OFormBase', [
      'getFormNavigation',
      'getFormManager',
      'showConfirmDiscardChanges',
      'setUrlParamsAndReload',
      'registerToolbar',
      'unregisterToolbar',
      'getAttribute'
    ]);
    mockOFormBase.keysArray = [];
    mockOFormBase.canDiscardChanges = false;
    mockOFormBase.getAttribute.and.returnValue(undefined);

    // Create mock for MatSnackBar
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [OFormToolbarComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: OFormBase, useValue: mockOFormBase },
        { provide: MatSnackBar, useValue: mockSnackBar },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OFormToolbarComponent);
    component = fixture.componentInstance;
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
    expect(component).toBeInstanceOf(OFormToolbarComponent);
  });
});
