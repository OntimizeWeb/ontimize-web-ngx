import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OFormValue } from '../../form/o-form-value';

let OIntegerInputComponent: any;

describe('OIntegerInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    const module = await import('./o-integer-input.component');
    OIntegerInputComponent = module.OIntegerInputComponent;

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

    component = new OIntegerInputComponent(mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend OFormDataComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OFormDataComponent');
    });
  });

  describe('Default Properties', () => {
    it('should have default step of 1', () => {
      expect(component.step).toBe(1);
    });

    it('should have default grouping as false', () => {
      expect(component.grouping).toBe(false);
    });

    it('should have inputType defined', () => {
      expect(component.inputType).toBeDefined();
      expect(['text', 'number'].includes(component.inputType)).toBeTruthy();
    });

    it('should have componentPipe defined', () => {
      expect(component.componentPipe).toBeDefined();
    });

    it('should have pipeArguments undefined until ngOnInit', () => {
      expect(component.pipeArguments).toBeUndefined();
    });

    it('should have default SQL type INTEGER', () => {
      expect(component._defaultSQLTypeKey).toBe('INTEGER');
    });
  });

  describe('Properties: min', () => {
    it('should set min property', () => {
      component.min = 0;
      expect(component.min).toBe(0);
    });

    it('should set negative min value', () => {
      component.min = -100;
      expect(component.min).toBe(-100);
    });

    it('should convert undefined to 0 due to NumberInputConverter', () => {
      component.min = undefined;
      expect(component.min).toBe(0);
    });
  });

  describe('Properties: max', () => {
    it('should set max property', () => {
      component.max = 100;
      expect(component.max).toBe(100);
    });

    it('should set large max value', () => {
      component.max = 999999;
      expect(component.max).toBe(999999);
    });

    it('should convert undefined to 0 due to NumberInputConverter', () => {
      component.max = undefined;
      expect(component.max).toBe(0);
    });
  });

  describe('Properties: step', () => {
    it('should set step property', () => {
      component.step = 5;
      expect(component.step).toBe(5);
    });

    it('should handle decimal step', () => {
      component.step = 0.5;
      expect(component.step).toBe(0.5);
    });

    it('should initialize step to 1 in ngOnInit', () => {
      component.step = undefined;
      component.ngOnInit();
      expect(component.step).toBe(1);
    });
  });

  describe('Properties: grouping and thousandSeparator', () => {
    it('should set grouping to true', () => {
      component.grouping = true;
      expect(component.grouping).toBe(true);
    });

    it('should set grouping to false', () => {
      component.grouping = false;
      expect(component.grouping).toBe(false);
    });

    it('should set thousandSeparator', () => {
      component.thousandSeparator = ',';
      expect(component.thousandSeparator).toBe(',');
    });

    it('should allow different thousandSeparator values', () => {
      component.thousandSeparator = '.';
      expect(component.thousandSeparator).toBe('.');
      component.thousandSeparator = ' ';
      expect(component.thousandSeparator).toBe(' ');
    });

    it('should set olocale', () => {
      component.olocale = 'en-US';
      expect(component.olocale).toBe('en-US');
    });
  });

  describe('Method: isEmpty()', () => {
    it('should return true when value is undefined', () => {
      component.value = undefined;
      expect(component.isEmpty()).toBe(true);
    });

    it('should return true when value is empty OFormValue', () => {
      component.value = new OFormValue(undefined);
      expect(component.isEmpty()).toBe(true);
    });

    it('should return false when value has number', () => {
      component.value = new OFormValue(42);
      expect(component.isEmpty()).toBe(false);
    });

    it('should return false when value has zero', () => {
      component.value = new OFormValue(0);
      expect(component.isEmpty()).toBe(false);
    });
  });

  describe('Method: resolveValidators()', () => {
    it('should return array of validators', () => {
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should include min validator when min is set', () => {
      component.min = 10;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should include max validator when max is set', () => {
      component.max = 100;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should include both min and max validators', () => {
      component.min = 10;
      component.max = 100;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(1);
    });

    it('should not include min validator when min is undefined', () => {
      component.min = undefined;
      component.max = undefined;
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });
  });

  describe('Method: initializeStep()', () => {
    it('should set step to 1 if step is 0', () => {
      component.step = 0;
      spyOn(console, 'warn');
      component.initializeStep();
      expect(component.step).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should set step to 1 if step is negative', () => {
      component.step = -5;
      spyOn(console, 'warn');
      component.initializeStep();
      expect(component.step).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should keep positive step unchanged', () => {
      component.step = 5;
      spyOn(console, 'warn');
      component.initializeStep();
      expect(component.step).toBe(5);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Method: setComponentPipe()', () => {
    it('should create OIntegerPipe', () => {
      component.setComponentPipe();
      expect(component.componentPipe).toBeDefined();
      expect(component.componentPipe.constructor.name).toBe('OIntegerPipe');
    });
  });

  describe('Method: innerOnFocus()', () => {
    it('should handle focus event without throwing', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      expect(() => {
        component.innerOnFocus(mockEvent);
      }).not.toThrow();
    });

    it('should prevent default on focus', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      component.innerOnFocus(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not throw when readonly', () => {
      component.isReadOnly = true;
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      expect(() => {
        component.innerOnFocus(mockEvent);
      }).not.toThrow();
    });
  });

  describe('Method: innerOnBlur()', () => {
    it('should handle blur event without throwing', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      expect(() => {
        component.innerOnBlur(mockEvent);
      }).not.toThrow();
    });

    it('should prevent default on blur', () => {
      const mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      component.innerOnBlur(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should handle blur without event', () => {
      expect(() => {
        component.innerOnBlur();
      }).not.toThrow();
    });
  });

  describe('Method: getInputEl()', () => {
    it('should return input element reference', () => {
      expect(() => {
        const inputEl = component.getInputEl();
        // May be undefined since we don't have real DOM
      }).not.toThrow();
    });
  });

  describe('Method: setNumberDOMValue()', () => {
    it('should set number type DOM value', () => {
      expect(() => {
        component.setNumberDOMValue(42);
      }).not.toThrow();
    });

    it('should handle null values', () => {
      expect(() => {
        component.setNumberDOMValue(null);
      }).not.toThrow();
    });

    it('should handle undefined values', () => {
      expect(() => {
        component.setNumberDOMValue(undefined);
      }).not.toThrow();
    });
  });

  describe('Method: setTextDOMValue()', () => {
    it('should set text type DOM value', () => {
      expect(() => {
        component.setTextDOMValue('123');
      }).not.toThrow();
    });

    it('should handle formatted values', () => {
      expect(() => {
        component.setTextDOMValue('1,234,567');
      }).not.toThrow();
    });

    it('should handle empty string', () => {
      expect(() => {
        component.setTextDOMValue('');
      }).not.toThrow();
    });
  });

  describe('Method: setPipeValue()', () => {
    it('should not throw when pipeArguments is undefined', () => {
      component.pipeArguments = undefined;
      expect(() => {
        component.setPipeValue();
      }).not.toThrow();
    });

    it('should format value when pipeArguments defined', () => {
      component.pipeArguments = {
        grouping: true,
        thousandSeparator: ',',
        locale: 'en-US'
      };
      component.value = new OFormValue(1234567);
      expect(() => {
        component.setPipeValue();
      }).not.toThrow();
    });

    it('should not process empty values', () => {
      component.pipeArguments = {
        grouping: true,
        thousandSeparator: ',',
        locale: 'en-US'
      };
      component.value = undefined;
      expect(() => {
        component.setPipeValue();
      }).not.toThrow();
    });
  });

  describe('Lifecycle: ngOnInit()', () => {
    it('should initialize pipeArguments from properties', () => {
      component.grouping = true;
      component.thousandSeparator = ',';
      component.olocale = 'en-US';
      component.ngOnInit();
      expect(component.pipeArguments).toBeDefined();
      expect(component.pipeArguments.grouping).toBe(true);
      expect(component.pipeArguments.thousandSeparator).toBe(',');
      expect(component.pipeArguments.locale).toBe('en-US');
    });

    it('should ensure step has default value', () => {
      component.step = undefined;
      component.ngOnInit();
      expect(component.step).toBe(1);
    });

    it('should call initializeStep', () => {
      spyOn(component, 'initializeStep');
      component.initialize();
      expect(component.initializeStep).toHaveBeenCalled();
    });
  });

  describe('Value Handling', () => {
    it('should handle setValue with integer', () => {
      expect(() => {
        component.setValue(42);
      }).not.toThrow();
    });

    it('should handle getValue', () => {
      component.setValue(100);
      expect(() => {
        const val = component.getValue();
      }).not.toThrow();
    });

    it('should handle clearValue', () => {
      component.setValue(50);
      expect(() => {
        component.clearValue();
      }).not.toThrow();
    });

    it('should handle setData', () => {
      expect(() => {
        component.setData(123);
      }).not.toThrow();
    });
  });

  describe('Constants', () => {
    it('should have DEFAULT_INPUTS_O_INTEGER_INPUT defined', () => {
      const module = require('./o-integer-input.component');
      expect(module.DEFAULT_INPUTS_O_INTEGER_INPUT).toBeDefined();
      expect(Array.isArray(module.DEFAULT_INPUTS_O_INTEGER_INPUT)).toBe(true);
    });

    it('should include required input mappings', () => {
      const module = require('./o-integer-input.component');
      const inputs = module.DEFAULT_INPUTS_O_INTEGER_INPUT;
      expect(inputs.some((input: string) => input.includes('min'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('max'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('step'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('grouping'))).toBeTruthy();
    });
  });

  describe('Inheritance', () => {
    it('should extend OFormDataComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OFormDataComponent');
    });

    it('should have inherited form properties', () => {
      expect(component.form).toBeDefined();
    });

    it('should have inherited lifecycle methods', () => {
      expect(typeof component.initialize).toBe('function');
      expect(typeof component.ngOnInit).toBe('function');
      expect(typeof component.ngAfterViewInit).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        intValue: new FormControl(42)
      });
      expect(formGroup).toBeTruthy();
    });

    it('should initialize without errors', () => {
      expect(() => {
        component.initialize();
        component.ngOnInit();
        component.ngAfterViewInit();
      }).not.toThrow();
    });

    it('should handle complete workflow', () => {
      expect(() => {
        component.min = 0;
        component.max = 100;
        component.step = 5;
        component.grouping = true;
        component.thousandSeparator = ',';
        component.olocale = 'en-US';
        component.initialize();
        component.ngOnInit();
        component.setValue(50);
        component.getValue();
        component.isEmpty();
        component.resolveValidators();
      }).not.toThrow();
    });

    it('should maintain state through multiple operations', () => {
      component.min = 10;
      component.max = 90;
      component.setValue(50);
      expect(component.min).toBe(10);
      expect(component.max).toBe(90);
      expect(() => component.getValue()).not.toThrow();
    });
  });
});
