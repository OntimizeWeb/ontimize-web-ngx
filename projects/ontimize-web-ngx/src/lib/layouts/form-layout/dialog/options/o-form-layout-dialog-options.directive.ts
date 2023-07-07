import { Directive, Input } from '@angular/core';
import { DialogPosition } from '@angular/material/dialog';

import { BooleanConverter } from '../../../../decorators/input-converter';
import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';

@Directive({
  selector: 'o-form-layout-dialog-options, o-form-layout-manager[mode="dialog"]'
})
export class OFormLayoutDialogOptionsDirective {

  constructor(protected formLayoutManager: OFormLayoutManagerComponent) { }

  ngOnChanges() {
    if (this.formLayoutManager) {
      this.formLayoutManager.addDialogOptions(this.getOptions());
    }
  }

  @Input()
  public width: string = '';

  @Input('min-width')
  public minWidth: number | string;

  @Input('max-width')
  public maxWidth: number | string;

  @Input()
  public height: string = '';

  @Input('min-height')
  public minHeight: number | string;

  @Input('max-height')
  public maxHeight: number | string;

  @Input()
  public class: string | string[] = '';

  @Input()
  public position: DialogPosition;

  @Input('backdrop-class')
  public backdropClass: string;

  protected _closeOnNavigation: boolean = true;
  @Input('close-on-navigation')
  set closeOnNavigation(value: boolean) {
    this._closeOnNavigation = BooleanConverter(value);
  }

  protected _disableClose: boolean = true;
  @Input('disable-close')
  set disableClose(value: boolean) {
    this._disableClose = BooleanConverter(value);
  }

  @Input()
  public title: string;

  @Input('label-columns')
  public labelColumns: string;

  @Input()
  public separator: string;

  getOptions() {
    const result = {
      width: this.width,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      height: this.height,
      minHeight: this.minHeight,
      maxHeight: this.maxHeight,
      class: this.class,
      position: this.position,
      backdropClass: this.backdropClass,
      disableClose: this._disableClose,
      closeOnNavigation: this._closeOnNavigation,
      title: this.title,
      labelColumns: this.labelColumns,
      separator: this.separator
    }
    // Deleting undefined properties
    Object.keys(result).forEach(key => result[key] == null ? delete result[key] : {});
    return result;
  }

}
