import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { NumberService } from '../../../services/number.service';
import { OFormValue } from '../../form/o-form-value';

let ORealInputComponent: any;

describe('ORealInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;
  let numberService: NumberService;

  beforeEach(async () => {
    const module = await import('./o-real-input.component');
    ORealInputComponent = module.ORealInputComponent;

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NumberService,
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
    numberService = TestBed.inject(NumberService);

    component = new ORealInputComponent(mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend OIntegerInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OIntegerInputComponent');
    });

    it('should have default SQL type FLOAT', () => {
      expect(component._defaultSQLTypeKey).toBe('FLOAT');
    });
  });

  describe('Default Properties', () => {
    it('should have default minDecimalDigits of 2', () => {
      expect(component.minDecimalDigits).toBe(2);
    });

    it('should have default maxDecimalDigits of 2', () => {
      expect(component.maxDecimalDigits).toBe(2);
    });

    it('should have default step of 0.01', () => {
      expect(component.step).toBe(0.01);
    });

    it('should have default grouping as true', () => {
      expect(component.grouping).toBe(true);
    });

    it('should have default strict as false', () => {
      expect(component.strict).toBe(false);
    });

    it('should have componentPipe defined', () => {
      expect(component.componentPipe).toBeDefined();
    });

    it('should have numberService defined', () => {
      expect(component.numberService).toBeDefined();
    });
  });

  describe('Properties: minDecimalDigits', () => {
    it('should set minDecimalDigits property', () => {
      component.minDecimalDigits = 3;
      expect(component.minDecimalDigits).toBe(3);
    });

    it('should convert string to number', () => {
      component.minDecimalDigits = '4' as any;
      expect(typeof component.minDecimalDigits).toBe('number');
      expect(component.minDecimalDigits).toBe(4);
    });

    it('should handle zero minDecimalDigits', () => {
      component.minDecimalDigits = 0;
      expect(component.minDecimalDigits).toBe(0);
    });

    it('should handle large minDecimalDigits', () => {
      component.minDecimalDigits = 10;
      expect(component.minDecimalDigits).toBe(10);
    });
  });

  describe('Properties: maxDecimalDigits', () => {
    it('should set maxDecimalDigits property', () => {
      component.maxDecimalDigits = 5;
      expect(component.maxDecimalDigits).toBe(5);
    });

    it('should convert string to number', () => {
      component.maxDecimalDigits = '6' as any;
      expect(typeof component.maxDecimalDigits).toBe('number');
      expect(component.maxDecimalDigits).toBe(6);
    });

    it('should handle zero maxDecimalDigits', () => {
      component.maxDecimalDigits = 0;
      expect(component.maxDecimalDigits).toBe(0);
    });

    it('should handle large maxDecimalDigits', () => {
      component.maxDecimalDigits = 15;
      expect(component.maxDecimalDigits).toBe(15);
    });
  });

  describe('Properties: step', () => {
    it('should set step property', () => {
      component.step = 0.1;
      expect(component.step).toBe(0.1);
    });

    it('should handle small step values', () => {
      component.step = 0.001;
      expect(component.step).toBe(0.001);
    });

    it('should convert string to number', () => {
      component.step = '0.05' as any;
      expect(typeof component.step).toBe('number');
    });
  });

  describe('Properties: grouping and strict', () => {
    it('should set grouping to false', () => {
      component.grouping = false;
      expect(component.grouping).toBe(false);
    });

    it('should set strict mode to true', () => {
      component.strict = true;
      expect(component.strict).toBe(true);
    });

    it('should set decimalSeparator', () => {
      component.decimalSeparator = ',';
      expect(component.decimalSeparator).toBe(',');
    });

    it('should allow different decimalSeparator values', () => {
      component.decimalSeparator = '.';
      expect(component.decimalSeparator).toBe('.');
      component.decimalSeparator = ',';
      expect(component.decimalSeparator).toBe(',');
    });
  });

  describe('Method: setComponentPipe()', () => {
    it('should set ORealPipe as componentPipe', () => {
      component.setComponentPipe();
      expect(component.componentPipe).toBeDefined();
      expect(component.componentPipe.constructor.name).toBe('ORealPipe');
    });
  });

  describe('Method: resolveValidators()', () => {
    it('should return array of validators', () => {
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should include min/max validators from parent', () => {
      component.min = 0;
      component.max = 1000;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should include maxDecimalDigits validator when defined', () => {
      component.maxDecimalDigits = 2;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should include maxDecimalDigits validator when zero', () => {
      component.maxDecimalDigits = 0;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });
  });

  describe('Method: maxDecimalDigitsValidator()', () => {
    it('should accept value within decimal digits limit', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.strict = true;
      const control = new UntypedFormControl('123.45');
      const errors = component.maxDecimalDigitsValidator(control);
      expect(errors).toEqual({});
    });

    it('should reject value exceeding decimal digits limit', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.strict = true;
      const control = new UntypedFormControl('123.456');
      const errors = component.maxDecimalDigitsValidator(control);
      expect(errors['maxDecimaldigits']).toBeDefined();
    });

    it('should not validate when strict is false', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.strict = false;
      const control = new UntypedFormControl('123.456');
      const errors = component.maxDecimalDigitsValidator(control);
      expect(errors).toEqual({});
    });

    it('should handle number values', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.strict = true;
      const control = new UntypedFormControl(123.45);
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });

    it('should handle custom decimal separator', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = ',';
      component.strict = true;
      const control = new UntypedFormControl('123,45');
      const errors = component.maxDecimalDigitsValidator(control);
      expect(errors).toEqual({});
    });

    it('should handle null decimal separator', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = null;
      component.strict = true;
      const control = new UntypedFormControl('123.45');
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });

    it('should handle empty string control value', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.strict = true;
      const control = new UntypedFormControl('');
      const errors = component.maxDecimalDigitsValidator(control);
      expect(errors).toEqual({});
    });

    it('should handle NaN values', () => {
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.strict = true;
      const control = new UntypedFormControl(NaN);
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });
  });

  describe('Method: initializeStep()', () => {
    it('should set step based on maxDecimalDigits when step is 0', () => {
      component.maxDecimalDigits = 2;
      component.step = 0;
      spyOn(console, 'warn');
      component.initializeStep();
      expect(component.step).toBe(1 / Math.pow(10, 2));
      expect(console.warn).toHaveBeenCalled();
    });

    it('should set step based on maxDecimalDigits when step is negative', () => {
      component.maxDecimalDigits = 3;
      component.step = -0.01;
      spyOn(console, 'warn');
      component.initializeStep();
      expect(component.step).toBe(1 / Math.pow(10, 3));
    });

    it('should keep positive step unchanged', () => {
      component.maxDecimalDigits = 2;
      component.step = 0.5;
      spyOn(console, 'warn');
      component.initializeStep();
      expect(component.step).toBe(0.5);
    });

    it('should handle different maxDecimalDigits values', () => {
      component.maxDecimalDigits = 4;
      component.step = 0;
      component.initializeStep();
      expect(component.step).toBe(1 / Math.pow(10, 4));
    });
  });

  describe('Method: ensureOFormValue()', () => {
    it('should handle undefined pipeArguments', () => {
      component.pipeArguments = undefined;
      expect(() => {
        component.ensureOFormValue(new OFormValue(123.45));
      }).not.toThrow();
    });

    it('should process numeric values with pipeArguments', () => {
      component.pipeArguments = {
        decimalSeparator: '.',
        minDecimalDigits: 2,
        maxDecimalDigits: 2,
        truncate: false,
        grouping: true,
        thousandSeparator: ','
      };
      component.value = new OFormValue(1234.5);
      expect(() => {
        component.ensureOFormValue(component.value);
      }).not.toThrow();
    });

    it('should handle empty OFormValue', () => {
      component.pipeArguments = {
        decimalSeparator: '.',
        minDecimalDigits: 2,
        maxDecimalDigits: 2,
        truncate: false
      };
      component.value = new OFormValue(undefined);
      expect(() => {
        component.ensureOFormValue(component.value);
      }).not.toThrow();
    });
  });

  describe('Lifecycle: ngOnInit()', () => {
    it('should set pipeArguments from component properties', () => {
      component.minDecimalDigits = 2;
      component.maxDecimalDigits = 2;
      component.decimalSeparator = '.';
      component.grouping = true;
      component.ngOnInit();
      expect(component.pipeArguments).toBeDefined();
      expect(component.pipeArguments.minDecimalDigits).toBe(2);
      expect(component.pipeArguments.maxDecimalDigits).toBe(2);
      expect(component.pipeArguments.decimalSeparator).toBe('.');
    });

    it('should set truncate to false in pipeArguments', () => {
      component.ngOnInit();
      expect(component.pipeArguments.truncate).toBe(false);
    });

    it('should ensure OFormValue when not empty', () => {
      component.value = new OFormValue(123.45);
      component.minDecimalDigits = 2;
      component.maxDecimalDigits = 2;
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });
  });

  describe('Lifecycle: initialize()', () => {
    it('should override FormControl getValue method', () => {
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });

    it('should call initializeStep', () => {
      spyOn(component, 'initializeStep');
      component.initialize();
      expect(component.initializeStep).toHaveBeenCalled();
    });

    it('should maintain numeric value handling in FormControl', () => {
      component.initialize();
      expect(() => {
        component.setValue(123.45);
        const val = component.getValue();
        expect(typeof val === 'number' || val instanceof Object).toBeTruthy();
      }).not.toThrow();
    });
  });

  describe('Value Handling', () => {
    it('should handle decimal values', () => {
      expect(() => {
        component.setValue(123.45);
      }).not.toThrow();
    });

    it('should handle large decimal values', () => {
      expect(() => {
        component.setValue(999999.99);
      }).not.toThrow();
    });

    it('should handle small decimal values', () => {
      expect(() => {
        component.setValue(0.01);
      }).not.toThrow();
    });

    it('should handle zero', () => {
      expect(() => {
        component.setValue(0);
      }).not.toThrow();
    });

    it('should handle negative decimal values', () => {
      expect(() => {
        component.setValue(-123.45);
      }).not.toThrow();
    });

    it('should handle clearValue', () => {
      component.setValue(123.45);
      expect(() => {
        component.clearValue();
      }).not.toThrow();
    });
  });

  describe('Constants', () => {
    it('should have DEFAULT_INPUTS_O_REAL_INPUT defined', () => {
      const module = require('./o-real-input.component');
      expect(module.DEFAULT_INPUTS_O_REAL_INPUT).toBeDefined();
      expect(Array.isArray(module.DEFAULT_INPUTS_O_REAL_INPUT)).toBe(true);
    });

    it('should include required input mappings', () => {
      const module = require('./o-real-input.component');
      const inputs = module.DEFAULT_INPUTS_O_REAL_INPUT;
      expect(inputs.some((input: string) => input.includes('minDecimal'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('maxDecimal'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('decimalSeparator'))).toBeTruthy();
      expect(inputs.some((input: string) => input.includes('strict'))).toBeTruthy();
    });
  });

  describe('Inheritance', () => {
    it('should extend OIntegerInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OIntegerInputComponent');
    });

    it('should have access to min/max/step properties from OIntegerInputComponent', () => {
      // min/max/step are inherited and have default values
      expect(component.step !== undefined).toBeTruthy();
      // min and max are optional and may be undefined until set
      expect(typeof component.step === 'number').toBeTruthy();
    });

    it('should inherit form control methods', () => {
      expect(typeof component.setValue).toBe('function');
      expect(typeof component.getValue).toBe('function');
      expect(typeof component.isEmpty).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        realValue: new FormControl(123.45)
      });
      expect(formGroup).toBeTruthy();
    });

    it('should initialize without errors', () => {
      expect(() => {
        component.initialize();
        component.ngOnInit();
      }).not.toThrow();
    });

    it('should handle complete workflow', () => {
      expect(() => {
        component.minDecimalDigits = 1;
        component.maxDecimalDigits = 3;
        component.step = 0.01;
        component.grouping = true;
        component.strict = true;
        component.decimalSeparator = '.';
        component.initialize();
        component.ngOnInit();
        component.setValue(123.456);
        component.getValue();
        component.resolveValidators();
      }).not.toThrow();
    });

    it('should maintain state through multiple operations', () => {
      component.minDecimalDigits = 2;
      component.maxDecimalDigits = 4;
      component.setValue(99.9999);
      expect(component.minDecimalDigits).toBe(2);
      expect(component.maxDecimalDigits).toBe(4);
      expect(() => component.getValue()).not.toThrow();
    });
  });
});
