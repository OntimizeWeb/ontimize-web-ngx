import { Component, ElementRef, forwardRef, Injector, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';


import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OBooleanFormDataComponent } from '../o-boolean-form-data-component.class';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_CHECKBOX = [
  // color: Theme color palette for the component.
  'color',
  // label-position: Whether the label should appear after or before the slide-toggle. Defaults to 'after'
  'labelPosition: label-position'
];


@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-checkbox',
  inputs: DEFAULT_INPUTS_O_CHECKBOX,
  templateUrl: './o-checkbox.component.html',
  styleUrls: ['./o-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OCheckboxComponent), multi: true }],
  host: {
    '[class.o-checkbox]': 'true'
  }
})
export class OCheckboxComponent extends OBooleanFormDataComponent {

  public color: ThemePalette;
  public labelPosition: 'before' | 'after' = 'after';

  constructor(
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
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
