import { Injector, QueryList } from '@angular/core';

import { O_MAT_ERROR_OPTIONS } from '../services/factories';
import { OMatErrorOptions, OMatErrorType } from '../types/o-mat-error.type';
import { Codes } from './codes';
import { Util } from './util';
import { AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { ErrorData } from '../types/error-data.type';
import { OValidatorComponent } from '../shared/components/validation/o-validator.component';
import { OMatErrorDirective } from '../directives/o-mat-error.directive';

export interface ComponentWithValidatorsAndErrorsData {
  errorOptions: OMatErrorOptions;
  errorsData: ErrorData[];
  validatorChildren: QueryList<OValidatorComponent>;
  oMatErrorChildren: QueryList<OMatErrorDirective>;
  tooltipPosition: string;
  getFormControl(): FormControl;
  resolveValidators: () => ValidatorFn[];
  resolveAsyncValidators: () => AsyncValidatorFn[];
  hasError: (error: string) => boolean;
}

export class ErrorsUtils {
  static getErrorOptions(injector: Injector): OMatErrorOptions {
    let result: OMatErrorOptions
    try {
      result = injector.get(O_MAT_ERROR_OPTIONS) || {};
    } catch (e) {
      result = {};
    }
    if (!Util.isDefined(result.type)) {
      result.type = Codes.O_MAT_ERROR_STANDARD as OMatErrorType;
    }
    return result;
  }

  static getErrorsTooltipText(comp: ComponentWithValidatorsAndErrorsData): string {
    let errorsText = [];
    if (comp.oMatErrorChildren && comp.oMatErrorChildren.length > 0) {
      errorsText.push(...comp.oMatErrorChildren
        .filter((oMatError: OMatErrorDirective) => Util.isDefined(oMatError.text))
        .map((oMatError: OMatErrorDirective) => oMatError.text));
    }
    if (comp.errorsData && comp.errorsData.length > 0) {
      errorsText.push(...comp.errorsData
        .filter((item: ErrorData) => comp.hasError(item.name))
        .map((item: ErrorData) => item.text));
    }
    return errorsText.join('\n');
  }

  static getTooltipClasses(comp: ComponentWithValidatorsAndErrorsData): string {
    let result: string = `o-tooltip ${comp.tooltipPosition}`;
    const liteError = comp.errorOptions.type === Codes.O_MAT_ERROR_LITE;
    if (!liteError) {
      return result
    }
    const formControl = comp.getFormControl();
    const errorClass = Util.isDefined(formControl) && Util.isDefined(formControl.errors) ? 'o-mat-error' : '';
    return `${result} ${errorClass}`;
  }

  static updateFormControlValidators(comp: ComponentWithValidatorsAndErrorsData): void {
    const formControl = comp.getFormControl();
    if (!formControl) {
      return;
    }
    formControl.clearValidators();
    const validators = comp.resolveValidators();
    const asyncValidators = comp.resolveAsyncValidators();
    if (comp.validatorChildren) {
      comp.validatorChildren.forEach((oValidator: OValidatorComponent) => {
        const validatorFunction: ValidatorFn = oValidator.getValidatorFn();
        if (validatorFunction) {
          validators.push(validatorFunction);
        }
        const asyncValidatorFunction: AsyncValidatorFn = oValidator.getAsyncValidatorFn();
        if (asyncValidatorFunction) {
          asyncValidators.push(asyncValidatorFunction);
        }
        const errorsData: ErrorData[] = oValidator.getErrorsData();
        comp.errorsData.push(...errorsData);
      });
    }
    formControl.setValidators(validators);
    formControl.setAsyncValidators(asyncValidators);
    formControl.updateValueAndValidity({ emitEvent: false });
  }

  static getActiveOErrors(comp: ComponentWithValidatorsAndErrorsData): ErrorData[] {
    if (comp.errorOptions.type === Codes.O_MAT_ERROR_STANDARD) {
      return comp.errorsData.filter((item: ErrorData) => comp.hasError(item.name));
    }
    return [];
  }

  static pushToErrorsData(comp: ComponentWithValidatorsAndErrorsData, newErrorsData: ErrorData[] = []): void {
    // avoid pushing repeated errors data
    comp.errorsData.push(...newErrorsData.filter(err => !comp.errorsData.find(existingError => existingError.name === err.name)));
  }
}

