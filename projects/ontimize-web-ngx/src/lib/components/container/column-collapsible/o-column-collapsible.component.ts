import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import {
  OContainerCollapsibleComponent
} from '../o-container-collapsible-component.class';


@Component({
  standalone: true,
  imports: [NgStyle, MatExpansionModule, MatIconModule, OTranslatePipe],
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
