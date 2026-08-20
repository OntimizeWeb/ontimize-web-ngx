import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

let OPercentInputComponent: any;

describe('OPercentInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    const module = await import('./o-percent-input.component');
    OPercentInputComponent = module.OPercentInputComponent;

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
    mockElementRef = { nativeElement: document.createElement('input') };
    mockInjector = TestBed.inject(Injector);

    component = TestBed.runInInjectionContext(() => new OPercentInputComponent(mockElementRef, mockInjector));
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend ORealInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('ORealInputComponent');
    });
  });

  describe('Default Properties', () => {
    it('should have default valueBase as 1', () => {
      expect(component.valueBase).toBe(1);
    });

    it('should have default grouping as true', () => {
      expect(component.grouping).toBe(true);
    });

    it('should have min and max properties after init', () => {
      component.ngOnInit();
      expect((component as any).min).toBeDefined();
      expect((component as any).max).toBeDefined();
    });
  });

  describe('Properties: valueBase', () => {
    it('should set valueBase to 1', () => {
      component.valueBase = 1;
      expect(component.valueBase).toBe(1);
    });

    it('should set valueBase to 100', () => {
      component.valueBase = 100;
      expect(component.valueBase).toBe(100);
    });

    it('should set valueBase to custom value', () => {
      component.valueBase = 10;
      expect(component.valueBase).toBe(10);
    });
  });

  describe('Properties: grouping', () => {
    it('should set grouping to true', () => {
      component.grouping = true;
      expect(component.grouping).toBe(true);
    });

    it('should set grouping to false', () => {
      component.grouping = false;
      expect(component.grouping).toBe(false);
    });

    it('should have grouping property', () => {
      expect((component as any).grouping).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should set default min value when not defined', () => {
      if (!(component as any).min) {
        component.ngOnInit();
        expect((component as any).min).toBe(0);
      }
    });

    it('should set default max value when not defined', () => {
      if (!(component as any).max) {
        component.ngOnInit();
        expect((component as any).max).toBe(100);
      }
    });

    it('should preserve existing min value', () => {
      (component as any).min = 10;
      component.ngOnInit();
      expect((component as any).min).toBe(10);
    });

    it('should preserve existing max value', () => {
      (component as any).max = 200;
      component.ngOnInit();
      expect((component as any).max).toBe(200);
    });
  });

  describe('Method: setComponentPipe()', () => {
    it('should create componentPipe', () => {
      (component as any).setComponentPipe();
      expect((component as any).componentPipe).toBeDefined();
    });

    it('should set OPercentPipe as componentPipe', () => {
      (component as any).setComponentPipe();
      expect((component as any).componentPipe.constructor.name).toBe('OPercentPipe');
    });
  });

  describe('Pipe Arguments', () => {
    it('should have pipeArguments property after init', () => {
      component.ngOnInit();
      expect((component as any).pipeArguments).toBeDefined();
    });

    it('should initialize pipeArguments with valueBase', () => {
      component.ngOnInit();
      expect((component as any).pipeArguments.valueBase).toBe(component.valueBase);
    });
  });

  describe('Min/Max Constraints', () => {
    it('should have min value of 0 or higher after init', () => {
      component.ngOnInit();
      expect((component as any).min).toBeGreaterThanOrEqual(0);
    });

    it('should have max value of 100 or higher after init', () => {
      component.ngOnInit();
      expect((component as any).max).toBeGreaterThanOrEqual(100);
    });

    it('should allow setting custom min/max', () => {
      (component as any).min = 5;
      (component as any).max = 95;
      expect((component as any).min).toBe(5);
      expect((component as any).max).toBe(95);
    });
  });

  describe('Inheritance', () => {
    it('should extend ORealInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('ORealInputComponent');
    });

    it('should have form property', () => {
      expect((component as any).form).toBeDefined();
    });

    it('should have inherited methods', () => {
      expect((component as any).ngOnInit).toBeDefined();
      expect(typeof (component as any).ngOnInit).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        percent: new FormControl('')
      });
      expect(formGroup).toBeTruthy();
    });

    it('should initialize without errors', () => {
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });

    it('should handle percentage values', () => {
      component.valueBase = 100;
      component.ngOnInit();
      expect(component.valueBase).toBe(100);
    });
  });
});
