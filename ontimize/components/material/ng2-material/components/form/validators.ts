import { FormControl,  AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';
import { Directive, forwardRef} from '@angular/core';
import { isNumber } from '../../core/util/util';

const PATTERN_VALIDATOR:any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MdPatternValidator),
  multi: true
};

@Directive({
  selector: '[mdPattern]',
  providers: [PATTERN_VALIDATOR],
  inputs: [
    'mdPattern'
  ]
})
export class MdPatternValidator implements Validator {

  mdPattern: string;

  /**
   * Returns a validator that checks to see if a string matches a given Regular Expression
   */
  static inline(pattern: string): any {
    return function validate(control: AbstractControl): { [key: string]: any } {
      if (control.value === '' || new RegExp(pattern).test(control.value)) {
        return null;
      }
      return {
        mdPattern: true
      };
    };
  }

  validate(control: FormControl): {[key: string]: any} {
    return MdPatternValidator.inline(this.mdPattern)(control);
  }
}

const MAXLENGTH_VALIDATOR:any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MdMaxLengthValidator),
  multi: true
};
@Directive({
  selector: '[mdMaxLength]',
  providers: [MAXLENGTH_VALIDATOR],
  inputs: [
    'mdMaxLength'
  ]
})
export class MdMaxLengthValidator implements Validator {

  mdMaxLength: string;

  /**
   * Returns a validator that checks for a maximum length of a string
   */
  static inline(length: number|string): any {
    return function validate(control: AbstractControl): { [key: string]: any } {
      if (!control.value || control.value.length <= length) {
        return null;
      }
      return {
        mdMaxLength: true
      };
    };
  }

  validate(control: FormControl): {[key: string]: any} {
    return MdMaxLengthValidator.inline(this.mdMaxLength)(control);
  }
}

const MAXVALUE_VALIDATOR:any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MdMaxValueValidator),
  multi: true
};
@Directive({
  selector: '[mdMax]',
  providers: [MAXVALUE_VALIDATOR],
  inputs: [
    'mdMax'
  ]
})
export class MdMaxValueValidator implements Validator {

  mdMax: string;

  /**
   * Returns a validator that checks for a maximum number value
   */
  static inline(length: number|string): any {
    return function validate(control: AbstractControl): { [key: string]: any } {
      if (isNaN(control.value) || control.value <= length) {
        return null;
      }
      return {
        mdMax: true
      };
    };
  }

  validate(control: FormControl): {[key: string]: any} {
    return MdMaxValueValidator.inline(this.mdMax)(control);
  }
}

const MINVALUE_VALIDATOR:any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MdMinValueValidator),
  multi: true
};
@Directive({
  selector: '[mdMin]',
  providers: [MINVALUE_VALIDATOR],
  inputs: [
    'mdMin'
  ]
})
export class MdMinValueValidator implements Validator {

  mdMin: string;

  /**
   * Returns a validator that checks for a minimum number value
   */
  static inline(length: number|string): any {
    return function validate(control: AbstractControl): { [key: string]: any } {
      if (isNaN(control.value) || control.value >= length) {
        return null;
      }
      return {
        mdMin: true
      };
    };
  }

  validate(control: FormControl): {[key: string]: any} {
    return MdMinValueValidator.inline(this.mdMin)(control);
  }
}

const NUMBER_REQUIRED_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MdNumberRequiredValidator),
  multi: true
};
@Directive({
  selector: '[mdNumberRequired]',
  providers: [NUMBER_REQUIRED_VALIDATOR]
})
export class MdNumberRequiredValidator implements Validator {
  /**
   * Returns a validator that checks for the existence of a truthy value
   */
  static inline(): any {
    return function validate(control: AbstractControl): { [key: string]: any } {
      let isNum = !isNaN(control.value) && isNumber(control.value);
      return isNum ? null : { mdNumberRequired: true };
    };
  }

  validate(control: FormControl): {[key: string]: any} {
    return MdNumberRequiredValidator.inline()(control);
  }
}

export const INPUT_VALIDATORS = [
  MdMaxLengthValidator,
  MdPatternValidator,
  MdMaxValueValidator,
  MdMinValueValidator,
  MdNumberRequiredValidator
];
