import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { OFormComponent } from '../../form/o-form.component';
import { OBooleanFormDataComponent } from '../o-boolean-form-data-component.class';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_CHECKBOX = [
  // color: Theme color palette for the component.
  'color',
  // label-position: Whether the label should appear after or before the slide-toggle. Defaults to 'after'
  'labelPosition: label-position'
];


@Component({
  selector: 'o-checkbox',
  inputs: DEFAULT_INPUTS_O_CHECKBOX,
  templateUrl: './o-checkbox.component.html',
  styleUrls: ['./o-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-checkbox]': 'true'
  }
})
export class OCheckboxComponent extends OBooleanFormDataComponent {

  public color: ThemePalette;
  public labelPosition: 'before' | 'after' = 'after';

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  initialize() {
    super.initialize();

    // Override FormControl getValue in order to return the appropriate value instead of the checkbox internal boolean value
    const checkboxCtx = this;
    (this.getFormControl() as OFormControl).getValue = function () {
      return this.value ? checkboxCtx.trueValue : checkboxCtx.falseValue;
    };
  }

}
