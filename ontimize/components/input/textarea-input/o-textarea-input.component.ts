import {
  Component, Inject, Injector, forwardRef, ElementRef,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import {
  OTextInputModule, OTextInputComponent,
  DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT
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
  inputs: [
    ...DEFAULT_INPUTS_O_TEXTAREA_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TEXTAREA_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OTextareaInputComponent extends OTextInputComponent {

  public static DEFAULT_INPUTS_O_TEXTAREA_INPUT = DEFAULT_INPUTS_O_TEXTAREA_INPUT;
  public static DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = DEFAULT_OUTPUTS_O_TEXTAREA_INPUT;

  @InputConverter()
  rows: number = 5;
  @InputConverter()
  columns: number = 3;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  isResizable() {
    let resizable = true;
    if (this.isDisabled || this.isReadOnly) {
      resizable = false;
    }
    return resizable;
  }

}

@NgModule({
  declarations: [OTextareaInputComponent],
  imports: [OSharedModule, CommonModule, OTextInputModule],
  exports: [OTextareaInputComponent, OTextInputModule]
})
export class OTextareaInputModule {
}
