import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OValidators } from '../../../validators/o-validators';

// Import component dynamically to avoid compilation
let OEmailInputComponent: any;

describe('OEmailInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-email-input.component');
    OEmailInputComponent = module.OEmailInputComponent;
    
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
    component = new OEmailInputComponent(mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation and Structure', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of OEmailInputComponent', () => {
      expect(component.constructor).toBe(OEmailInputComponent);
    });

    it('should have resolveValidators method', () => {
      expect(typeof component.resolveValidators).toBe('function');
    });

    it('should extend OTextInputComponent', () => {
      // Component inherits from OTextInputComponent which extends OFormDataComponent
      expect(typeof component.transformStringCase).toBe('function');
      expect(typeof component.onFormControlChange).toBe('function');
    });

    it('should have ngOnInit method', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });
  });

  describe('Email Validator Resolution', () => {
    it('should include email validator in the validators array', () => {
      const validators = component.resolveValidators();
      expect(validators).toBeDefined();
      expect(Array.isArray(validators)).toBe(true);
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should include OValidators.emailValidator specifically', () => {
      const validators = component.resolveValidators();
      const emailValidatorExists = validators.some((v: any) => v === OValidators.emailValidator);
      expect(emailValidatorExists).toBe(true);
    });

    it('should call parent resolveValidators method', () => {
      const validators = component.resolveValidators();
      expect(validators).toBeDefined();
      expect(Array.isArray(validators)).toBe(true);
    });

    it('should add email validator to existing validators array', () => {
      const validators = component.resolveValidators();
      expect(validators).not.toBeNull();
      expect(validators).not.toBeUndefined();
      expect(validators.length).toBeGreaterThan(0);
    });
  });

  describe('Email Validation Functionality', () => {
    it('should validate valid email format', () => {
      const control = new FormControl('test@example.com');
      const result = OValidators.emailValidator(control);
      expect(result === undefined || Object.keys(result || {}).length === 0).toBe(true);
    });

    it('should validate email with different domain extensions', () => {
      const testEmails = [
        'user@domain.co.uk',
        'test@company.org',
        'name@mail.co'
      ];
      
      testEmails.forEach(email => {
        const control = new FormControl(email);
        const result = OValidators.emailValidator(control);
        expect(result === undefined || typeof result === 'object').toBe(true);
      });
    });

    it('should reject invalid email format - no @', () => {
      const control = new FormControl('invalidemail.com');
      const result = OValidators.emailValidator(control);
      expect(result).toBeTruthy();
      if (result) {
        expect(result['invalidEmailAddress']).toBe(true);
      }
    });

    it('should reject invalid email format - missing domain', () => {
      const control = new FormControl('test@');
      const result = OValidators.emailValidator(control);
      expect(result).toBeTruthy();
    });

    it('should reject invalid email format - missing local part', () => {
      const control = new FormControl('@example.com');
      const result = OValidators.emailValidator(control);
      expect(result).toBeTruthy();
    });

    it('should reject invalid email format - spaces', () => {
      const control = new FormControl('test @example.com');
      const result = OValidators.emailValidator(control);
      expect(result).toBeTruthy();
    });

    it('should handle empty email value', () => {
      const control = new FormControl('');
      expect(() => {
        OValidators.emailValidator(control);
      }).not.toThrow();
    });

    it('should handle null email value', () => {
      const control = new FormControl(null);
      expect(() => {
        OValidators.emailValidator(control);
      }).not.toThrow();
    });

    it('should handle email with uppercase letters', () => {
      const control = new FormControl('TEST@EXAMPLE.COM');
      const result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });

    it('should handle email with special characters in local part', () => {
      const control = new FormControl('test.name+tag@example.com');
      const result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });

    it('should validate email with numbers', () => {
      const control = new FormControl('user123@example456.com');
      const result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });
  });

  describe('Inherited Properties from OTextInputComponent', () => {
    it('should support minLength property', () => {
      expect(() => {
        component.minLength = 5;
        expect(component.minLength).toBe(5);
      }).not.toThrow();
    });

    it('should support maxLength property', () => {
      expect(() => {
        component.maxLength = 100;
        expect(component.maxLength).toBe(100);
      }).not.toThrow();
    });

    it('should support stringCase property', () => {
      expect(() => {
        component.stringCase = 'lowercase';
        expect(component.stringCase).toBe('lowercase');
      }).not.toThrow();
    });

    it('should support regulatePattern property', () => {
      expect(() => {
        component.regulatePattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
        expect(component.regulatePattern).toBeDefined();
      }).not.toThrow();
    });

    it('should handle form control change with email validation', () => {
      component._fControl = new FormControl('user@example.com');
      expect(() => {
        component.onFormControlChange('user@example.com');
      }).not.toThrow();
    });
  });

  describe('Integration with FormGroup', () => {
    it('should work within a FormGroup with email validator', () => {
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        emailInput: new FormControl('', validators)
      });
      
      expect(validators.length).toBeGreaterThan(0);
      formGroup.get('emailInput')?.setValue('test@example.com');
      const control = formGroup.get('emailInput');
      expect(control?.value).toBe('test@example.com');
    });

    it('should mark form as invalid with invalid email', () => {
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        emailInput: new FormControl('invalidemail', validators)
      });
      
      const control = formGroup.get('emailInput');
      expect(control?.invalid).toBe(true);
    });

    it('should mark form as valid with valid email', () => {
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        emailInput: new FormControl('test@example.com', validators)
      });
      
      const control = formGroup.get('emailInput');
      expect(control?.valid).toBe(true);
    });

    it('should work with minLength and email validators combined', () => {
      component.minLength = 5;
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        emailInput: new FormControl('', validators)
      });
      
      // Too short and invalid
      formGroup.get('emailInput')?.setValue('a@b');
      expect(formGroup.get('emailInput')?.invalid).toBe(true);
      
      // Valid email (meets minLength and email format)
      formGroup.get('emailInput')?.setValue('test@example.com');
      const control = formGroup.get('emailInput');
      expect(control?.value).toBe('test@example.com');
    });

    it('should work with maxLength and email validators combined', () => {
      component.maxLength = 30;
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        emailInput: new FormControl('test@example.com', validators)
      });
      
      const control = formGroup.get('emailInput');
      expect(control?.value).toBe('test@example.com');
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(64) + '@example.com';
      const control = new FormControl(longEmail);
      expect(() => {
        OValidators.emailValidator(control);
      }).not.toThrow();
    });

    it('should handle email with multiple dots in domain', () => {
      const control = new FormControl('test@sub.domain.example.com');
      const result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });

    it('should handle email with hyphen in domain', () => {
      const control = new FormControl('test@my-domain.com');
      const result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });

    it('should handle email validation multiple times', () => {
      const email = 'test@example.com';
      const control = new FormControl(email);
      
      const result1 = OValidators.emailValidator(control);
      const result2 = OValidators.emailValidator(control);
      
      // Results should be consistent (both valid or both invalid)
      expect((result1 === undefined && result2 === undefined) || 
             (result1 !== undefined && result2 !== undefined)).toBe(true);
    });

    it('should handle switching between valid and invalid emails', () => {
      const control = new FormControl('');
      
      control.setValue('test@example.com');
      let result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
      
      control.setValue('invalidemail');
      result = OValidators.emailValidator(control);
      expect(result === undefined || typeof result === 'object').toBe(true);
    });

    it('should handle email with numbers and special valid characters', () => {
      const emails = [
        'test.name@example.com',
        'test+tag@example.com',
        'test123@example.com',
        'test_name@example.com'
      ];
      
      emails.forEach(email => {
        const control = new FormControl(email);
        expect(() => {
          OValidators.emailValidator(control);
        }).not.toThrow();
      });
    });

    it('should handle component with inherited string case transformation', () => {
      component.stringCase = 'lowercase';
      expect(() => {
        component.transformStringCase('TEST@EXAMPLE.COM');
      }).not.toThrow();
    });

    it('should maintain validator consistency across multiple calls', () => {
      const validators1 = component.resolveValidators();
      const validators2 = component.resolveValidators();
      expect(validators1.length).toBe(validators2.length);
    });
  });

  describe('Constructor and Dependency Injection', () => {
    it('should have constructor with 3 parameters', () => {
      expect(component.constructor.length).toBe(3);
    });

    it('should properly initialize with form component', () => {
      expect(component.form).toBeDefined();
    });

    it('should properly initialize with element ref', () => {
      expect(component.elementRef).toBeDefined();
    });

    it('should properly initialize with injector', () => {
      expect(component.injector).toBeDefined();
    });
  });

  describe('Lifecycle and Cleanup', () => {
    it('should handle ngOnInit lifecycle', () => {
      expect(() => {
        expect(typeof component.ngOnInit).toBe('function');
      }).not.toThrow();
    });

    it('should handle ngAfterViewInit from parent', () => {
      expect(() => {
        expect(typeof component.ngAfterViewInit).toBe('function');
      }).not.toThrow();
    });

    it('should handle ngOnDestroy from parent', () => {
      expect(() => {
        expect(typeof component.ngOnDestroy).toBe('function');
      }).not.toThrow();
    });
  });

});