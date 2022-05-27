import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import * as lpn from 'google-libphonenumber';

import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent
} from '../../o-form-data-component.class';
import { CountryCode } from './data/country-code';
import { CountryISO } from './enums/country-iso.enum';
import { PhoneNumberFormat } from './enums/phone-number-format.enum';
import { ChangeData } from './interfaces/change-data';
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
export class OPhoneInputComponent extends OFormDataComponent implements OnInit, OnChanges {
  @Input() countries: Array<string> = [];

  @Output() readonly countryChange = new EventEmitter<Country>();

  @ViewChild('countryList', { static: false }) countryList: ElementRef;

  selectedCountry: Country = {
    areaCodes: undefined,
    dialCode: '',
    htmlId: '',
    flagClass: '',
    iso2: '',
    name: '',
    placeHolder: '',
    priority: 0,
  };

  allCountries: Array<Country> = [];

  states = CountryISO;
  propagateChange = (_: ChangeData) => { };
  selectedStates = this.states;

  // Has to be 'any' to prevent a need to install @types/google-libphonenumber by the package user...
  protected phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
  protected phoneNumber = '';
  protected separateDialCode = true;
  protected numberFormat: PhoneNumberFormat = PhoneNumberFormat.International;
  protected enableAutoCountrySelect = true;

  constructor(
    private countryCodeData: CountryCode,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  get placeHolder(): string {
    return this.resolvePlaceholder();
  }

  set placeHolder(value: string) {
    this.oplaceholder = value;
  }

  ngOnInit() {
    super.initialize();
    this.initializePhoneData();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    // Inject phone validator

    const createPhoneValidator = (() => {
      const result = OValidators.phoneValidator(this.getFormControl(), this.selectedCountry)
      return result
    })

    validators.push(createPhoneValidator);
    return validators;
  }

  /*
    This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
    Ref: http://codelyzer.com/rules/no-life-cycle-call/
  */
  protected initializePhoneData() {
    this.fetchCountryData();

    if (this.countries.length) {
      this.allCountries = this.allCountries.filter((c) => this.countries.includes(c.iso2));
    }
  }

  protected setSelectedCountry(country: Country) {
    this.selectedCountry = country;
    this.countryChange.emit(country);
  }

  public onPhoneNumberChange(): void {
    let countryCode: string | undefined;
    // Handle the case where the user sets the value programatically based on a persisted ChangeData obj.
    if (this.phoneNumber && typeof this.phoneNumber === 'object') {
      const numberObj: ChangeData = this.phoneNumber;
      this.phoneNumber = numberObj.number;
      countryCode = numberObj.countryCode;
    }
    countryCode = countryCode || this.selectedCountry.iso2;
    const number = this.getParsedNumber(this.phoneNumber, countryCode);

    // auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
    if (this.enableAutoCountrySelect) {
      countryCode =
        number && number.getCountryCode()
          ? this.getCountryIsoCode(number.getCountryCode(), number)
          : this.selectedCountry.iso2;
      if (countryCode && countryCode !== this.selectedCountry.iso2) {
        const newCountry = this.allCountries
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .find((c) => c.iso2 === countryCode);
        if (newCountry) {
          this.selectedCountry = newCountry;
        }
      }
    }
    countryCode = countryCode ? countryCode : this.selectedCountry.iso2;

    if (!this.value) {
      // Reason: avoid https://stackoverflow.com/a/54358133/1617590
      // tslint:disable-next-line: no-null-keyword
      this.propagateChange(null);
    } else {
      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';

      // parse phoneNumber if separate dial code is needed
      if (this.separateDialCode && intlNo) {
        this.value.value = this.removeDialCode(intlNo);
      }

      this.propagateChange({
        number: this.value.value,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: countryCode.toUpperCase(),
        dialCode: '+' + this.selectedCountry.dialCode,
      });
    }
  }

  public onCountrySelect(change: MatSelectChange): void {
    this.setSelectedCountry(change.value);

    if (this.phoneNumber && this.phoneNumber.length > 0) {

      const number = this.getParsedNumber(
        this.phoneNumber,
        this.selectedCountry.iso2
      );
      const intlNo = number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
        : '';
      // parse phoneNumber if separate dial code is needed
      if (this.separateDialCode && intlNo) {
        this.value.value = this.removeDialCode(intlNo);
      }

      this.propagateChange({
        number: this.value.value,
        internationalNumber: intlNo,
        nationalNumber: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
          : '',
        e164Number: number
          ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
          : '',
        countryCode: this.selectedCountry.iso2.toUpperCase(),
        dialCode: '+' + this.selectedCountry.dialCode,
      });
    } else {
      // Reason: avoid https://stackoverflow.com/a/54358133/1617590
      // tslint:disable-next-line: no-null-keyword
      this.propagateChange(null);
    }

    // el.focus();
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedChars = /[0-9\+\-\(\)\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  ensureOFormValue(obj: any): void {
    super.ensureOFormValue(obj);
    if (obj === undefined) {
      this.initializePhoneData();
    }
    this.phoneNumber = obj;
    setTimeout(() => {
      this.onPhoneNumberChange();
    }, 1);
  }

  // getFlagClass(lang: string) {
  //   let flagName = LocaleCode.getCountryCode(lang);
  //   flagName = (flagName !== 'en') ? flagName : 'gb';
  //   return 'flag-icon-' + flagName;
  // }

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
    const number = this.getParsedNumber(phoneNumber, this.selectedCountry.iso2);
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
    if (this.oplaceholder) {
      placeholder = this.oplaceholder;
    } else if (this.selectedCountry.placeHolder.length) {
      placeholder = this.selectedCountry.placeHolder;
      if (this.separateDialCode) {
        placeholder = this.removeDialCode(placeholder);
      }
    }
    return placeholder;
  }
}
