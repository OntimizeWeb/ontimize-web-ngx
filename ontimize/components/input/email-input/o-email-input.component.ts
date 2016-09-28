import {Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {ValidatorFn } from '@angular/forms/src/directives/validators';

import {OFormComponent} from '../../form/o-form.component';
import {OTextInputModule, OTextInputComponent, DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT} from '../text-input/o-text-input.component';
import {OValidators} from '../../../validators/o-validators';

export const DEFAULT_INPUTS_O_EMAIL_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT
];

export const DEFAULT_OUTPUTS_O_EMAIL_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-email-input',
  templateUrl: '/input/email-input/o-email-input.component.html',
  styleUrls: ['/input/email-input/o-email-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_EMAIL_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_EMAIL_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OEmailInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_EMAIL_INPUT = DEFAULT_INPUTS_O_EMAIL_INPUT;
  public static DEFAULT_OUTPUTS_O_EMAIL_INPUT = DEFAULT_OUTPUTS_O_EMAIL_INPUT;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    //Inject email validator
    validators.push(OValidators.emailValidator);
    return validators;
  }

}

@NgModule({
  declarations: [OEmailInputComponent],
  imports: [OTextInputModule],
  exports: [OEmailInputComponent, OTextInputModule],
})
export class OEmailInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OEmailInputModule,
      providers: []
    };
  }
}
