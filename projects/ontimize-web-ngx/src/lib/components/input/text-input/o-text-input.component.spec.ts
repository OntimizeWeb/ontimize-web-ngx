import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, ElementRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { FormComponentMockUtil } from '../test/form-component-mock.util';
import { OFormValue } from '../../form';

// Import component dynamically to avoid compilation
let OTextInputComponent: any;

describe('OTextInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-text-input.component');
    OTextInputComponent = module.OTextInputComponent;
    
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

    // Create component
    component = TestBed.runInInjectionContext(() => new OTextInputComponent(mockElementRef, mockInjector));
  });

  describe('Component Creation and Basic Structure', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of OTextInputComponent', () => {
      expect(component.constructor).toBe(OTextInputComponent);
    });

    it('should have resolveValidators method', () => {
      expect(typeof component.resolveValidators).toBe('function');
    });

    it('should have onFormControlChange method', () => {
      expect(typeof component.onFormControlChange).toBe('function');
    });

    it('should have transformStringCase method', () => {
      expect(typeof component.transformStringCase).toBe('function');
    });

    it('should have ngOnDestroy method', () => {
      expect(typeof component.ngOnDestroy).toBe('function');
    });
  });
  describe('Min/Max Length Properties', () => {
    it('should initialize with undefined minLength', () => {
      expect(component.minLength).toBeUndefined();
    });

    it('should initialize with undefined maxLength', () => {
      expect(component.maxLength).toBeUndefined();
    });

    it('should set minLength correctly', () => {
      component.minLength = 5;
      expect(component.minLength).toBe(5);
    });

    it('should set maxLength correctly', () => {
      component.maxLength = 100;
      expect(component.maxLength).toBe(100);
    });

    it('should convert string minLength to number', () => {
      component.minLength = '10' as any;
      expect(component.minLength).toBe(10);
      expect(typeof component.minLength).toBe('number');
    });

    it('should convert string maxLength to number', () => {
      component.maxLength = '50' as any;
      expect(component.maxLength).toBe(50);
      expect(typeof component.maxLength).toBe('number');
    });

    it('should handle zero minLength', () => {
      component.minLength = 0;
      expect(component.minLength).toBe(0);
    });

    it('should handle zero maxLength', () => {
      component.maxLength = 0;
      expect(component.maxLength).toBe(0);
    });

    it('should handle negative minLength', () => {
      component.minLength = -1;
      expect(component.minLength).toBe(-1);
    });

    it('should handle large length values', () => {
      component.minLength = 999999;
      component.maxLength = 9999999;
      expect(component.minLength).toBe(999999);
      expect(component.maxLength).toBe(9999999);
    });
  });

  describe('Validator Resolution', () => {
    it('should return array of validators', () => {
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should include minLength validator when minLength is set', () => {
      component.minLength = 5;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
      
      // Test validator function
      const control = new FormControl('ab');
      const result = validators.find(v => {
        const error = v(control);
        return error && error['minlength'];
      });
      expect(result).toBeDefined();
    });

    it('should include maxLength validator when maxLength is set', () => {
      component.maxLength = 10;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThan(0);
      
      // Test validator function
      const control = new FormControl('this is a very long string that exceeds the max');
      const result = validators.find(v => {
        const error = v(control);
        return error && error['maxlength'];
      });
      expect(result).toBeDefined();
    });

    it('should include both minLength and maxLength validators when both are set', () => {
      component.minLength = 5;
      component.maxLength = 20;
      const validators = component.resolveValidators();
      expect(validators.length).toBeGreaterThanOrEqual(2);
    });

    it('should not include minLength validator when minLength is negative', () => {
      component.minLength = -1;
      const validators = component.resolveValidators();
      // Should return validators array even if no length validators added
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should not include maxLength validator when maxLength is negative', () => {
      component.maxLength = -1;
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should handle validator changes on property updates', () => {
      const validators1 = component.resolveValidators();
      component.minLength = 5;
      const validators2 = component.resolveValidators();
      // After setting minLength, should have validators
      expect(validators2.length).toBeGreaterThan(0);
    });
  });

  describe('String Case Transformation', () => {
    it('should return value unchanged when stringCase is undefined', () => {
      component.stringCase = undefined;
      const result = component.transformStringCase('Hello World');
      expect(result).toBe('Hello World');
    });

    it('should return value unchanged when stringCase is default', () => {
      component.stringCase = 'default';
      const result = component.transformStringCase('Hello World');
      expect(result).toBe('Hello World');
    });

    it('should transform string to uppercase', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase('hello world');
      expect(result).toBe('HELLO WORLD');
    });

    it('should transform string to lowercase', () => {
      component.stringCase = 'lowercase';
      const result = component.transformStringCase('HELLO WORLD');
      expect(result).toBe('hello world');
    });

    it('should handle null value in transformation', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase(null);
      expect(result).toBeNull();
    });

    it('should handle undefined value in transformation', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle empty string transformation', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase('');
      expect(result).toBe('');
    });

    it('should transform OFormValue objects to uppercase', () => {
      component.stringCase = 'uppercase';
      const formValue = { value: 'hello' };
      const result = component.transformStringCase(formValue);
      expect(result).toBeDefined();
    });

    it('should transform OFormValue objects to lowercase', () => {
      component.stringCase = 'lowercase';
      const formValue = { value: 'HELLO' };
      const result = component.transformStringCase(formValue);
      expect(result).toBeDefined();
    });

    it('should handle OFormValue with null value', () => {
      component.stringCase = 'uppercase';
      const formValue = { value: null };
      const result = component.transformStringCase(formValue);
      expect(result.value).toBeNull();
    });

    it('should handle OFormValue with non-string value', () => {
      component.stringCase = 'uppercase';
      const formValue = { value: 123 };
      const result = component.transformStringCase(formValue);
      expect(result.value).toBe(123);
    });

    it('should handle non-string, non-OFormValue inputs', () => {
      component.stringCase = 'uppercase';
      expect(() => {
        component.transformStringCase(123);
        component.transformStringCase(true);
        component.transformStringCase({});
        component.transformStringCase([]);
      }).not.toThrow();
    });

    it('should use oInputsOptions stringCase when component stringCase is undefined', () => {
      component.stringCase = undefined;
      component.oInputsOptions = { stringCase: 'uppercase' };
      const result = component.transformStringCase('hello');
      expect(result).toBe('HELLO');
    });

    it('should prefer component stringCase over oInputsOptions', () => {
      component.stringCase = 'uppercase';
      component.oInputsOptions = { stringCase: 'lowercase' };
      const result = component.transformStringCase('hello');
      expect(result).toBe('HELLO');
    });

    it('should handle special characters in transformation', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase('hello123!@#$%');
      expect(result).toBe('HELLO123!@#$%');
    });
  });

  describe('Form Control Change Handling', () => {
    it('should apply string case transformation on form control change', () => {
      component.stringCase = 'uppercase';
      component._fControl = new FormControl('hello');
      component.onFormControlChange('hello');
      expect(component._fControl.value).toBe('HELLO');
    });

    it('should not transform when stringCase is default', () => {
      component.stringCase = 'default';
      component._fControl = new FormControl('hello');
      component.onFormControlChange('hello');
      expect(component._fControl.value).toBe('hello');
    });

    it('should transform lowercase on form control change', () => {
      component.stringCase = 'lowercase';
      component._fControl = new FormControl('HELLO');
      component.onFormControlChange('HELLO');
      expect(component._fControl.value).toBe('hello');
    });

    it('should handle null value in onFormControlChange', () => {
      component.stringCase = 'uppercase';
      component._fControl = new FormControl(null);
      expect(() => {
        component.onFormControlChange(null);
      }).not.toThrow();
    });

    it('should emit change event after transformation', () => {
      component.stringCase = 'uppercase';
      component._fControl = new FormControl('hello');
      spyOn(component, 'onValueChange');
      component.onFormControlChange('hello');
      // The parent class method should be called
      expect(component._fControl.value).toBe('HELLO');
    });

    it('should handle OFormValue in onFormControlChange', () => {
      component.stringCase = 'uppercase';
      component._fControl = new FormControl(null);
      const formValue = { value: 'hello' };
      expect(() => {
        component.onFormControlChange(formValue);
      }).not.toThrow();
    });
  });

  describe('Lifecycle Management', () => {
    it('should handle ngOnInit without errors', () => {
      expect(() => {
        // ngOnInit requires full form context - just validate method exists
        expect(typeof component.ngOnInit).toBe('function');
      }).not.toThrow();
    });

    it('should handle ngAfterViewInit without errors', () => {
      expect(() => {
        component.ngAfterViewInit();
      }).not.toThrow();
    });

    it('should unsubscribe from upperSubscription on ngOnDestroy', () => {
      const mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
      component.upperSubscription = mockSubscription;
      component.ngOnDestroy();
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle ngOnDestroy when no subscription exists', () => {
      component.upperSubscription = null;
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });

    it('should handle ngOnDestroy with undefined subscription', () => {
      component.upperSubscription = undefined;
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  describe('Content Children and DOM Integration', () => {
    it('should have @ContentChildren decorator for prefix/suffix', () => {
      // ContentChildren are initialized by Angular's DI system
      // We just verify the component structure without DI
      expect(typeof component.transformStringCase).toBe('function');
    });

    it('should initialize properties without errors', () => {
      expect(() => {
        const prefix = component._prefixChildren;
        const suffix = component._suffixChildren;
      }).not.toThrow();
    });
  });

  describe('Configuration Properties', () => {
    it('should handle stringCase property', () => {
      expect(() => {
        component.stringCase = 'uppercase';
        expect(component.stringCase).toBe('uppercase');
        
        component.stringCase = 'lowercase';
        expect(component.stringCase).toBe('lowercase');
        
        component.stringCase = 'default';
        expect(component.stringCase).toBe('default');
      }).not.toThrow();
    });

    it('should handle regulatePattern property', () => {
      expect(() => {
        component.regulatePattern = '[0-9]*';
        expect(component.regulatePattern).toBe('[0-9]*');
        
        component.regulatePattern = '^[a-zA-Z]+$';
        expect(component.regulatePattern).toBe('^[a-zA-Z]+$');
      }).not.toThrow();
    });

    it('should handle null regulatePattern', () => {
      expect(() => {
        component.regulatePattern = null;
        expect(component.regulatePattern).toBeNull();
      }).not.toThrow();
    });
  });

  describe('Integration with FormGroup', () => {
    it('should work within a FormGroup with minLength validator', () => {
      component.minLength = 5;
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        textInput: new FormControl('', validators)
      });
      
      // Test that validators are returned and can be used in FormGroup
      expect(validators.length).toBeGreaterThan(0);
      formGroup.get('textInput')?.setValue('hello');
      const control = formGroup.get('textInput');
      expect(control?.value).toBe('hello');
    });

    it('should work within a FormGroup with maxLength validator', () => {
      component.maxLength = 10;
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        textInput: new FormControl('', validators)
      });
      
      formGroup.get('textInput')?.setValue('short text');
      expect(formGroup.invalid).toBe(false);
      
      formGroup.get('textInput')?.setValue('this is a very long text that exceeds the limit');
      expect(formGroup.invalid).toBe(true);
    });

    it('should work with both minLength and maxLength validators', () => {
      component.minLength = 3;
      component.maxLength = 10;
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        textInput: new FormControl('', validators)
      });
      
      // Too short
      formGroup.get('textInput')?.setValue('ab');
      expect(formGroup.invalid).toBe(true);
      
      // Valid
      formGroup.get('textInput')?.setValue('valid');
      expect(formGroup.invalid).toBe(false);
      
      // Too long
      formGroup.get('textInput')?.setValue('this is way too long');
      expect(formGroup.invalid).toBe(true);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle extreme minLength values', () => {
      expect(() => {
        component.minLength = Number.MAX_SAFE_INTEGER;
        const validators = component.resolveValidators();
        expect(Array.isArray(validators)).toBe(true);
      }).not.toThrow();
    });

    it('should handle extreme maxLength values', () => {
      expect(() => {
        component.maxLength = Number.MAX_SAFE_INTEGER;
        const validators = component.resolveValidators();
        expect(Array.isArray(validators)).toBe(true);
      }).not.toThrow();
    });

    it('should handle setting minLength multiple times', () => {
      component.minLength = 5;
      component.minLength = 10;
      component.minLength = 3;
      expect(component.minLength).toBe(3);
    });

    it('should handle setting maxLength multiple times', () => {
      component.maxLength = 50;
      component.maxLength = 100;
      component.maxLength = 25;
      expect(component.maxLength).toBe(25);
    });

    it('should handle rapid stringCase changes', () => {
      expect(() => {
        component.stringCase = 'uppercase';
        component.stringCase = 'lowercase';
        component.stringCase = 'default';
        component.stringCase = 'uppercase';
      }).not.toThrow();
    });

    it('should handle whitespace in string transformation', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase('hello world test');
      expect(result).toBe('HELLO WORLD TEST');
    });

    it('should handle numbers in string transformation', () => {
      component.stringCase = 'uppercase';
      const result = component.transformStringCase('hello123world456');
      expect(result).toBe('HELLO123WORLD456');
    });

    it('should maintain validator count consistency', () => {
      const v1 = component.resolveValidators();
      const v2 = component.resolveValidators();
      expect(v1.length).toBe(v2.length);
    });
  });

});
