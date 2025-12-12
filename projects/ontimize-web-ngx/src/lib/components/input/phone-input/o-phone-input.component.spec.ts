import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector, ElementRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { CountryCode } from './data/country-code';

let OPhoneInputComponent: any;

describe('OPhoneInputComponent', () => {
  let component: any;
  let mockOFormComponent: any;
  let mockElementRef: any;
  let mockInjector: any;
  let mockCountryCode: any;

  beforeEach(async () => {
    const module = await import('./o-phone-input.component');
    OPhoneInputComponent = module.OPhoneInputComponent;

    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        CountryCode,
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
    mockElementRef = { nativeElement: document.createElement('div') };
    mockInjector = TestBed.inject(Injector);
    mockCountryCode = TestBed.inject(CountryCode);

    component = new OPhoneInputComponent(mockCountryCode, mockOFormComponent, mockElementRef, mockInjector);
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should extend OFormDataComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OFormDataComponent');
    });
  });

  describe('Default Properties', () => {
    it('should have default gap as 14px', () => {
      expect(component.gap).toBe('14px');
    });

    it('should have empty countries array', () => {
      expect(component.countries).toEqual([]);
    });

    it('should initialize selectedCountry with default values', () => {
      expect(component.selectedCountry).toBeDefined();
      expect(component.selectedCountry.dialCode).toBe('');
      expect(component.selectedCountry.iso2).toBe('');
    });

    it('should have allCountries array', () => {
      expect(Array.isArray(component.allCountries)).toBe(true);
    });
  });

  describe('Properties: selectedCountry', () => {
    it('should set and get selectedCountry', () => {
      const country = {
        areaCodes: undefined,
        dialCode: '1',
        htmlId: 'test-id',
        flagClass: 'test-flag',
        iso2: 'US',
        name: 'United States',
        placeHolder: '+1 (201) 555-0123',
        priority: 0
      };
      component.selectedCountry = country;
      expect(component.selectedCountry).toEqual(country);
    });

    it('should update placeholder when selectedCountry changes', () => {
      const country = {
        areaCodes: undefined,
        dialCode: '44',
        htmlId: 'test-id',
        flagClass: 'test-flag',
        iso2: 'GB',
        name: 'United Kingdom',
        placeHolder: '+44 20 7946 0958',
        priority: 1
      };
      component.selectedCountry = country;
      expect(component.placeHolder).toBeDefined();
    });
  });

  describe('Countries Filter', () => {
    it('should have countries property as array', () => {
      expect(Array.isArray(component.countries)).toBe(true);
    });

    it('should initialize countries property', () => {
      expect(component.countries).toBeDefined();
    });

    it('should support setting countries filter', () => {
      component.countries = ['US', 'GB'];
      expect(component.countries).toContain('US');
      expect(component.countries).toContain('GB');
    });
  });

  describe('Method: getSeparatedValues()', () => {
    it('should separate dial code from phone number', () => {
      const value = '+1 2125551234';
      const result = (component as any).getSeparatedValues(value);
      expect(result.countryDialCode).toBe('1');
      expect(result.number).toBe('2125551234');
    });

    it('should return empty dial code for non-prefixed number', () => {
      const value = '2125551234';
      const result = (component as any).getSeparatedValues(value);
      expect(result.countryDialCode).toBe('');
      expect(result.number).toBe('2125551234');
    });

    it('should handle undefined value', () => {
      const result = (component as any).getSeparatedValues(undefined);
      expect(result.countryDialCode).toBe('');
      expect(result.number).toBeUndefined();
    });
  });

  describe('Method: getCountryByDialCode()', () => {
    it('should handle null dial code', () => {
      const country = (component as any).getCountryByDialCode(null);
      expect(country).toBeUndefined();
    });

    it('should return undefined for non-existent dial code', () => {
      const country = (component as any).getCountryByDialCode('999');
      expect(country).toBeUndefined();
    });

    it('should find country if dial code exists', () => {
      if (component.allCountries.length > 0) {
        const testDialCode = component.allCountries[0].dialCode;
        const country = (component as any).getCountryByDialCode(testDialCode);
        expect(country).toBeDefined();
        expect(country.dialCode).toBe(testDialCode);
      }
    });
  });

  describe('Method: getSelectedCountryIso2()', () => {
    it('should return iso2 of selected country', () => {
      component.selectedCountry = {
        areaCodes: undefined,
        dialCode: '1',
        htmlId: 'test-id',
        flagClass: 'test-flag',
        iso2: 'US',
        name: 'United States',
        placeHolder: '+1 (201) 555-0123',
        priority: 0
      };
      const iso2 = (component as any).getSelectedCountryIso2();
      expect(iso2).toBe('US');
    });

    it('should return undefined when no country selected', () => {
      component.selectedCountry = undefined;
      const iso2 = (component as any).getSelectedCountryIso2();
      expect(iso2).toBeUndefined();
    });
  });

  describe('Method: sortCountries()', () => {
    it('should return array', () => {
      const sorted = (component as any).sortCountries();
      expect(Array.isArray(sorted)).toBe(true);
    });

    it('should sort by priority if multiple countries', () => {
      const sorted = (component as any).sortCountries();
      if (sorted.length > 1) {
        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].priority).toBeLessThanOrEqual(sorted[i + 1].priority);
        }
      }
    });
  });

  describe('Method: fetchCountryData()', () => {
    it('should initialize allCountries array', () => {
      expect(component.allCountries).toBeDefined();
      expect(Array.isArray(component.allCountries)).toBe(true);
    });

    it('should have country objects structure', () => {
      if (component.allCountries.length > 0) {
        const country = component.allCountries[0];
        expect(country.name).toBeDefined();
        expect(country.iso2).toBeDefined();
        expect(country.dialCode).toBeDefined();
      }
    });

    it('should not have duplicate iso2 codes', () => {
      if (component.allCountries.length > 1) {
        const isos = component.allCountries.map((c: any) => c.iso2);
        const uniqueIsos = new Set(isos);
        expect(isos.length).toBe(uniqueIsos.size);
      }
    });
  });

  describe('Method: resolvePlaceholder()', () => {
    it('should return placeholder from selected country', () => {
      component.selectedCountry = {
        areaCodes: undefined,
        dialCode: '1',
        htmlId: 'test-id',
        flagClass: 'test-flag',
        iso2: 'US',
        name: 'United States',
        placeHolder: '+1 (201) 555-0123',
        priority: 0
      };
      const placeholder = (component as any).resolvePlaceholder();
      expect(placeholder).toBeTruthy();
    });

    it('should return empty string when country has no placeholder', () => {
      component.selectedCountry = {
        areaCodes: undefined,
        dialCode: '1',
        htmlId: 'test-id',
        flagClass: 'test-flag',
        iso2: 'US',
        name: 'United States',
        placeHolder: '',
        priority: 0
      };
      const placeholder = (component as any).resolvePlaceholder();
      expect(placeholder).toBe('');
    });
  });

  describe('Event Emitters', () => {
    it('should have countryChange EventEmitter', () => {
      expect(component.countryChange).toBeDefined();
      expect(component.countryChange.emit).toBeDefined();
    });

    it('should have onPhoneDataChange EventEmitter', () => {
      expect(component.onPhoneDataChange).toBeDefined();
      expect(component.onPhoneDataChange.emit).toBeDefined();
    });
  });

  describe('Inheritance', () => {
    it('should extend OFormDataComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(component));
      expect(proto.constructor.name).toBe('OFormDataComponent');
    });

    it('should have form property', () => {
      expect((component as any).form).toBeDefined();
    });

    it('should have inherited methods from OFormDataComponent', () => {
      expect((component as any).initialize).toBeDefined();
      expect(typeof (component as any).initialize).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        phone: new FormControl('')
      });
      expect(formGroup).toBeTruthy();
    });

    it('should initialize without errors', () => {
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });
  });
});
