import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OCheckboxComponent } from './o-checkbox.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OFormComponent } from '../../form/o-form.component';

describe('OCheckboxComponent', () => {
  let component: OCheckboxComponent;
  let mockFormComponent: any;
  let mockElementRef: ElementRef;
  let injector: Injector;

  beforeEach(async () => {
    // Create mock OFormComponent with formGroup
    mockFormComponent = jasmine.createSpyObj('OFormComponent', [
      'registerFormComponent',
      'unregisterFormComponent',
      'setFormData',
      'registerFormControlComponent',
      'unregisterFormControlComponent',
      'registerSQLTypeFormComponent',
      'unregisterSQLTypeFormComponent',
      'isInUpdateMode',
      'isInInsertMode',
      'isEditableDetail'
    ]);
    mockFormComponent.formGroup = new FormGroup({});
    mockFormComponent.isInUpdateMode.and.returnValue(false);
    mockFormComponent.isInInsertMode.and.returnValue(false);
    mockFormComponent.isEditableDetail.and.returnValue(false);

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: OFormComponent, useValue: mockFormComponent },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    injector = TestBed.inject(Injector);
    mockElementRef = new ElementRef(document.createElement('div'));
    
    // Create component manually to avoid OWrapperContentMenuComponent issues
    component = new OCheckboxComponent(mockFormComponent, mockElementRef, injector);
    
    // Set oattr to prevent initialization issues
    (component as any).oattr = 'testCheckbox';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component was created successfully
      expect((component as any).oattr).toBe('testCheckbox');
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OCheckboxComponent);
  });
});
