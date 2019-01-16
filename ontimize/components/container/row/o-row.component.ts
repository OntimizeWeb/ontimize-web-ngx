import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';

import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/form-components';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';

export const DEFAULT_INPUTS_O_ROW = [
  ...DEFAULT_INPUTS_O_CONTAINER
];

@Component({
  moduleId: module.id,
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

  public static DEFAULT_INPUTS_O_ROW = DEFAULT_INPUTS_O_ROW;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(form, elRef, injector, matFormDefaultOption);
  }

}

@NgModule({
  declarations: [ORowComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ORowComponent]
})
export class ORowModule { }
