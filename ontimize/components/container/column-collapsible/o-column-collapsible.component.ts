import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';

import { OSharedModule } from '../../../shared/shared.module';
import { OFormComponent } from '../../form/form-components';
import { OContainerCollapsibleComponent } from '../o-container-collapsible-component.class';

export const DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE = [
  ...OContainerCollapsibleComponent.DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE
];

@Component({
  moduleId: module.id,
  selector: 'o-column-collapsible',
  templateUrl: './o-column-collapsible.component.html',
  styleUrls: ['./o-column-collapsible.component.scss'],
  inputs: DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-column-collapsible]': 'true',
    '[class.o-appearance-outline]': 'isAppearanceOutline()',
    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
  }
})
export class OColumnCollapsibleComponent extends OContainerCollapsibleComponent {

  public static DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE = DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE;

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
  declarations: [OColumnCollapsibleComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OColumnCollapsibleComponent]
})
export class OColumnCollapsibleModule { }
