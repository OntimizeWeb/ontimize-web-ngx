import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import {
  DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE,
  DEFAULT_OUTPUTS_O_CONTAINER_COLLAPSIBLE,
  OContainerCollapsibleComponent
} from '../o-container-collapsible-component.class';


@Component({
  standalone: true,
  imports: [FlexLayoutModule, MatExpansionModule, MatIconModule, OTranslatePipe],
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
