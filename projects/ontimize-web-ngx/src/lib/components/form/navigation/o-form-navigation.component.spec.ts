import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OFormNavigationComponent } from './o-form-navigation.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OFormBase } from '../o-form-base.class';

describe('OFormNavigationComponent', () => {
  let component: OFormNavigationComponent;
  let fixture: ComponentFixture<OFormNavigationComponent>;
  let mockOFormBase: jasmine.SpyObj<OFormBase>;

  beforeEach(async () => {
    // Create mock for OFormBase
    mockOFormBase = jasmine.createSpyObj('OFormBase', [
      'getFormNavigation',
      'getFormManager',
      'showConfirmDiscardChanges',
      'setUrlParamsAndReload'
    ]);
    mockOFormBase.keysArray = [];
    mockOFormBase.canDiscardChanges = false;
    
    // Create mock for OFormNavigationClass
    const mockFormNavigation = jasmine.createSpyObj('OFormNavigationClass', ['getUrlParams']);
    mockFormNavigation.getUrlParams.and.returnValue({});
    
    mockOFormBase.getFormNavigation.and.returnValue(mockFormNavigation);
    mockOFormBase.getFormManager.and.returnValue(null);
    mockOFormBase.showConfirmDiscardChanges.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [OFormNavigationComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: OFormBase, useValue: mockOFormBase },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OFormNavigationComponent);
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
    expect(component).toBeInstanceOf(OFormNavigationComponent);
  });
});
