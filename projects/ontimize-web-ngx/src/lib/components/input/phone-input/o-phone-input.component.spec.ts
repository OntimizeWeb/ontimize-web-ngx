import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OValidators } from '../../../validators/o-validators';
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

  describe('Method: initialize()', () => {
    it('should initialize without errors', () => {
      expect(() => {
        component.initialize();
      }).not.toThrow();
    });

    it('should filter allCountries when countries input is set before initialize', () => {
      component.countries = ['US', 'GB'];
      component.initialize();
      const isos = component.allCountries.map((c: any) => c.iso2);
      expect(isos.every((iso: string) => ['US', 'GB'].includes(iso))).toBe(true);
    });

    it('should keep all countries when countries input is empty', () => {
      component.countries = [];
      const beforeCount = component.allCountries.length;
      component.initialize();
      expect(component.allCountries.length).toBe(beforeCount);
    });
  });

  describe('Method: getValue()', () => {
    it('should return undefined when form control has no value', () => {
      component.initialize();
      const value = component.getValue();
      expect(value === undefined || value === null || value === '').toBeTruthy();
    });

    it('should call getFormControl getValue when available', () => {
      component.initialize();
      component.selectedCountry = {
        areaCodes: undefined,
        dialCode: '1',
        htmlId: 'iti-0__item-us',
        flagClass: 'iti__us',
        iso2: 'US',
        name: 'United States',
        placeHolder: '(201) 555-0123',
        priority: 0
      };
      const fc = component.getFormControl();
      if (fc) {
        fc.setValue('2015550123');
        const result = component.getValue();
        expect(result).toBe('+1 2015550123');
      }
    });

    it('should return undefined from formControl.getValue when value is empty', () => {
      component.initialize();
      const fc = component.getFormControl();
      if (fc) {
        fc.setValue('');
        const result = component.getValue();
        expect(result === undefined || result === null || result === '').toBeTruthy();
      }
    });
  });

  describe('Method: onFormControlChange()', () => {
    it('should call onChange emit', () => {
      component.initialize();
      spyOn(component.onChange, 'emit');
      component.onFormControlChange('test');
      expect(component.onChange.emit).toHaveBeenCalledWith('test');
    });

    it('should not throw when value is undefined', () => {
      component.initialize();
      expect(() => component.onFormControlChange(undefined)).not.toThrow();
    });

    it('should not throw when value is null', () => {
      component.initialize();
      expect(() => component.onFormControlChange(null)).not.toThrow();
    });

    it('should initialize value object when value is undefined', () => {
      component.initialize();
      (component as any).value = undefined;
      expect(() => component.onFormControlChange('newValue')).not.toThrow();
      expect((component as any).value).toBeDefined();
    });
  });

  describe('Method: setFormValue()', () => {
    it('should set selectedCountry based on dial code in value', () => {
      component.initialize();
      (component as any).setFormValue('+1 2015550123');
      expect(component.selectedCountry).toBeDefined();
    });

    it('should handle undefined value without throwing', () => {
      component.initialize();
      expect(() => (component as any).setFormValue(undefined)).not.toThrow();
    });

    it('should handle value without + prefix', () => {
      component.initialize();
      expect(() => (component as any).setFormValue('2015550123')).not.toThrow();
    });

    it('should handle invalid phone number gracefully', () => {
      component.initialize();
      expect(() => (component as any).setFormValue('+999 000000000')).not.toThrow();
    });

    it('should reset selectedCountry when number is not parseable', () => {
      component.initialize();
      (component as any).setFormValue('+999 000000000');
      expect(component.selectedCountry).toBeUndefined();
    });
  });

  describe('Method: onCountrySelect()', () => {
    it('should emit countryChange with selected country', () => {
      component.initialize();
      spyOn(component.countryChange, 'emit');
      const country = component.allCountries.find((c: any) => c.iso2 === 'us');
      component.onCountrySelect({ value: country });
      expect(component.countryChange.emit).toHaveBeenCalledWith(country);
    });

    it('should update selectedCountry', () => {
      component.initialize();
      const country = component.allCountries.find((c: any) => c.iso2 === 'gb');
      component.onCountrySelect({ value: country });
      expect(component.selectedCountry).toEqual(country);
    });

    it('should call setValue with undefined after country select', () => {
      component.initialize();
      spyOn(component, 'setValue');
      const country = component.allCountries[0];
      component.onCountrySelect({ value: country });
      expect(component.setValue).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Method: innerOnBlur()', () => {
    it('should call updateValueAndValidity on form control', () => {
      component.initialize();
      const fControl = component.getFormControl();
      if (fControl) {
        spyOn(fControl, 'updateValueAndValidity');
        component.innerOnBlur({ target: {} });
        expect(fControl.updateValueAndValidity).toHaveBeenCalledWith({ emitEvent: false });
      }
    });

    it('should not throw when called without fControl', () => {
      component.initialize();
      (component as any)._fControl = null;
      expect(() => component.innerOnBlur({ target: {} })).not.toThrow();
    });
  });

  describe('Method: ensurePhoneValue()', () => {
    it('should not throw for a valid US number', () => {
      component.initialize();
      component.selectedCountry = component.allCountries.find((c: any) => c.iso2 === 'us');
      (component as any).value = { value: '' };
      expect(() => (component as any).ensurePhoneValue('2015550123')).not.toThrow();
    });

    it('should not throw for undefined value', () => {
      component.initialize();
      expect(() => (component as any).ensurePhoneValue(undefined)).not.toThrow();
    });

    it('should not throw for unparseable value', () => {
      component.initialize();
      component.selectedCountry = component.allCountries.find((c: any) => c.iso2 === 'us');
      (component as any).value = { value: '' };
      expect(() => (component as any).ensurePhoneValue('abc')).not.toThrow();
    });
  });

  describe('Method: emitPhoneInputData()', () => {
    it('should emit undefined when arguments are missing', () => {
      component.initialize();
      spyOn(component.onPhoneDataChange, 'emit');
      (component as any).emitPhoneInputData(undefined, undefined);
      expect(component.onPhoneDataChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should emit phone data with full parameters', () => {
      component.initialize();
      component.selectedCountry = component.allCountries.find((c: any) => c.iso2 === 'us');
      (component as any).value = (component as any).value || { value: '201-555-0123' };
      spyOn(component.onPhoneDataChange, 'emit');
      const phoneUtil = (component as any).phoneUtil;
      const number = phoneUtil.parse('2015550123', 'US');
      const intlNo = phoneUtil.format(number, 1 /* INTERNATIONAL */);
      (component as any).emitPhoneInputData(intlNo, number);
      expect(component.onPhoneDataChange.emit).toHaveBeenCalled();
      const emitted = (component.onPhoneDataChange.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emitted).toBeDefined();
      expect(emitted.countryCode).toBe('US');
      expect(emitted.dialCode).toBe('+1');
    });

    it('should emit undefined when iso2 is not defined', () => {
      component.initialize();
      component.selectedCountry = {
        areaCodes: undefined, dialCode: '', htmlId: '', flagClass: '', iso2: '', name: '', placeHolder: '', priority: 0
      };
      spyOn(component.onPhoneDataChange, 'emit');
      (component as any).emitPhoneInputData('+1 201-555-0123', {});
      expect(component.onPhoneDataChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Method: resolveValidators()', () => {
    it('should return an array of validators', () => {
      component.initialize();
      const validators = component.resolveValidators();
      expect(Array.isArray(validators)).toBe(true);
      expect(validators.length).toBeGreaterThan(0);
    });

    it('should include the phone validator function', () => {
      component.initialize();
      const validators = component.resolveValidators();
      expect(validators.some((v: any) => typeof v === 'function')).toBe(true);
    });

    it('should call parent resolveValidators', () => {
      component.initialize();
      spyOn(Object.getPrototypeOf(Object.getPrototypeOf(component)), 'resolveValidators').and.callThrough();
      component.resolveValidators();
      expect(Object.getPrototypeOf(Object.getPrototypeOf(component)).resolveValidators).toHaveBeenCalled();
    });
  });

  describe('Phone Validator (OValidators.phoneValidator)', () => {
    it('should return empty errors for empty value', () => {
      const control = new UntypedFormControl('');
      const result = OValidators.phoneValidator(control, 'US');
      expect(result).toEqual({});
    });

    it('should return empty errors for null control', () => {
      const result = OValidators.phoneValidator(null as any, 'US');
      expect(result).toEqual({});
    });

    it('should return empty errors for a valid US number', () => {
      const control = new UntypedFormControl('2015550123');
      const result = OValidators.phoneValidator(control, 'US');
      expect(result).toEqual({});
    });

    it('should return error object for an invalid number', () => {
      const control = new UntypedFormControl('abc');
      const result = OValidators.phoneValidator(control, 'US');
      expect(result).toEqual({ validatePhoneNumber: { valid: false } });
    });

    it('should return error if number is not valid for region', () => {
      const control = new UntypedFormControl('0000000000');
      const result = OValidators.phoneValidator(control, 'US');
      expect(result).toBeTruthy();
    });
  });

  describe('Method: getPhoneNumberPlaceHolder()', () => {
    it('should return a non-empty string for a valid country code', () => {
      component.initialize();
      const placeholder = (component as any).getPhoneNumberPlaceHolder('US');
      expect(typeof placeholder).toBe('string');
      expect(placeholder.length).toBeGreaterThan(0);
    });

    it('should not throw for an invalid country code (catches exception)', () => {
      component.initialize();
      expect(() => (component as any).getPhoneNumberPlaceHolder('INVALID')).not.toThrow();
    });
  });

  describe('Method: initializeCountryData()', () => {
    it('should filter allCountries to provided countries list', () => {
      component.countries = ['es', 'fr'];
      (component as any).initializeCountryData();
      const isos = component.allCountries.map((c: any) => c.iso2);
      expect(isos.every((iso: string) => ['es', 'fr'].includes(iso))).toBe(true);
    });

    it('should not filter when countries list is empty', () => {
      component.countries = [];
      const countBefore = component.allCountries.length;
      (component as any).initializeCountryData();
      expect(component.allCountries.length).toBe(countBefore);
    });

    it('should result in empty array when no matching country is found', () => {
      component.countries = ['ZZ'];
      (component as any).initializeCountryData();
      expect(component.allCountries.length).toBe(0);
    });
  });

  describe('Integration', () => {
    it('should work with FormGroup', () => {
      const formGroup = new FormGroup({
        phone: new FormControl('')
      });
      expect(formGroup).toBeTruthy();
    });

    it('should resolve validators and use phone validator with FormControl', () => {
      component.initialize();
      component.selectedCountry = component.allCountries.find((c: any) => c.iso2 === 'us');
      const validators = component.resolveValidators();
      const formGroup = new FormGroup({
        phone: new FormControl('', validators)
      });
      expect(formGroup).toBeTruthy();
    });

    it('should reflect country change in countryChange event', () => {
      component.initialize();
      const emittedCountries: any[] = [];
      component.countryChange.subscribe((c: any) => emittedCountries.push(c));
      const de = component.allCountries.find((c: any) => c.iso2 === 'de');
      component.onCountrySelect({ value: de });
      expect(emittedCountries.length).toBe(1);
      expect(emittedCountries[0].iso2).toBe('de');
    });

    it('should have correct selectedCountry after setFormValue with valid number', () => {
      component.initialize();
      (component as any).setFormValue('+44 20 7946 0958');
      if (component.selectedCountry) {
        expect(component.selectedCountry.dialCode).toBe('44');
      }
    });
  });
});
