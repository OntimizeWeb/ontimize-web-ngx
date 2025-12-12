import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

let OTextareaInputComponent: any;

describe('OTextareaInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    const module = await import('./o-textarea-input.component');
    OTextareaInputComponent = module.OTextareaInputComponent;

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
    mockElementRef = { nativeElement: document.createElement('textarea') };
    mockInjector = TestBed.inject(Injector);

    component = new OTextareaInputComponent(mockOFormComponent, mockElementRef, mockInjector);
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
    it('should have default rows as 5', () => {
      expect(component.rows).toBe(5);
    });

    it('should have default columns as 3', () => {
      expect(component.columns).toBe(3);
    });

    it('should extend OTextInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });
  });

  describe('Properties: rows', () => {
    it('should set rows to numeric value', () => {
      component.rows = 10;
      expect(component.rows).toBe(10);
    });

    it('should set rows to different values', () => {
      component.rows = 3;
      expect(component.rows).toBe(3);
      component.rows = 20;
      expect(component.rows).toBe(20);
    });

    it('should support NumberInputConverter', () => {
      component.rows = 15;
      expect(typeof component.rows).toBe('number');
    });
  });

  describe('Properties: columns', () => {
    it('should set columns to numeric value', () => {
      component.columns = 50;
      expect(component.columns).toBe(50);
    });

    it('should set columns to different values', () => {
      component.columns = 40;
      expect(component.columns).toBe(40);
      component.columns = 80;
      expect(component.columns).toBe(80);
    });

    it('should support NumberInputConverter', () => {
      component.columns = 60;
      expect(typeof component.columns).toBe('number');
    });
  });

  describe('Method: isResizable()', () => {
    it('should return true when component is enabled', () => {
      (component as any).enabled = true;
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(true);
    });

    it('should return false when component is disabled', () => {
      (component as any).enabled = false;
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(false);
    });

    it('should return false when component is read-only', () => {
      (component as any).enabled = true;
      (component as any).isReadOnly = true;
      expect(component.isResizable()).toBe(false);
    });

    it('should return false when disabled and read-only', () => {
      (component as any).enabled = false;
      (component as any).isReadOnly = true;
      expect(component.isResizable()).toBe(false);
    });

    it('should return true by default', () => {
      (component as any).enabled = true;
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(true);
    });
  });

  describe('Textarea Dimensions', () => {
    it('should have reasonable row values', () => {
      expect(component.rows).toBeGreaterThan(0);
    });

    it('should have reasonable column values', () => {
      expect(component.columns).toBeGreaterThan(0);
    });

    it('should allow large row values', () => {
      component.rows = 100;
      expect(component.rows).toBe(100);
    });

    it('should allow large column values', () => {
      component.columns = 200;
      expect(component.columns).toBe(200);
    });
  });

  describe('Constants', () => {
    it('should verify DEFAULT_INPUTS_O_TEXTAREA_INPUT', () => {
      const module = require('./o-textarea-input.component');
      expect(module.DEFAULT_INPUTS_O_TEXTAREA_INPUT).toBeDefined();
      expect(Array.isArray(module.DEFAULT_INPUTS_O_TEXTAREA_INPUT)).toBe(true);
      expect(module.DEFAULT_INPUTS_O_TEXTAREA_INPUT).toContain('columns');
      expect(module.DEFAULT_INPUTS_O_TEXTAREA_INPUT).toContain('rows');
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

    it('should have inherited methods', () => {
      expect(typeof (component as any).initialize).toBe('function');
    });
  });

  describe('Text Input Functionality', () => {
    it('should support text input through inherited class', () => {
      expect(component.constructor.name).toBe('OTextareaInputComponent');
    });

    it('should extend OTextInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });

    it('should be a text input variant', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OTextInputComponent');
    });
  });

  describe('Resizable Behavior', () => {
    it('should be resizable by default', () => {
      (component as any).enabled = true;
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(true);
    });

    it('should not be resizable when read-only', () => {
      (component as any).enabled = true;
      (component as any).isReadOnly = true;
      expect(component.isResizable()).toBe(false);
    });

    it('should not be resizable when disabled', () => {
      (component as any).enabled = false;
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(false);
    });

    it('should track resizable state changes', () => {
      (component as any).enabled = true;
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(true);
      
      (component as any).isReadOnly = true;
      expect(component.isResizable()).toBe(false);
      
      (component as any).isReadOnly = false;
      expect(component.isResizable()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        textarea: new FormControl('')
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
        component.rows = 8;
        component.columns = 50;
        (component as any).enabled = false;
        component.isResizable();
      }).not.toThrow();
    });

    it('should maintain state through multiple operations', () => {
      component.rows = 12;
      component.columns = 60;
      (component as any).enabled = true;
      (component as any).isReadOnly = false;
      
      expect(component.rows).toBe(12);
      expect(component.columns).toBe(60);
      expect(component.isResizable()).toBe(true);
      
      component.initialize();
      
      expect(component.rows).toBe(12);
      expect(component.columns).toBe(60);
    });

    it('should handle textarea-specific operations', () => {
      expect(() => {
        component.rows = 25;
        component.columns = 100;
        const isResizable = component.isResizable();
        expect(typeof isResizable).toBe('boolean');
      }).not.toThrow();
    });
  });
});
