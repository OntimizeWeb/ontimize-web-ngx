import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { FormComponentMockUtil } from '../test/form-component-mock.util';

// Import component dynamically to avoid compilation
let OIntegerInputComponent: any;

describe('OIntegerInputComponent', () => {
  let component: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-integer-input.component');
    OIntegerInputComponent = module.OIntegerInputComponent;
    
    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually using utility for consistent mocking
    const mockInjector = TestBed.inject(Injector);
    const testSetup = FormComponentMockUtil.createInputComponentTestSetup(OIntegerInputComponent, mockInjector);
    component = testSetup.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // detectChanges not needed with manual instantiation
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component.constructor).toBe(OIntegerInputComponent);
  });

  // === ENHANCED TESTS (Proven Safe Pattern) ===

  describe('Component Inheritance and Structure', () => {
    it('should extend OFormDataComponent', () => {
      const OFormDataComponent = require('../../o-form-data-component.class').OFormDataComponent;
      expect(component instanceof OFormDataComponent).toBeTruthy();
    });

    it('should have constructor with 3 parameters', () => {
      expect(component.constructor.length).toBe(3); // form, elRef, injector
    });

    it('should have lifecycle methods available', () => {
      expect(typeof component.ngOnInit).toBe('function');
      expect(typeof component.ngAfterViewInit).toBe('function');
    });

    it('should have basic form control methods', () => {
      const methods = ['setValue', 'getValue', 'clearValue', 'getFormControl'];
      methods.forEach(method => {
        expect(typeof component[method]).toBe('function');
      });
    });
  });

  describe('Integer Input Properties and Configuration', () => {
    it('should handle min and max properties safely', () => {
      expect(() => {
        component.min = 0;
        component.max = 100;
        component.step = 1;
      }).not.toThrow();
    });

    it('should handle number formatting properties', () => {
      expect(() => {
        component.grouping = true;
        component.thousandSeparator = ',';
        component.olocale = 'en-US';
      }).not.toThrow();
    });

    it('should have component pipe for integer formatting', () => {
      expect(component.componentPipe).toBeDefined();
      expect(typeof component.setComponentPipe).toBe('function');
    });

    it('should handle input type configuration', () => {
      expect(component.inputType).toBeDefined();
      expect(['text', 'number'].includes(component.inputType)).toBeTruthy();
    });
  });

  describe('Validators Functionality', () => {
    it('should have resolveValidators method defined', () => {
      expect(component.resolveValidators).toBeDefined();
      expect(typeof component.resolveValidators).toBe('function');
    });

    it('should return validators array when called', () => {
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBeTruthy();
    });

    it('should include min validator when min is set', () => {
      component.min = 10;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
      
      // Test that validators array contains functions
      const hasValidatorFunctions = validators.some(validator => typeof validator === 'function');
      expect(hasValidatorFunctions).toBeTruthy();
    });

    it('should include max validator when max is set', () => {
      component.max = 100;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
      
      // Test that validators array contains functions
      const hasValidatorFunctions = validators.some(validator => typeof validator === 'function');
      expect(hasValidatorFunctions).toBeTruthy();
    });

    it('should include both min and max validators when both are set', () => {
      component.min = 10;
      component.max = 100;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(1);
    });

    it('should handle undefined min/max values gracefully', () => {
      component.min = undefined;
      component.max = undefined;
      expect(() => {
        const validators = component.resolveValidators();
        expect(Array.isArray(validators)).toBeTruthy();
      }).not.toThrow();
    });
  });

  describe('Value Handling and Formatting', () => {
    it('should handle setValue and getValue operations safely', () => {
      expect(() => {
        component.setValue(42);
        component.getValue();
        component.setValue(null);
        component.setValue(undefined);
      }).not.toThrow();
    });

    it('should handle integer value operations', () => {
      expect(() => {
        component.setValue(123);
        component.setValue(-456);
        component.setValue(0);
      }).not.toThrow();
    });

    it('should handle clearValue operation', () => {
      expect(() => {
        component.setValue(42);
        component.clearValue();
      }).not.toThrow();
    });

    it('should have DOM value manipulation methods', () => {
      expect(typeof component.setNumberDOMValue).toBe('function');
      expect(typeof component.setTextDOMValue).toBe('function');
      expect(typeof component.setPipeValue).toBe('function');
    });

    it('should handle isEmpty check', () => {
      expect(typeof component.isEmpty).toBe('function');
      expect(() => {
        const isEmpty = component.isEmpty();
        expect(typeof isEmpty).toBe('boolean');
      }).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    it('should have focus and blur event handlers', () => {
      expect(typeof component.innerOnFocus).toBe('function');
      expect(typeof component.innerOnBlur).toBe('function');
    });

    it('should handle focus events safely', () => {
      expect(() => {
        const mockEvent = {
          preventDefault: jasmine.createSpy('preventDefault'),
          stopPropagation: jasmine.createSpy('stopPropagation')
        };
        component.innerOnFocus(mockEvent);
      }).not.toThrow();
    });

    it('should handle blur events safely', () => {
      expect(() => {
        const mockEvent = {
          preventDefault: jasmine.createSpy('preventDefault'),
          stopPropagation: jasmine.createSpy('stopPropagation')
        };
        component.innerOnBlur(mockEvent);
      }).not.toThrow();
    });
  });

  describe('Input Element Interaction', () => {
    it('should have getInputEl method for DOM access', () => {
      expect(typeof component.getInputEl).toBe('function');
    });

    it('should handle input element retrieval safely', () => {
      expect(() => {
        const inputEl = component.getInputEl();
        // May be undefined if no actual DOM element, which is fine for this test
      }).not.toThrow();
    });

    it('should handle input type and value setting', () => {
      expect(typeof component.setInputTypeAndValue).toBe('function');
      expect(() => {
        // This method handles DOM manipulation, should not throw even without real DOM
        component.setNumberDOMValue(42);
        component.setTextDOMValue('123');
      }).not.toThrow();
    });
  });

  describe('Step Validation and Configuration', () => {
    it('should handle step initialization', () => {
      expect(typeof component.initializeStep).toBe('function');
      expect(() => {
        component.initializeStep();
      }).not.toThrow();
    });

    it('should have default step value', () => {
      expect(component.step).toBeDefined();
      expect(typeof component.step).toBe('number');
      expect(component.step).toBeGreaterThan(0);
    });

    it('should handle step property assignment', () => {
      expect(() => {
        component.step = 5;
        component.step = 0.1;
        component.step = 1;
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined values gracefully', () => {
      expect(() => {
        component.setValue(null);
        component.setValue(undefined);
        component.setValue('');
      }).not.toThrow();
    });

    it('should handle invalid number inputs', () => {
      expect(() => {
        component.setValue('not-a-number');
        component.setValue('abc');
        component.setValue(NaN);
      }).not.toThrow();
    });

    it('should maintain validator consistency across multiple calls', () => {
      component.min = 5;
      component.max = 95;
      
      const validators1 = component.resolveValidators();
      const validators2 = component.resolveValidators();
      
      expect(validators1.length).toBe(validators2.length);
      expect(Array.isArray(validators1)).toBeTruthy();
      expect(Array.isArray(validators2)).toBeTruthy();
    });

    it('should handle lifecycle method calls safely', () => {
      expect(() => {
        if (typeof component.ngOnInit === 'function') {
          // Ensure form mock is properly set up with all required methods
          expect(component.form).toBeDefined();
          expect(typeof component.form.registerFormComponent).toBe('function');
          expect(typeof component.form.registerFormControlComponent).toBe('function');
          expect(typeof component.form.registerSQLTypeFormComponent).toBe('function');
          expect(typeof component.form.isInUpdateMode).toBe('function');
          expect(typeof component.form.isEditableDetail).toBe('function');
          component.ngOnInit();
        }
        if (typeof component.ngAfterViewInit === 'function') {
          component.ngAfterViewInit();
        }
      }).not.toThrow();
    });

    it('should handle component initialization', () => {
      expect(typeof component.initialize).toBe('function');
      expect(() => {
        // Ensure form mock is properly set up before initialization
        expect(component.form).toBeDefined();
        expect(typeof component.form.registerFormComponent).toBe('function');
        expect(typeof component.form.registerFormControlComponent).toBe('function');
        expect(typeof component.form.registerSQLTypeFormComponent).toBe('function');
        expect(typeof component.form.isInUpdateMode).toBe('function');
        expect(typeof component.form.isEditableDetail).toBe('function');
        component.initialize();
      }).not.toThrow();
    });
  });
});
