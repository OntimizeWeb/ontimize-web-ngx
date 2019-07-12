import { Component, ContentChild, forwardRef, Inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatTabHeaderPosition } from '@angular/material';
import { InputConverter } from '../../../../decorators/input-converter';
import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP_OPTIONS = [
  'backgroundColor:background-color',
  'color',
  'headerPosition:header-position',
  'disableAnimation:disable-animation',
  'icon',
  'iconPosition:icon-position'
];

@Component({
  moduleId: module.id,
  selector: 'o-form-layout-tabgroup-options',
  template: ' ',
  encapsulation: ViewEncapsulation.None,
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP_OPTIONS,
  host: {
    '[class.o-form-layout-tabgroup-options]': 'true'
  }
})
export class OFormLayoutTabGroupOptionsComponent {
  constructor(@Inject(forwardRef(() => OFormLayoutManagerComponent)) protected oFormLayoutManager: OFormLayoutManagerComponent) { }


  public backgroundColor;
  public color;

  @InputConverter()
  public disableAnimation: boolean;

  public headerPosition: MatTabHeaderPosition;

  @ContentChild(TemplateRef)
  templateMatTabLabel: TemplateRef<any>;

  public icon: string;
  public iconPosition: 'left' | 'right' = 'left';
}
