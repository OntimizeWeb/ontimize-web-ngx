import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OContainerComponent } from '../o-container-component.class';


@Component({
  standalone: true,
  imports: [NgStyle, MatIconModule, OTranslatePipe],
  selector: 'o-row',
  templateUrl: './o-row.component.html',
  styleUrls: ['./o-row.component.scss'],
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
