import { Component, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms';
import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { IErrorData } from '../../o-form-data-component.class';
import { OErrorComponent } from './o-error.component';


export const DEFAULT_INPUTS_O_VALIDATOR = [
  'validatorFn: validator-function',
  'errorName: error-name',
  'errorText: error-text'
];

@Component({
  moduleId: module.id,
  selector: 'o-validator',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_VALIDATOR
})
export class OValidatorComponent {

  public static DEFAULT_INPUTS_O_VALIDATOR = DEFAULT_INPUTS_O_VALIDATOR;

  validatorFn: ValidatorFn = null;
  errorName: string;
  errorText: string;

  protected errorsData: IErrorData[] = [];

  constructor(
    protected injector: Injector
  ) {

  }

  registerError(oError: OErrorComponent) {
    this.errorsData.push({
      name: oError.getName(),
      text: oError.getText()
    });
  }

  getValidatorFn(): ValidatorFn {
    return this.validatorFn;
  }

  getErrorsData(): IErrorData[] {
    let result: IErrorData[] = [];
    if (this.errorsData.length > 0) {
      result = this.errorsData;
    } else if (Util.isDefined(this.errorName) && Util.isDefined(this.errorText)) {
      result = [{
        name: this.errorName,
        text: this.errorText
      }];
    }
    return result;
  }
}

@NgModule({
  declarations: [OValidatorComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OValidatorComponent]
})
export class OValidatorModule {
}
