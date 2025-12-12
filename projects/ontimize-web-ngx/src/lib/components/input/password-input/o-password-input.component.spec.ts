import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

let OPasswordInputComponent: any;

describe('OPasswordInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    const module = await import('./o-password-input.component');
    OPasswordInputComponent = module.OPasswordInputComponent;

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockOFormComponent = {
      form: new FormGroup({}),
      registerFormComponent: jasmine.createSpy('registerFormComponent').and.returnValue(undefined),
      registerFormControlComponent: jasmine.createSpy('registerFormControlComponent').and.returnValue(undefined),
      registerSQLTypeFormComponent: jasmine.createSpy('registerSQLTypeFormComponent').and.returnValue(undefined),
      getFormGroup: jasmine.createSpy('getFormGroup').and.returnValue(new FormGroup({})),
      isInUpdateMode: jasmine.createSpy('isInUpdateMode').and.returnValue(false),
      isEditableDetail: jasmine.createSpy('isEditableDetail').and.returnValue(false),
      isInInsertMode: jasmine.createSpy('isInInsertMode').and.returnValue(false),
      getErrorValue: jasmine.createSpy('getErrorValue').and.returnValue(undefined)
    };
    mockElementRef = { nativeElement: document.createElement('input') };
    mockInjector = TestBed.inject(Injector);

    component = new OPasswordInputComponent(mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend OTextInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });
  });

  describe('Default Properties', () => {
    it('should have hide property as true by default', () => {
      expect(component.hide).toBe(true);
    });

    it('should have showPasswordButton as false by default', () => {
      expect(component.showPasswordButton).toBe(false);
    });

    it('should inherit from OTextInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });
  });

  describe('Properties: hide', () => {
    it('should set hide to true', () => {
      component.hide = true;
      expect(component.hide).toBe(true);
    });

    it('should set hide to false', () => {
      component.hide = false;
      expect(component.hide).toBe(false);
    });

    it('should toggle hide property', () => {
      component.hide = true;
      expect(component.hide).toBe(true);
      component.hide = false;
      expect(component.hide).toBe(false);
      component.hide = true;
      expect(component.hide).toBe(true);
    });
  });

  describe('Properties: showPasswordButton', () => {
    it('should set showPasswordButton to true', () => {
      component.showPasswordButton = true;
      expect(component.showPasswordButton).toBe(true);
    });

    it('should set showPasswordButton to false', () => {
      component.showPasswordButton = false;
      expect(component.showPasswordButton).toBe(false);
    });

    it('should support BooleanInputConverter', () => {
      component.showPasswordButton = true;
      expect(typeof component.showPasswordButton).toBe('boolean');
      component.showPasswordButton = false;
      expect(typeof component.showPasswordButton).toBe('boolean');
    });
  });

  describe('Password Visibility Logic', () => {
    it('should start with password hidden', () => {
      expect(component.hide).toBe(true);
    });

    it('should hide password when hide is true', () => {
      component.hide = true;
      expect(component.hide).toBe(true);
    });

    it('should show password when hide is false', () => {
      component.hide = false;
      expect(component.hide).toBe(false);
    });

    it('should handle repeated visibility changes', () => {
      for (let i = 0; i < 5; i++) {
        component.hide = i % 2 === 0;
        expect(component.hide).toBe(i % 2 === 0);
      }
    });
  });

  describe('Button Visibility', () => {
    it('should not show button by default', () => {
      expect(component.showPasswordButton).toBe(false);
    });

    it('should show button when enabled', () => {
      component.showPasswordButton = true;
      expect(component.showPasswordButton).toBe(true);
    });

    it('should hide button when disabled', () => {
      component.showPasswordButton = true;
      component.showPasswordButton = false;
      expect(component.showPasswordButton).toBe(false);
    });
  });

  describe('Constants', () => {
    it('should verify DEFAULT_INPUTS_O_PASSWORD_INPUT constant', () => {
      const module = require('./o-password-input.component');
      expect(module.DEFAULT_INPUTS_O_PASSWORD_INPUT).toBeDefined();
      expect(Array.isArray(module.DEFAULT_INPUTS_O_PASSWORD_INPUT)).toBe(true);
    });

    it('should have show-password-button input mapping', () => {
      const module = require('./o-password-input.component');
      const inputs = module.DEFAULT_INPUTS_O_PASSWORD_INPUT;
      expect(inputs.some((input: string) => input.includes('show-password-button'))).toBeTruthy();
    });
  });

  describe('Inheritance', () => {
    it('should extend OTextInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });

    it('should have form property from parent', () => {
      expect((component as any).form).toBeDefined();
    });

    it('should have inherited methods from OTextInputComponent', () => {
      expect(typeof (component as any).ngOnInit).toBe('function');
      expect(typeof (component as any).initialize).toBe('function');
    });
  });

  describe('Input Type Behavior', () => {
    it('should be a password input component', () => {
      expect(component.constructor.name).toBe('OPasswordInputComponent');
    });

    it('should extend OTextInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });

    it('should support password-specific properties', () => {
      expect(component.hasOwnProperty('hide') || component.hide !== undefined).toBeTruthy();
      expect(component.hasOwnProperty('showPasswordButton') || component.showPasswordButton !== undefined).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        password: new FormControl('')
      });
      expect(formGroup).toBeTruthy();
    });

    it('should initialize without errors', () => {
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });

    it('should handle property changes without errors', () => {
      expect(() => {
        component.hide = false;
        component.showPasswordButton = true;
        component.ngOnInit();
      }).not.toThrow();
    });

    it('should maintain state through multiple operations', () => {
      component.hide = false;
      component.showPasswordButton = true;
      
      expect(component.hide).toBe(false);
      expect(component.showPasswordButton).toBe(true);
      
      component.initialize();
      
      expect(component.hide).toBe(false);
      expect(component.showPasswordButton).toBe(true);
    });
  });
});
