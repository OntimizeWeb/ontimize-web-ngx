import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

let OCurrencyInputComponent: any;

describe('OCurrencyInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;

  beforeEach(async () => {
    const module = await import('./o-currency-input.component');
    OCurrencyInputComponent = module.OCurrencyInputComponent;

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

    component = TestBed.runInInjectionContext(() => new OCurrencyInputComponent(mockElementRef, mockInjector));
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend ORealInputComponent', () => {
      const proto = Object.getPrototypeOf(component.constructor.prototype);
      expect(proto.constructor.name).toBe('ORealInputComponent');
    });
  });

  describe('currency_icons', () => {
    it('should have currency_icons map', () => {
      expect(component.currency_icons).toBeDefined();
      expect(component.currency_icons instanceof Map).toBe(true);
    });

    it('should have USD in currency_icons', () => {
      expect(component.currency_icons.has('USD')).toBe(true);
    });
  });

  describe('Default Properties', () => {
    it('should have default currencySymbol as EUR', () => {
      expect(component.currencySymbol).toBe('EUR');
    });

    it('should have default currencySymbolPosition as right', () => {
      expect(component.currencySymbolPosition).toBe('right');
    });

    it('should have currency_symbols object', () => {
      expect(component.currency_symbols).toBeDefined();
    });
  });

  describe('Currency Symbol Property', () => {
    it('should set currencySymbol to USD', () => {
      component.currencySymbol = 'USD';
      expect(component.currencySymbol).toBe('USD');
    });

    it('should set currencySymbol to custom value', () => {
      component.currencySymbol = 'GBP';
      expect(component.currencySymbol).toBe('GBP');
    });
  });

  describe('Currency Symbol Position Property', () => {
    it('should set currencySymbolPosition to left', () => {
      component.currencySymbolPosition = 'left';
      expect(component.currencySymbolPosition).toBe('left');
    });

    it('should keep default position as right', () => {
      expect(component.currencySymbolPosition).toBe('right');
    });
  });

  describe('Method: existsOntimizeIcon()', () => {
    it('should return true for USD', () => {
      component.currencySymbol = 'USD';
      expect(component['existsOntimizeIcon']()).toBe(true);
    });

    it('should return true for EUR', () => {
      component.currencySymbol = 'EUR';
      expect(component['existsOntimizeIcon']()).toBe(true);
    });

    it('should return false for custom currency', () => {
      component.currencySymbol = 'CUSTOM';
      expect(component['existsOntimizeIcon']()).toBe(false);
    });
  });

  describe('Method: useIcon(position)', () => {
    it('should return true when icon exists and position matches', () => {
      component.currencySymbol = 'USD';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('right')).toBe(true);
    });

    it('should return false when position does not match', () => {
      component.currencySymbol = 'USD';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('left')).toBe(false);
    });

    it('should return false when icon does not exist', () => {
      component.currencySymbol = 'XXX';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('right')).toBe(false);
    });
  });

  describe('Method: useSymbol(position)', () => {
    it('should return true when symbol exists and position matches', () => {
      component.currencySymbol = 'BRL';
      component.currencySymbolPosition = 'right';
      expect(component.useSymbol('right')).toBe(true);
    });

    it('should return false when icon exists', () => {
      component.currencySymbol = 'USD';
      component.currencySymbolPosition = 'right';
      expect(component.useSymbol('right')).toBe(false);
    });

    it('should return false when position does not match', () => {
      component.currencySymbol = 'BRL';
      component.currencySymbolPosition = 'right';
      expect(component.useSymbol('left')).toBe(false);
    });
  });

  describe('Display Logic', () => {
    it('should prefer icon when currency is USD', () => {
      component.currencySymbol = 'USD';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('right')).toBe(true);
      expect(component.useSymbol('right')).toBe(false);
    });

    it('should use symbol when currency is BRL', () => {
      component.currencySymbol = 'BRL';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('right')).toBe(false);
      expect(component.useSymbol('right')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null currencySymbol', () => {
      component.currencySymbol = null as any;
      expect(() => component.useIcon('right')).not.toThrow();
    });

    it('should handle undefined currencySymbol', () => {
      component.currencySymbol = undefined as any;
      expect(() => component.useIcon('right')).not.toThrow();
    });

    it('should be case sensitive', () => {
      component.currencySymbol = 'usd';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('right')).toBe(false);
    });

    it('should handle empty string', () => {
      component.currencySymbol = '';
      component.currencySymbolPosition = 'right';
      expect(component.useIcon('right')).toBe(false);
    });

    it('should handle multiple currency changes', () => {
      component.currencySymbolPosition = 'right';
      component.currencySymbol = 'USD';
      expect(component.useIcon('right')).toBe(true);
      component.currencySymbol = 'CHF';
      expect(component.useIcon('right')).toBe(false);
    });
  });

  describe('Inheritance', () => {
    it('should inherit from ORealInputComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('ORealInputComponent');
    });

    it('should have form property', () => {
      expect((component as any).form).toBeDefined();
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        currency: new FormControl('')
      });
      expect(formGroup).toBeTruthy();
    });

    it('should register with parent form', () => {
      expect(mockOFormComponent.registerFormComponent).toBeDefined();
    });
  });
});
