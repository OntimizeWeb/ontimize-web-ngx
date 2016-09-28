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

export const DEFAULT_INPUTS_O_NIF_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT
];

export const DEFAULT_OUTPUTS_O_NIF_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-nif-input',
  templateUrl: '/input/nif-input/o-nif-input.component.html',
  styleUrls: ['/input/nif-input/o-nif-input.component.css'],
 inputs: [
    ...DEFAULT_INPUTS_O_NIF_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_NIF_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class ONIFInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_NIF_INPUT = DEFAULT_INPUTS_O_NIF_INPUT;
  public static DEFAULT_OUTPUTS_O_NIF_INPUT = DEFAULT_OUTPUTS_O_NIF_INPUT;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    //Inject NIF validator
    validators.push(OValidators.nifValidator);
    return validators;
  }

}

@NgModule({
  declarations: [ONIFInputComponent],
  imports: [OTextInputModule],
  exports: [ONIFInputComponent, OTextInputModule],
})
export class ONIFInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ONIFInputModule,
      providers: []
    };
  }
}
