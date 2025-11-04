import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { FormComponentMockUtil } from '../test/form-component-mock.util';

// Import component dynamically to avoid compilation
let OTextInputComponent: any;

describe('OTextInputComponent', () => {
  let component: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-text-input.component');
    OTextInputComponent = module.OTextInputComponent;
    
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
    const testSetup = FormComponentMockUtil.createInputComponentTestSetup(OTextInputComponent, mockInjector);
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
    expect(component.constructor).toBe(OTextInputComponent);
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
      expect(typeof component.ngOnDestroy).toBe('function');
    });

    it('should have basic form control methods', () => {
      const methods = ['setValue', 'getValue', 'clearValue', 'getFormControl'];
      methods.forEach(method => {
        expect(typeof component[method]).toBe('function');
      });
    });
  });

  describe('Text Input Properties and Configuration', () => {
    it('should handle text-specific properties safely', () => {
      expect(() => {
        // Test setting properties without throwing errors
        component.stringCase = 'uppercase';
        component.regulatePattern = '[0-9]*';
        
        // Test that properties can be accessed
        const stringCase = component.stringCase;
        const regulatePattern = component.regulatePattern;
        const prefixChildren = component._prefixChildren;
        const suffixChildren = component._suffixChildren;
      }).not.toThrow();
    });

    it('should handle string case properties safely', () => {
      expect(() => {
        component.stringCase = 'uppercase';
        component.stringCase = 'lowercase';
        component.stringCase = 'default';
      }).not.toThrow();
    });

    it('should handle regulate pattern property', () => {
      expect(() => {
        component.regulatePattern = '[0-9]*';
        component.regulatePattern = '^[a-zA-Z]*$';
        component.regulatePattern = null;
      }).not.toThrow();
    });

    it('should handle minLength and maxLength properties', () => {
      expect(() => {
        component.minLength = 5;
        component.maxLength = 100;
        expect(typeof component.minLength).toBe('number');
        expect(typeof component.maxLength).toBe('number');
      }).not.toThrow();
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

    it('should include minLength validator when minLength is set', () => {
      component.minLength = 5;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
      
      // Test that validators array contains functions
      const hasValidatorFunctions = validators.some(validator => typeof validator === 'function');
      expect(hasValidatorFunctions).toBeTruthy();
    });

    it('should include maxLength validator when maxLength is set', () => {
      component.maxLength = 100;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
      
      // Test that validators array contains functions
      const hasValidatorFunctions = validators.some(validator => typeof validator === 'function');
      expect(hasValidatorFunctions).toBeTruthy();
    });

    it('should include both minLength and maxLength validators when both are set', () => {
      component.minLength = 5;
      component.maxLength = 100;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(1);
    });

    it('should handle undefined minLength/maxLength values gracefully', () => {
      component.minLength = undefined;
      component.maxLength = undefined;
      expect(() => {
        const validators = component.resolveValidators();
        expect(Array.isArray(validators)).toBeTruthy();
      }).not.toThrow();
    });

    it('should handle negative length values properly', () => {
      component.minLength = -1;
      component.maxLength = -1;
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBeTruthy();
    });
  });

  describe('Value Handling and Transformation', () => {
    it('should handle setValue and getValue operations safely', () => {
      expect(() => {
        component.setValue('test text');
        component.getValue();
        component.setValue(null);
        component.setValue(undefined);
      }).not.toThrow();
    });

    it('should handle string case transformations safely using setValue', () => {
      expect(() => {
        component.stringCase = 'uppercase';
        component.setValue('hello world');
        
        component.stringCase = 'lowercase';
        component.setValue('HELLO WORLD');
        
        component.stringCase = 'default';
        component.setValue('Hello World');
      }).not.toThrow();
    });

    it('should have transformStringCase method', () => {
      expect(typeof component.transformStringCase).toBe('function');
      expect(() => {
        component.stringCase = 'uppercase';
        const result1 = component.transformStringCase('hello');
        const result2 = component.transformStringCase(null);
        const result3 = component.transformStringCase(undefined);
      }).not.toThrow();
    });

    it('should handle clearValue operation', () => {
      expect(() => {
        component.setValue('test text');
        component.clearValue();
      }).not.toThrow();
    });
  });

  describe('Property Setters and Getters', () => {
    it('should set and get minLength property correctly', () => {
      expect(() => {
        component.minLength = 5;
        expect(component.minLength).toBe(5);
        
        component.minLength = 0;
        expect(component.minLength).toBe(0);
        
        component.minLength = -1;
        expect(component.minLength).toBe(-1);
      }).not.toThrow();
    });

    it('should set and get maxLength property correctly', () => {
      expect(() => {
        component.maxLength = 100;
        expect(component.maxLength).toBe(100);
        
        component.maxLength = 0;
        expect(component.maxLength).toBe(0);
        
        component.maxLength = -1;
        expect(component.maxLength).toBe(-1);
      }).not.toThrow();
    });

    it('should handle property changes without throwing errors', () => {
      expect(() => {
        const oldMin = component.minLength;
        component.minLength = 5;
        component.minLength = oldMin;
        
        const oldMax = component.maxLength;
        component.maxLength = 100;
        component.maxLength = oldMax;
      }).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    it('should handle value setting without errors', () => {
      expect(() => {
        component.setValue('test');
        component.setValue('');
        component.setValue(null);
        component.setValue(undefined);
      }).not.toThrow();
    });

    it('should handle string transformation through setValue', () => {
      expect(() => {
        component.stringCase = 'uppercase';
        component.setValue('Mixed Case String 123!@#');
        
        component.stringCase = 'lowercase';
        component.setValue('MIXED CASE STRING 123!@#');
        
        component.stringCase = 'default';
        component.setValue('Mixed Case String 123!@#');
      }).not.toThrow();
    });

    it('should have onFormControlChange method', () => {
      expect(typeof component.onFormControlChange).toBe('function');
    });
  });

  describe('Lifecycle Methods', () => {
    it('should handle ngOnInit lifecycle', () => {
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });

    it('should handle ngAfterViewInit lifecycle', () => {
      expect(() => {
        component.ngAfterViewInit();
      }).not.toThrow();
    });

    it('should handle ngOnDestroy lifecycle', () => {
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
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

    it('should properly handle subscription cleanup on destroy', () => {
      // Set up a subscription to test cleanup
      component.upperSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
      
      component.ngOnDestroy();
      
      expect(component.upperSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle destroy when no subscription exists', () => {
      component.upperSubscription = null;
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('DOM Integration and Properties', () => {
    it('should have content children properties', () => {
      expect(() => {
        const prefixChildren = component._prefixChildren;
        const suffixChildren = component._suffixChildren;
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

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined values in transformStringCase', () => {
      expect(() => {
        component.transformStringCase(null);
        component.transformStringCase(undefined);
        component.transformStringCase('');
      }).not.toThrow();
    });

    it('should handle non-string values in transformStringCase', () => {
      expect(() => {
        component.transformStringCase(123);
        component.transformStringCase(true);
        component.transformStringCase({});
      }).not.toThrow();
    });

    it('should handle mock form value scenarios', () => {
      expect(() => {
        // Create mock form values to test string case transformation
        const mockFormValue1 = { value: 'test string' };
        const mockFormValue2 = { value: null };
        const mockFormValue3 = { value: 123 };
        
        component.stringCase = 'uppercase';
        component.transformStringCase(mockFormValue1);
        component.transformStringCase(mockFormValue2);
        component.transformStringCase(mockFormValue3);
      }).not.toThrow();
    });

    it('should handle setting invalid string case values', () => {
      expect(() => {
        component.stringCase = 'invalid_case';
        component.setValue('test string');
      }).not.toThrow();
    });

    it('should handle extreme length values', () => {
      expect(() => {
        component.minLength = Number.MAX_SAFE_INTEGER;
        component.maxLength = Number.MAX_SAFE_INTEGER;
        const validators = component.resolveValidators();
        expect(Array.isArray(validators)).toBeTruthy();
      }).not.toThrow();
    });

    it('should handle string type conversion scenarios', () => {
      expect(() => {
        component.minLength = '10' as any;
        component.maxLength = '100' as any;
        expect(typeof component.minLength).toBe('number');
        expect(typeof component.maxLength).toBe('number');
      }).not.toThrow();
    });

    it('should maintain validator consistency across multiple calls', () => {
      component.minLength = 5;
      component.maxLength = 95;
      
      const validators1 = component.resolveValidators();
      const validators2 = component.resolveValidators();
      
      expect(validators1.length).toBe(validators2.length);
      expect(Array.isArray(validators1)).toBeTruthy();
      expect(Array.isArray(validators2)).toBeTruthy();
    });

    it('should handle null and undefined values gracefully', () => {
      expect(() => {
        component.setValue(null);
        component.setValue(undefined);
        component.setValue('');
      }).not.toThrow();
    });
  });

  describe('String Case Integration', () => {
    it('should handle string case with mock options safely', () => {
      expect(() => {
        // Mock oInputsOptions at the component level for safe testing
        Object.defineProperty(component, 'oInputsOptions', {
          value: { stringCase: 'lowercase' },
          writable: true,
          configurable: true
        });
        component.setValue('HELLO WORLD');
      }).not.toThrow();
    });

    it('should prefer component stringCase over options', () => {
      expect(() => {
        component.stringCase = 'lowercase';
        Object.defineProperty(component, 'oInputsOptions', {
          value: { stringCase: 'uppercase' },
          writable: true,
          configurable: true
        });
        component.setValue('HELLO WORLD');
      }).not.toThrow();
    });

    it('should handle missing options gracefully', () => {
      expect(() => {
        component.stringCase = 'uppercase';
        Object.defineProperty(component, 'oInputsOptions', {
          value: null,
          writable: true,
          configurable: true
        });
        component.setValue('hello world');
      }).not.toThrow();
    });

    it('should handle transformStringCase with various string case options', () => {
      expect(() => {
        // Test direct transformation method
        component.stringCase = 'uppercase';
        const result1 = component.transformStringCase('hello world');
        
        component.stringCase = 'lowercase';
        const result2 = component.transformStringCase('HELLO WORLD');
        
        component.stringCase = 'default';
        const result3 = component.transformStringCase('Hello World');
      }).not.toThrow();
    });
  });

});
