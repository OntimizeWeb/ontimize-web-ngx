import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import * as lpn from 'google-libphonenumber';

import { FormValueOptions } from '../../../types/form-value-options.type';
import { Util } from '../../../util/util';
import { OValidators } from '../../../validators/o-validators';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent
} from '../../o-form-data-component.class';
import { OFormControl } from '../o-form-control.class';
import { CountryCode } from './data/country-code';
import { CountryISO } from './enums/country-iso.enum';
import { PhoneNumberFormat } from './enums/phone-number-format.enum';
import { OPhoneInputData } from './interfaces/change-data';
import { Country } from './model/country.model';

export const DEFAULT_INPUTS_O_PHONE_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_PHONE_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  selector: 'o-phone-input',
  templateUrl: './o-phone-input.component.html',
  styleUrls: ['./o-phone-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_PHONE_INPUT,
  outputs: DEFAULT_OUTPUTS_O_PHONE_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [CountryCode]
})
export class OPhoneInputComponent extends OFormDataComponent implements OnInit {
  @Input() countries: Array<string> = [];
  @Output() readonly countryChange = new EventEmitter<Country>();
  @Output() readonly onPhoneDataChange = new EventEmitter<OPhoneInputData>();

  @ViewChild('countryList', { static: false }) countryList: ElementRef;
  @ViewChild('matInputRef', { read: ElementRef, static: true }) private matInputRef!: ElementRef;

  _selectedCountry: Country = {
    areaCodes: undefined,
    dialCode: '',
    htmlId: '',
    flagClass: '',
    iso2: '',
    name: '',
    placeHolder: '',
    priority: 0,
  };

  set selectedCountry(value: Country) {
    this._selectedCountry = value;
    this.placeHolder = this.resolvePlaceholder();
  }

  get selectedCountry(): Country {
    return this._selectedCountry;
  }

  allCountries: Array<Country> = [];

  states = CountryISO;
  selectedStates = this.states;

  // Has to be 'any' to prevent a need to install @types/google-libphonenumber by the package user...
  protected phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  protected separateDialCode = true;
  protected numberFormat: PhoneNumberFormat = PhoneNumberFormat.International;

  constructor(
    private countryCodeData: CountryCode,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.initializeCountryData();
  }

  initialize(): void {
    super.initialize();
    const formControl = this.getFormControl() as OFormControl;
    if (formControl) {
      const self = this;
      formControl.getValue = function () {
        if (this.value && this.value.length > 0 && self.selectedCountry && self.selectedCountry.dialCode) {
          return `+${self.selectedCountry.dialCode} ${this.value}`;
        }
        return undefined;
      };
    }
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    const createPhoneValidator = (() => {
      return OValidators.phoneValidator(this.getFormControl(), this.getSelectedCountryIso2());
    });
    validators.push(createPhoneValidator);
    return validators;
  }

