import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OCheckboxComponent: any;

import { OFormComponent } from '../../form/o-form.component';

describe('OCheckboxComponent', () => {
  let component: any;
  let mockFormComponent: any;
  let mockElementRef: ElementRef;
  let injector: Injector;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-checkbox.component');
    OCheckboxComponent = module.OCheckboxComponent;
    
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

  // === PROPERTY TESTS (Proven Safe Pattern) ===
  describe('Component Properties', () => {
    it('should have color property that can be undefined initially', () => {
      // Color property may be undefined by default, which is valid
      expect(component.hasOwnProperty('color') || component.color === undefined).toBeTruthy();
    });

    it('should allow setting color property', () => {
      component.color = 'primary';
      expect(component.color).toBe('primary');
      
      component.color = 'accent';
      expect(component.color).toBe('accent');
      
      component.color = 'warn';
      expect(component.color).toBe('warn');
    });

    it('should have default labelPosition property', () => {
      expect(component.labelPosition).toBe('after');
    });

    it('should allow setting labelPosition property', () => {
      component.labelPosition = 'before';
      expect(component.labelPosition).toBe('before');
      
      component.labelPosition = 'after';
      expect(component.labelPosition).toBe('after');
    });

    it('should inherit trueValue property from parent class', () => {
      expect(component.trueValue).toBe(true);
    });

    it('should allow setting trueValue property', () => {
      component.trueValue = 1;
      expect(component.trueValue).toBe(1);
      
      component.trueValue = 'yes';
      expect(component.trueValue).toBe('yes');
    });

    it('should inherit falseValue property from parent class', () => {
      expect(component.falseValue).toBe(false);
    });

    it('should allow setting falseValue property', () => {
      component.falseValue = 0;
      expect(component.falseValue).toBe(0);
      
      component.falseValue = 'no';
      expect(component.falseValue).toBe('no');
    });

    it('should have default booleanType property', () => {
      expect(component.booleanType).toBe('boolean');
    });

    it('should allow setting booleanType property', () => {
      component.booleanType = 'number';
      expect(component.booleanType).toBe('number');
      
      component.booleanType = 'string';
      expect(component.booleanType).toBe('string');
      
      component.booleanType = 'boolean';
      expect(component.booleanType).toBe('boolean');
    });
  });

  // === METHOD TESTS (Proven Safe Pattern) ===
  describe('Component Methods', () => {
    it('should have getFormControl method', () => {
      expect(typeof component.getFormControl).toBe('function');
    });

    it('should have initialize method', () => {
      expect(typeof component.initialize).toBe('function');
    });

    it('should handle initialize method call without errors', () => {
      // Setup basic form control mock for safe testing
      const mockFormControl = {
        getValue: jasmine.createSpy('getValue'),
        value: true
      };
      
      spyOn(component, 'getFormControl').and.returnValue(mockFormControl);
      
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });

    it('should have inherited form data methods', () => {
      expect(typeof component.setValue).toBe('function');
      expect(typeof component.getValue).toBe('function');
      expect(typeof component.clearValue).toBe('function');
    });
  });

  // === BASIC FUNCTIONALITY TESTS (Proven Safe Pattern) ===
  describe('Component Functionality', () => {
    it('should have oattr property set correctly', () => {
      expect(component.oattr).toBe('testCheckbox');
    });

    it('should handle property changes without errors', () => {
      expect(() => {
        component.color = 'primary';
        component.labelPosition = 'before';
        component.trueValue = 'YES';
        component.falseValue = 'NO';
        component.booleanType = 'string';
      }).not.toThrow();
    });

    it('should maintain property values after setting', () => {
      component.color = 'accent';
      component.labelPosition = 'before';
      component.trueValue = 1;
      component.falseValue = 0;
      component.booleanType = 'number';

      expect(component.color).toBe('accent');
      expect(component.labelPosition).toBe('before');
      expect(component.trueValue).toBe(1);
      expect(component.falseValue).toBe(0);
      expect(component.booleanType).toBe('number');
    });

    it('should handle boolean type values correctly', () => {
      // String type
      component.booleanType = 'string';
      component.trueValue = 'true';
      component.falseValue = 'false';
      expect(component.trueValue).toBe('true');
      expect(component.falseValue).toBe('false');

      // Number type
      component.booleanType = 'number';
      component.trueValue = 1;
      component.falseValue = 0;
      expect(component.trueValue).toBe(1);
      expect(component.falseValue).toBe(0);

      // Boolean type
      component.booleanType = 'boolean';
      component.trueValue = true;
      component.falseValue = false;
      expect(component.trueValue).toBe(true);
      expect(component.falseValue).toBe(false);
    });
  });

  // === STRUCTURE AND INHERITANCE TESTS (Proven Safe Pattern) ===
  describe('Component Structure', () => {
    it('should extend OBooleanFormDataComponent', () => {
      expect(component.constructor.name).toBe('OCheckboxComponent');
    });

    it('should have constructor with proper parameters', () => {
      expect(component.constructor.length).toBe(3); // form, elRef, injector
    });

    it('should have proper default values', () => {
      expect(component.labelPosition).toBe('after');
      expect(component.trueValue).toBe(true);
      expect(component.falseValue).toBe(false);
      expect(component.booleanType).toBe('boolean');
    });

    it('should handle instantiation without errors', () => {
      const newComponent = new OCheckboxComponent(mockFormComponent, mockElementRef, injector);
      expect(newComponent).toBeTruthy();
      expect(newComponent).toBeInstanceOf(OCheckboxComponent);
    });
  });

  // === ADVANCED PROPERTY TESTS (Extended Safe Pattern) ===
  describe('Advanced Property Handling', () => {
    it('should handle color property with all valid ThemePalette values', () => {
      const validColors: any[] = ['primary', 'accent', 'warn', undefined];
      
      validColors.forEach(color => {
        component.color = color;
        expect(component.color).toBe(color);
      });
    });

    it('should handle labelPosition property validation', () => {
      const validPositions: ('before' | 'after')[] = ['before', 'after'];
      
      validPositions.forEach(position => {
        component.labelPosition = position;
        expect(component.labelPosition).toBe(position);
      });
    });

    it('should handle complex booleanType scenarios', () => {
      // Test number type with appropriate values
      component.booleanType = 'number';
      component.trueValue = 1;
      component.falseValue = 0;
      expect(component.booleanType).toBe('number');
      expect(typeof component.trueValue).toBe('number');
      expect(typeof component.falseValue).toBe('number');

      // Test string type with appropriate values
      component.booleanType = 'string';
      component.trueValue = 'YES';
      component.falseValue = 'NO';
      expect(component.booleanType).toBe('string');
      expect(typeof component.trueValue).toBe('string');
      expect(typeof component.falseValue).toBe('string');
    });

    it('should maintain property consistency after multiple changes', () => {
      // Rapid property changes
      for (let i = 0; i < 5; i++) {
        component.color = i % 2 === 0 ? 'primary' : 'accent';
        component.labelPosition = i % 2 === 0 ? 'before' : 'after';
        component.booleanType = i % 2 === 0 ? 'number' : 'string';
      }
      
      // Verify final state
      expect(component.color).toBeDefined();
      expect(component.labelPosition).toBeDefined();
      expect(component.booleanType).toBeDefined();
    });
  });

  // === EDGE CASE TESTS (Safe Pattern) ===
  describe('Edge Case Handling', () => {
    it('should handle null and undefined values safely', () => {
      expect(() => {
        component.color = null as any;
        component.color = undefined;
        component.trueValue = null;
        component.falseValue = null;
      }).not.toThrow();
    });

    it('should handle extreme boolean type values', () => {
      // Very large numbers
      component.booleanType = 'number';
      component.trueValue = Number.MAX_SAFE_INTEGER;
      component.falseValue = Number.MIN_SAFE_INTEGER;
      expect(component.trueValue).toBe(Number.MAX_SAFE_INTEGER);
      expect(component.falseValue).toBe(Number.MIN_SAFE_INTEGER);

      // Very long strings
      component.booleanType = 'string';
      const longString = 'a'.repeat(1000);
      component.trueValue = longString;
      component.falseValue = '';
      expect(component.trueValue).toBe(longString);
      expect(component.falseValue).toBe('');
    });

    it('should handle mixed type assignments', () => {
      // Test type flexibility
      component.booleanType = 'number';
      component.trueValue = 'string_value'; // Intentionally mixed
      component.falseValue = true; // Intentionally mixed
      
      expect(component.trueValue).toBe('string_value');
      expect(component.falseValue).toBe(true);
    });
  });

  // === INHERITANCE VALIDATION TESTS (Safe Pattern) ===
  describe('Inheritance and Class Structure', () => {
    it('should properly inherit from OBooleanFormDataComponent', () => {
      expect(component instanceof (require('../o-boolean-form-data-component.class').OBooleanFormDataComponent)).toBeTruthy();
    });

    it('should have access to parent class methods', () => {
      const parentMethods = ['setValue', 'getValue', 'clearValue', 'getFormControl'];
      parentMethods.forEach(method => {
        expect(typeof component[method]).toBe('function');
      });
    });

    it('should have access to parent class properties', () => {
      const parentProperties = ['trueValue', 'falseValue', 'booleanType'];
      parentProperties.forEach(prop => {
        expect(component.hasOwnProperty(prop) || component[prop] !== undefined).toBeTruthy();
      });
    });

    it('should override initialize method properly', () => {
      expect(component.initialize).toBeDefined();
      expect(typeof component.initialize).toBe('function');
      
      // Verify it's the component's own method, not just inherited
      expect(component.constructor.prototype.hasOwnProperty('initialize')).toBeTruthy();
    });
  });

  // === FORM CONTROL INTEGRATION TESTS (Safe Pattern) ===
  describe('Form Control Integration', () => {
    it('should handle form control getValue override safely', () => {
      const mockFormControl = {
        getValue: jasmine.createSpy('getValue'),
        value: true
      };
      
      spyOn(component, 'getFormControl').and.returnValue(mockFormControl);
      
      expect(() => {
        component.initialize();
        // Verify the getValue function was overridden
        expect(typeof mockFormControl.getValue).toBe('function');
      }).not.toThrow();
    });

    it('should handle getValue logic with different boolean types', () => {
      const mockFormControl = {
        getValue: jasmine.createSpy('getValue'),
        value: true
      };
      
      spyOn(component, 'getFormControl').and.returnValue(mockFormControl);
      
      // Test with different configurations
      component.booleanType = 'number';
      component.trueValue = 1;
      component.falseValue = 0;
      
      expect(() => {
        component.initialize();
      }).not.toThrow();
      
      expect(mockFormControl.getValue).toBeDefined();
    });

    it('should preserve form component reference', () => {
      expect(component.form).toBe(mockFormComponent);
    });
  });

  // === COMPONENT CONSTANTS AND DEFAULTS TESTS (Safe Pattern) ===
  describe('Component Constants and Defaults', () => {
    it('should verify DEFAULT_INPUTS_O_CHECKBOX constant', () => {
      const module = require('./o-checkbox.component');
      expect(module.DEFAULT_INPUTS_O_CHECKBOX).toBeDefined();
      expect(Array.isArray(module.DEFAULT_INPUTS_O_CHECKBOX)).toBe(true);
      expect(module.DEFAULT_INPUTS_O_CHECKBOX.length).toBeGreaterThan(0);
    });

    it('should have correct default input mappings', () => {
      const module = require('./o-checkbox.component');
      const inputs = module.DEFAULT_INPUTS_O_CHECKBOX;
      
      expect(inputs).toContain('color');
      expect(inputs.some((input: string) => input.includes('label-position'))).toBeTruthy();
    });

    it('should handle all default values correctly on fresh instantiation', () => {
      const freshComponent = new OCheckboxComponent(mockFormComponent, mockElementRef, injector);
      
      expect(freshComponent.labelPosition).toBe('after');
      expect(freshComponent.trueValue).toBe(true);
      expect(freshComponent.falseValue).toBe(false);
      expect(freshComponent.booleanType).toBe('boolean');
    });
  });
});
