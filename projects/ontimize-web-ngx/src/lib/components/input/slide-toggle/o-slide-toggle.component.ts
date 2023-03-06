import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
} from '../../o-form-data-component.class';
import { OBooleanFormDataComponent } from '../o-boolean-form-data-component.class';


export const DEFAULT_INPUTS_O_SLIDETOGGLE = [
  // true-value: true value. Default: true.
  'trueValue: true-value',
  // false-value: false value. Default: false.
  'falseValue: false-value',
  // boolean-type [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type',
  // color: Theme color palette for the component.
  'color',
  // label-position: Whether the label should appear after or before the slide-toggle. Defaults to 'after'
  'labelPosition: label-position',
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_SLIDETOGGLE = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  selector: 'o-slide-toggle',
  inputs: DEFAULT_INPUTS_O_SLIDETOGGLE,
  outputs: DEFAULT_OUTPUTS_O_SLIDETOGGLE,
  templateUrl: './o-slide-toggle.component.html',
  styleUrls: ['./o-slide-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-slide-toggle]': 'true'
  }
})
export class OSlideToggleComponent extends OBooleanFormDataComponent {

  public color: ThemePalette;
  public labelPosition: 'before' | 'after' = 'after';

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }


  isChecked(): boolean {
    if (this.value instanceof OFormValue) {
      return this.value.value === this.trueValue;
    }
    return false;
  }

}