  onFormControlChange(value: any): void {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(value);
    this.ensurePhoneValue(value);
    this.onChange.emit(value);
  }

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    let { countryDialCode, number } = this.getSeparatedValues(val);
    let country = this.getCountryByDialCode(countryDialCode);
    const parsed = this.getParsedNumber(number, country ? country.iso2 : undefined);
    if (!Util.isDefined(parsed)) {
      number = undefined;
      country = undefined;
    }
    this.selectedCountry = country;
    this.ensureOFormValue(number);
    if (this._fControl) {
      this._fControl.setValue(this.value.value, options);
      if (setDirty) {
        this._fControl.markAsDirty();
      }
      if (this._fControl.invalid && !this.form.isInInsertMode()) {
        this._fControl.markAsTouched();
      }
    }
    this.oldValue = this.value.value;
  }

  onCountrySelect(value: MatSelectChange) {
    const country: Country = value.value
    this.countryChange.emit(country);
    this.setValue(undefined);
    this.selectedCountry = country;
    if (this.matInputRef && this.matInputRef.nativeElement) {
      setTimeout(() => {
        this.matInputRef.nativeElement.focus();
      }, 0)
    }
  }

  public innerOnBlur(event: any): void {
    super.innerOnBlur(event);
    if (this._fControl) {
      this._fControl.updateValueAndValidity();
    }
  }

  protected getSelectedCountryIso2(): string {
    return this.selectedCountry ? this.selectedCountry.iso2 : undefined;
  }

  protected initializeCountryData() {
    this.fetchCountryData();

    if (this.countries.length) {
      this.allCountries = this.allCountries.filter((c) => this.countries.includes(c.iso2));
    }
  }

  protected ensurePhoneValue(value: any): void {
    const number = this.getParsedNumber(value, this.getSelectedCountryIso2());
    if (number) {
      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';
      if (intlNo) {
        this.value.value = this.removeDialCode(intlNo);
        this.emitPhoneInputData(intlNo, number);
      }
    }
  }

  protected getCountryByDialCode(countryDialCode: any): Country {
    if (countryDialCode) {
      return this.allCountries
        .sort((a, b) => {
          return a.priority - b.priority;
        })
        .find((c) => c.dialCode === countryDialCode);
    }
    return undefined;
  }

  protected getSeparatedValues(value: any): { countryDialCode: string, number: string } {
    let countryDialCode = ''
    let number = (value instanceof OFormValue ? value.value : value) || undefined
    if (Util.isDefined(number) && number.startsWith('+')) {
      countryDialCode = number.substr(1, number.indexOf(' ') - 1);
      number = number.substr(countryDialCode.length + 2);
    }
    return { countryDialCode, number }
  }

  protected emitPhoneInputData(intlNo?: string, number?: string): void {
    let phoneInputData: OPhoneInputData = undefined;
    const iso2 = this.getSelectedCountryIso2();
    if (intlNo && number && iso2) {
      phoneInputData = {
        number: this.value.value,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: iso2.toUpperCase(),
        dialCode: '+' + this.selectedCountry.dialCode,
      }
    }
    this.onPhoneDataChange.emit(phoneInputData);
  }

  /* --------------------------------- Helpers -------------------------------- */
  /**
   * Returns parse PhoneNumber object.
   * @param phoneNumber string
   * @param countryCode string
   */
  private getParsedNumber(
    phoneNumber: string,
    countryCode: string
  ): lpn.PhoneNumber {
    let number: lpn.PhoneNumber;
    try {
      number = this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
    } catch (e) { }
    return number;
  }

  /**
   * Cleans dialcode from phone number string.
   * @param phoneNumber string
   */
  private removeDialCode(phoneNumber: string): string {
    const number = this.getParsedNumber(phoneNumber, this.getSelectedCountryIso2());
    phoneNumber = this.phoneUtil.format(
      number,
      lpn.PhoneNumberFormat[this.numberFormat]
    );
    if (phoneNumber.startsWith('+') && this.separateDialCode) {
      phoneNumber = phoneNumber.substr(phoneNumber.indexOf(' ') + 1);
    }
    return phoneNumber;
  }

  /**
   * Sifts through all countries and returns iso code of the primary country
   * based on the number provided.
   * @param countryCode country code in number format
   * @param number PhoneNumber object
   */
  private getCountryIsoCode(
    countryCode: number,
    number: lpn.PhoneNumber
  ): string | undefined {
    // Will use this to match area code from the first numbers
    const rawNumber = number['values_']['2'].toString();
    // List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
    const countries = this.allCountries.filter(
      (c) => c.dialCode === countryCode.toString()
    );
    // Main country is the country, which has no areaCodes specified in country-code.ts file.
    const mainCountry = countries.find((c) => c.areaCodes === undefined);
    // Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
    const secondaryCountries = countries.filter((c) => c.areaCodes !== undefined);
    let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;

    /*
      Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
      If no matches found, fallback to the main country.
    */
    secondaryCountries.forEach((country) => {
      country.areaCodes.forEach((areaCode) => {
        if (rawNumber.startsWith(areaCode)) {
          matchedCountry = country.iso2;
        }
      });
    });

    return matchedCountry;
  }

  /**
   * Gets formatted example phone number from phoneUtil.
   * @param countryCode string
   */
  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(
        this.phoneUtil.getExampleNumber(countryCode),
        lpn.PhoneNumberFormat[this.numberFormat]
      );
    } catch (e) {
      return e;
    }
  }

  /**
   * Clearing the list to avoid duplicates (https://github.com/webcat12345/ngx-intl-tel-input/issues/248)
   */
  protected fetchCountryData(): void {
    this.allCountries = [];

    this.countryCodeData.allCountries.forEach((c) => {
      const country: Country = {
        name: c[0].toString(),
        iso2: c[1].toString(),
        dialCode: c[2].toString(),
        priority: +c[3] || 0,
        areaCodes: (c[4] as string[]) || undefined,
        htmlId: `iti-0__item-${c[1].toString()}`,
        flagClass: `iti__${c[1].toString().toLocaleLowerCase()}`,
        placeHolder: '',
      };
      if (!this.oplaceholder) {
        country.placeHolder = this.getPhoneNumberPlaceHolder(
          country.iso2.toUpperCase()
        );
      }
      this.allCountries.push(country);
    });
  }

  private resolvePlaceholder(): string {
    // If the user defined its own placeholder using that input it will override any country placeholder
    let placeholder = '';
    if (this.selectedCountry && this.selectedCountry.placeHolder && this.selectedCountry.placeHolder.length > 0) {
      placeholder = this.selectedCountry.placeHolder;
      if (this.separateDialCode) {
        placeholder = this.removeDialCode(placeholder);
      }
    }
    return placeholder;
  }
}
