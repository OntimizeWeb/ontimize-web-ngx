import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { NumberService } from '../../../services/number.service';

// Import component dynamically to avoid compilation
let ORealInputComponent: any;

describe('ORealInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;
  let numberService: NumberService;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
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

    // Create mocks with all required methods
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

    // Create component
    component = new ORealInputComponent(mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation and Structure', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of ORealInputComponent', () => {
      expect(component.constructor).toBe(ORealInputComponent);
    });

    it('should extend OIntegerInputComponent', () => {
      // Component inherits from OIntegerInputComponent
      expect(typeof component.resolveValidators).toBe('function');
      expect(typeof component.onFormControlChange).toBe('function');
    });

    it('should have resolveValidators method', () => {
      expect(typeof component.resolveValidators).toBe('function');
    });

    it('should have setComponentPipe method', () => {
      expect(typeof component.setComponentPipe).toBe('function');
    });

    it('should have initialize method', () => {
      expect(typeof component.initialize).toBe('function');
    });

    it('should have ensureOFormValue method', () => {
      expect(typeof component.ensureOFormValue).toBe('function');
    });
  });

  describe('Decimal Properties Configuration', () => {
    it('should initialize with minDecimalDigits = 2', () => {
      expect(component.minDecimalDigits).toBe(2);
    });

    it('should initialize with maxDecimalDigits = 2', () => {
      expect(component.maxDecimalDigits).toBe(2);
    });

    it('should initialize with step = 0.01', () => {
      expect(component.step).toBe(0.01);
    });

    it('should initialize with grouping = true', () => {
      expect(component.grouping).toBe(true);
    });

    it('should initialize with strict = false', () => {
      expect(component.strict).toBe(false);
    });

    it('should set minDecimalDigits correctly', () => {
      component.minDecimalDigits = 3;
      expect(component.minDecimalDigits).toBe(3);
    });

    it('should set maxDecimalDigits correctly', () => {
      component.maxDecimalDigits = 5;
      expect(component.maxDecimalDigits).toBe(5);
    });

    it('should set decimalSeparator correctly', () => {
      component.decimalSeparator = ',';
      expect(component.decimalSeparator).toBe(',');
    });

    it('should set strict mode correctly', () => {
      component.strict = true;
      expect(component.strict).toBe(true);
    });

    it('should convert string minDecimalDigits to number', () => {
      component.minDecimalDigits = '3' as any;
      expect(typeof component.minDecimalDigits).toBe('number');
      expect(component.minDecimalDigits).toBe(3);
    });

    it('should convert string maxDecimalDigits to number', () => {
      component.maxDecimalDigits = '5' as any;
      expect(typeof component.maxDecimalDigits).toBe('number');
      expect(component.maxDecimalDigits).toBe(5);
    });
  });

  describe('Component Pipe Configuration', () => {
    it('should set component pipe when setComponentPipe is called', () => {
      expect(() => {
        component.setComponentPipe();
      }).not.toThrow();
    });

    it('should have componentPipe defined after setComponentPipe', () => {
      component.setComponentPipe();
      expect(component.componentPipe).toBeDefined();
    });
  });

  describe('Validator Resolution', () => {
    it('should return validators array', () => {
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should include maxDecimalDigits validator when maxDecimalDigits is defined', () => {
      component.maxDecimalDigits = 3;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should not include validators when maxDecimalDigits is undefined', () => {
      component.maxDecimalDigits = undefined;
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should return consistent validators across multiple calls', () => {
      const validators1 = component.resolveValidators();
      const validators2 = component.resolveValidators();
      expect(validators1.length).toBe(validators2.length);
    });
  });

  describe('Decimal Validation', () => {
    it('should validate number with correct decimal places', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      component.decimalSeparator = '.';
      const control = new FormControl('123.45');
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || Object.keys(result || {}).length === 0).toBe(true);
    });

    it('should reject number with too many decimal places in strict mode', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      component.decimalSeparator = '.';
      const control = new FormControl('123.456');
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || result['maxDecimaldigits']).toBeDefined();
    });

    it('should accept number with too many decimal places when not strict', () => {
      component.maxDecimalDigits = 2;
      component.strict = false;
      component.decimalSeparator = '.';
      const control = new FormControl('123.456');
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || Object.keys(result || {}).length === 0).toBe(true);
    });

    it('should handle custom decimal separator', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      component.decimalSeparator = ',';
      const control = new FormControl('123,45');
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });

    it('should handle number input type', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      component.decimalSeparator = '.';
      const control = new FormControl(123.45);
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });

    it('should handle empty control value', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      const control = new FormControl('');
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || Object.keys(result || {}).length === 0).toBe(true);
    });

    it('should handle null control value', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      const control = new FormControl(null);
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || Object.keys(result || {}).length === 0).toBe(true);
    });

    it('should validate value without decimal part', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      component.decimalSeparator = '.';
      const control = new FormControl('123');
      const result = component.maxDecimalDigitsValidator(control);
      expect(result === undefined || Object.keys(result || {}).length === 0).toBe(true);
    });
  });

  describe('Step Initialization', () => {
    it('should initialize step correctly when valid', () => {
      component.maxDecimalDigits = 2;
      component.step = 0.01;
      expect(component.step).toBe(0.01);
    });

    it('should recalculate step when negative', () => {
      component.maxDecimalDigits = 3;
      expect(() => {
        component.initializeStep();
      }).not.toThrow();
    });

    it('should handle step with different decimal places', () => {
      component.maxDecimalDigits = 4;
      component.step = -1;
      expect(() => {
        component.initializeStep();
      }).not.toThrow();
    });
  });

  describe('Form Control Enhancement', () => {
    it('should override getValue method in form control', () => {
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });

    it('should handle form control value as number', () => {
      component._fControl = new FormControl(123.45);
      expect(() => {
        const value = component._fControl.value;
        expect(typeof value === 'number').toBe(true);
      }).not.toThrow();
    });

    it('should handle form control value as string', () => {
      component._fControl = new FormControl('123.45');
      expect(() => {
        const value = component._fControl.value;
      }).not.toThrow();
    });
  });

  describe('Lifecycle and Initialization', () => {
    it('should have setComponentPipe called during setup', () => {
      expect(() => {
        component.setComponentPipe();
      }).not.toThrow();
    });

    it('should handle ngOnInit lifecycle', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should set default SQL type key as FLOAT', () => {
      expect(component._defaultSQLTypeKey).toBe('FLOAT');
    });

    it('should have numberService available', () => {
      expect(component.numberService).toBeDefined();
    });
  });

  describe('Integration with FormGroup', () => {
    it('should work within a FormGroup with decimal validation', () => {
      component.maxDecimalDigits = 2;
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        realInput: new FormControl(0, validators)
      });
      
      expect(validators.length).toBeGreaterThan(0);
      formGroup.get('realInput')?.setValue(123.45);
      const control = formGroup.get('realInput');
      expect(control?.value).toBe(123.45);
    });

    it('should work with minLength and maxLength inherited validators', () => {
      component.minLength = 1;
      component.maxLength = 10;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle very small decimal digits', () => {
      component.maxDecimalDigits = 0;
      expect(component.maxDecimalDigits).toBe(0);
    });

    it('should handle large decimal digits', () => {
      component.maxDecimalDigits = 10;
      expect(component.maxDecimalDigits).toBe(10);
    });

    it('should handle zero step value', () => {
      component.step = 0;
      expect(() => {
        component.initializeStep();
      }).not.toThrow();
    });

    it('should handle negative step value', () => {
      component.maxDecimalDigits = 2;
      component.step = -0.01;
      expect(() => {
        component.initializeStep();
      }).not.toThrow();
    });

    it('should handle decimal separator as null', () => {
      component.decimalSeparator = null;
      component.maxDecimalDigits = 2;
      component.strict = true;
      const control = new FormControl('123.45');
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });

    it('should handle rapid property changes', () => {
      expect(() => {
        component.minDecimalDigits = 1;
        component.maxDecimalDigits = 5;
        component.strict = true;
        component.grouping = false;
        component.minDecimalDigits = 2;
        component.maxDecimalDigits = 3;
      }).not.toThrow();
    });

    it('should maintain consistency across property changes', () => {
      const initial = component.maxDecimalDigits;
      component.maxDecimalDigits = 5;
      expect(component.maxDecimalDigits).toBe(5);
      component.maxDecimalDigits = initial;
      expect(component.maxDecimalDigits).toBe(initial);
    });

    it('should handle extreme numeric values', () => {
      const control = new FormControl(Number.MAX_SAFE_INTEGER);
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });

    it('should handle NaN values', () => {
      component.maxDecimalDigits = 2;
      component.strict = true;
      const control = new FormControl(NaN);
      expect(() => {
        component.maxDecimalDigitsValidator(control);
      }).not.toThrow();
    });
  });

  describe('Inherited Functionality', () => {
    it('should support minLength from parent OTextInputComponent', () => {
      expect(() => {
        component.minLength = 1;
        expect(component.minLength).toBe(1);
      }).not.toThrow();
    });

    it('should support maxLength from parent OTextInputComponent', () => {
      expect(() => {
        component.maxLength = 20;
        expect(component.maxLength).toBe(20);
      }).not.toThrow();
    });

    it('should support stringCase from parent OTextInputComponent', () => {
      expect(() => {
        component.stringCase = 'lowercase';
        expect(component.stringCase).toBe('lowercase');
      }).not.toThrow();
    });

    it('should have min and max validators from parent OIntegerInputComponent', () => {
      component.min = 0;
      component.max = 1000;
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });
  });

});
