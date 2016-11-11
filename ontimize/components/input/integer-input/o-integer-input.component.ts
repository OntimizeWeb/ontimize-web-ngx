import {Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {FormControl } from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';
import { OSharedModule } from '../../../shared.module';
import {OFormComponent} from '../../form/o-form.component';
import {InputConverter} from '../../../decorators';
import {OTextInputModule, OTextInputComponent, DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT} from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'min',
  'max',
  'step'
];

export const DEFAULT_OUTPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-integer-input',
  templateUrl: '/input/integer-input/o-integer-input.component.html',
  styleUrls: ['/input/integer-input/o-integer-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_INTEGER_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_INTEGER_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OIntegerInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_INTEGER_INPUT = DEFAULT_INPUTS_O_INTEGER_INPUT;
  public static DEFAULT_OUTPUTS_O_INTEGER_INPUT = DEFAULT_OUTPUTS_O_INTEGER_INPUT;

  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number = 1;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    if (typeof(this.min) !== 'undefined') {
      validators.push(this.minValidator.bind(this));
    }
    if (typeof(this.max) !== 'undefined') {
      validators.push(this.maxValidator.bind(this));
    }
    return validators;
  }

  protected minValidator(control: FormControl) {
    if ((typeof(control.value) === 'number') && (control.value < this.min)) {
      return {
        'min': {
          'requiredMin' : this.min
        }
      };
    }
  }

  protected maxValidator(control: FormControl) {
    if ((typeof(control.value) === 'number') && (this.max < control.value)) {
      return {
        'max': {
          'requiredMax' : this.max
        }
      };
    }
  }

}


@NgModule({
  declarations: [OIntegerInputComponent],
  imports: [OSharedModule, OTextInputModule],
  exports: [OIntegerInputComponent, OTextInputModule],
})
export class OIntegerInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OIntegerInputModule,
      providers: []
    };
  }
}
