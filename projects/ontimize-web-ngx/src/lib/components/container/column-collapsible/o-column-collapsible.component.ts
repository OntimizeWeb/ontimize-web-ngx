import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import {
  OContainerCollapsibleComponent
} from '../o-container-collapsible-component.class';


@Component({
  selector: 'o-column-collapsible',
  templateUrl: './o-column-collapsible.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-column-collapsible]': 'true',
    '[class.o-appearance-outline]': 'isAppearanceOutline()',
    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
  }
})
export class OColumnCollapsibleComponent extends OContainerCollapsibleComponent {

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(elRef, injector, matFormDefaultOption);
  }

}
