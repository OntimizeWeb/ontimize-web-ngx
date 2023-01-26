import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT,
  OTextInputComponent
} from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_PASSWORD_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'showPasswordButton : show-password-button'
];

export const DEFAULT_OUTPUTS_O_PASSWORD_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-password-input',
  templateUrl: './o-password-input.component.html',
  inputs: DEFAULT_INPUTS_O_PASSWORD_INPUT,
  outputs: DEFAULT_OUTPUTS_O_PASSWORD_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OPasswordInputComponent extends OTextInputComponent implements OnInit {
  public hide: boolean = true;
  @InputConverter()
  public showPasswordButton: boolean = false;
  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

}
