import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';

export const DEFAULT_INPUTS_O_ROW = [
  ...DEFAULT_INPUTS_O_CONTAINER
];

@Component({
  selector: 'o-row',
  templateUrl: './o-row.component.html',
  styleUrls: ['./o-row.component.scss'],
  inputs: DEFAULT_INPUTS_O_ROW,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-row]': 'true',
    '[class.o-appearance-outline]': 'isAppearanceOutline()',
    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
  }
})
export class ORowComponent extends OContainerComponent {

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(elRef, injector, matFormDefaultOption);
  }

}
