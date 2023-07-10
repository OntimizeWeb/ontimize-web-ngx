import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field';

import {
  DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE,
  DEFAULT_OUTPUTS_O_CONTAINER_COLLAPSIBLE,
  OContainerCollapsibleComponent
} from '../o-container-collapsible-component.class';


@Component({
  selector: 'o-row-collapsible',
  templateUrl: './o-row-collapsible.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-row-collapsible]': 'true',
    '[class.o-appearance-outline]': 'isAppearanceOutline()',
    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
  }
})
export class ORowCollapsibleComponent extends OContainerCollapsibleComponent {

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(elRef, injector, matFormDefaultOption);
  }

}
