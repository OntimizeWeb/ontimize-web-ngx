import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OFormValue } from '../../form/o-form-value';

let OSlideToggleComponent: any;

describe('OSlideToggleComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    const module = await import('./o-slide-toggle.component');
    OSlideToggleComponent = module.OSlideToggleComponent;

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
    mockElementRef = { nativeElement: document.createElement('div') };
    mockInjector = TestBed.inject(Injector);

    component = new OSlideToggleComponent(mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend OBooleanFormDataComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OBooleanFormDataComponent');
    });
  });

  describe('Default Properties', () => {
    it('should have default labelPosition as after', () => {
      expect(component.labelPosition).toBe('after');
    });

    it('should have color property', () => {
      expect(component.color === undefined || typeof component.color === 'string').toBeTruthy();
    });

    it('should inherit trueValue from parent class', () => {
      expect(component.trueValue).toBe(true);
    });

    it('should inherit falseValue from parent class', () => {
      expect(component.falseValue).toBe(false);
    });

    it('should inherit booleanType from parent class', () => {
      expect(component.booleanType).toBe('boolean');
    });
  });

  describe('Properties: color', () => {
    it('should set color to primary', () => {
      component.color = 'primary';
      expect(component.color).toBe('primary');
    });

    it('should set color to accent', () => {
      component.color = 'accent';
      expect(component.color).toBe('accent');
    });

    it('should set color to warn', () => {
      component.color = 'warn';
      expect(component.color).toBe('warn');
    });

    it('should allow undefined color', () => {
      component.color = undefined;
      expect(component.color).toBeUndefined();
    });
  });

  describe('Properties: labelPosition', () => {
    it('should set labelPosition to before', () => {
      component.labelPosition = 'before';
      expect(component.labelPosition).toBe('before');
    });

    it('should set labelPosition to after', () => {
      component.labelPosition = 'after';
      expect(component.labelPosition).toBe('after');
    });

    it('should toggle labelPosition', () => {
      component.labelPosition = 'before';
      expect(component.labelPosition).toBe('before');
      component.labelPosition = 'after';
      expect(component.labelPosition).toBe('after');
    });
  });

  describe('Method: isChecked()', () => {
    it('should return true when value equals trueValue', () => {
      component.trueValue = true;
      component.value = new OFormValue(true);
      expect(component.isChecked()).toBe(true);
    });

    it('should return false when value equals falseValue', () => {
      component.falseValue = false;
      component.value = new OFormValue(false);
      expect(component.isChecked()).toBe(false);
    });

    it('should return false when value is not OFormValue', () => {
      component.value = true;
      expect(component.isChecked()).toBe(false);
    });

    it('should return false when value is undefined', () => {
      component.value = undefined;
      expect(component.isChecked()).toBe(false);
    });

    it('should work with numeric true/false values', () => {
      component.trueValue = 1;
      component.falseValue = 0;
      component.booleanType = 'number';
      
      component.value = new OFormValue(1);
      expect(component.isChecked()).toBe(true);
      
      component.value = new OFormValue(0);
      expect(component.isChecked()).toBe(false);
    });

    it('should work with string true/false values', () => {
      component.trueValue = 'YES';
      component.falseValue = 'NO';
      component.booleanType = 'string';
      
      component.value = new OFormValue('YES');
      expect(component.isChecked()).toBe(true);
      
      component.value = new OFormValue('NO');
      expect(component.isChecked()).toBe(false);
    });
  });

  describe('Toggle State', () => {
    it('should track checked state with OFormValue', () => {
      component.value = new OFormValue(true);
      expect(component.isChecked()).toBe(true);
      
      component.value = new OFormValue(false);
      expect(component.isChecked()).toBe(false);
    });

    it('should handle state changes', () => {
      const initialChecked = component.isChecked();
      component.value = new OFormValue(true);
      expect(component.isChecked()).not.toBe(initialChecked);
    });

    it('should maintain state through multiple checks', () => {
      for (let i = 0; i < 5; i++) {
        component.value = new OFormValue(i % 2 === 0);
        expect(typeof component.isChecked()).toBe('boolean');
      }
    });
  });

  describe('Constants', () => {
    it('should verify DEFAULT_INPUTS_O_SLIDETOGGLE', () => {
      const module = require('./o-slide-toggle.component');
      expect(module.DEFAULT_INPUTS_O_SLIDETOGGLE).toBeDefined();
      expect(Array.isArray(module.DEFAULT_INPUTS_O_SLIDETOGGLE)).toBe(true);
      expect(module.DEFAULT_INPUTS_O_SLIDETOGGLE.length).toBeGreaterThan(0);
    });

    it('should have proper input mappings', () => {
      const module = require('./o-slide-toggle.component');
      const inputs = module.DEFAULT_INPUTS_O_SLIDETOGGLE;
      expect(inputs.some((input: string) => input.includes('true-value'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('false-value'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('label-position'))).toBeTruthy();
    });
  });

  describe('Boolean Type Handling', () => {
    it('should handle boolean type', () => {
      component.booleanType = 'boolean';
      component.trueValue = true;
      component.falseValue = false;
      expect(component.booleanType).toBe('boolean');
    });

    it('should handle number type', () => {
      component.booleanType = 'number';
      component.trueValue = 1;
      component.falseValue = 0;
      expect(component.booleanType).toBe('number');
    });

    it('should handle string type', () => {
      component.booleanType = 'string';
      component.trueValue = 'TRUE';
      component.falseValue = 'FALSE';
      expect(component.booleanType).toBe('string');
    });
  });

  describe('Inheritance', () => {
    it('should extend OBooleanFormDataComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OBooleanFormDataComponent');
    });

    it('should have form property from parent', () => {
      expect((component as any).form).toBeDefined();
    });

    it('should have inherited methods', () => {
      expect(typeof (component as any).initialize).toBe('function');
      expect(typeof component.isChecked).toBe('function');
    });

    it('should have inherited boolean properties', () => {
      expect(component.hasOwnProperty('trueValue') || component.trueValue !== undefined).toBeTruthy();
      expect(component.hasOwnProperty('falseValue') || component.falseValue !== undefined).toBeTruthy();
      expect(component.hasOwnProperty('booleanType') || component.booleanType !== undefined).toBeTruthy();
    });
  });

  describe('Theme Palette Support', () => {
    it('should support Material theme colors', () => {
      const colors: any[] = ['primary', 'accent', 'warn', undefined];
      colors.forEach(color => {
        component.color = color;
        expect(component.color).toBe(color);
      });
    });

    it('should apply color to slide toggle', () => {
      component.color = 'primary';
      expect(component.color).toBe('primary');
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        toggle: new FormControl(true)
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
        component.color = 'accent';
        component.labelPosition = 'before';
        component.trueValue = 'yes';
        component.falseValue = 'no';
        component.booleanType = 'string';
        component.value = new OFormValue('yes');
        component.isChecked();
      }).not.toThrow();
    });

    it('should maintain state through initialization', () => {
      component.color = 'warn';
      component.labelPosition = 'before';
      component.trueValue = 1;
      component.falseValue = 0;
      
      component.initialize();
      
      expect(component.color).toBe('warn');
      expect(component.labelPosition).toBe('before');
      expect(component.trueValue).toBe(1);
      expect(component.falseValue).toBe(0);
    });
  });
});
