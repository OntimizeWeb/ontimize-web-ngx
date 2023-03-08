import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import {
  OTextInputComponent
} from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_PASSWORD_INPUT = [
  'showPasswordButton : show-password-button'
];

@Component({
  selector: 'o-password-input',
  templateUrl: './o-password-input.component.html',
  inputs: DEFAULT_INPUTS_O_PASSWORD_INPUT,
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
