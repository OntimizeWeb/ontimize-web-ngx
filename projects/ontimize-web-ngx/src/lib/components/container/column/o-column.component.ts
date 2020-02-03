import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';

import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';

export const DEFAULT_INPUTS_O_COLUMN = [
  ...DEFAULT_INPUTS_O_CONTAINER
];

@Component({
  moduleId: module.id,
  selector: 'o-column',
  templateUrl: './o-column.component.html',
  styleUrls: ['./o-column.component.scss'],
  inputs: DEFAULT_INPUTS_O_COLUMN,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-column]': 'true',
    '[class.o-appearance-outline]': 'isAppearanceOutline()',
    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
  }
})
export class OColumnComponent extends OContainerComponent {

  public static DEFAULT_INPUTS_O_COLUMN = DEFAULT_INPUTS_O_COLUMN;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(form, elRef, injector, matFormDefaultOption);
  }

}
