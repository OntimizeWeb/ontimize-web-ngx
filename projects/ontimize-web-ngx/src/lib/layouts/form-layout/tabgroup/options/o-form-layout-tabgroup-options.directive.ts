import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { MatTabHeaderPosition, ThemePalette } from '@angular/material';

import { BooleanConverter } from '../../../../decorators/input-converter';
import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';

@Directive({
  selector: 'o-form-layout-tabgroup-options, o-form-layout-manager[mode="tab"]'
})
export class OFormLayoutTabGroupOptionsDirective {

  constructor(protected formLayoutManager: OFormLayoutManagerComponent) { }

  ngOnChanges() {
    if (this.formLayoutManager) {
      this.formLayoutManager.addTabGroupOptions(this.getOptions());
    }
  }

  @Input('background-color')
  public backgroundColor: ThemePalette;

  @Input()
  public color: ThemePalette;

  protected _disableAnimation: boolean = true;
  @Input('disable-animation')
  set disableAnimation(value: boolean) {
    this._disableAnimation = BooleanConverter(value);
  }

  @Input('header-position')
  public headerPosition: MatTabHeaderPosition;

  @Input()
  public icon: string;

  @Input('icon-position')
  public iconPosition: 'left' | 'right' = 'left';

  @Input('title-data-origin')
  public titleDataOrigin: string;

  @Input()
  public title: string;

  @Input('label-columns')
  public labelColumns: string;

  @Input()
  public separator: string;

  @ContentChild(TemplateRef, { static: false })
  templateMatTabLabel: TemplateRef<any>;

  getOptions() {
    const result = {
      backgroundColor: this.backgroundColor,
      color: this.color,
      headerPosition: this.headerPosition,
      disableAnimation: this.disableAnimation,
      icon: this.icon,
      iconPosition: this.iconPosition,
      titleDataOrigin: this.titleDataOrigin,
      title: this.title,
      labelColumns: this.labelColumns,
      separator: this.separator
    }
    // Deleting undefined properties
    Object.keys(result).forEach(key => result[key] == null ? delete result[key] : {});
    return result;
  }
}
