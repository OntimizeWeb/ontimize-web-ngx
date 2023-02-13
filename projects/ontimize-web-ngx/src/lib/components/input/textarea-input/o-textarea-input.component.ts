import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT,
  OTextInputComponent,
} from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_TEXTAREA_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'columns',
  'rows'
];

export const DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-textarea-input',
  templateUrl: './o-textarea-input.component.html',
  styleUrls: ['./o-textarea-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXTAREA_INPUT,
  outputs: DEFAULT_OUTPUTS_O_TEXTAREA_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OTextareaInputComponent extends OTextInputComponent {

  @InputConverter()
  public rows: number = 5;
  @InputConverter()
  public columns: number = 3;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  public isResizable(): boolean {
    let resizable = true;
    if (!this.enabled || this.isReadOnly) {
      resizable = false;
    }
    return resizable;
  }

}
