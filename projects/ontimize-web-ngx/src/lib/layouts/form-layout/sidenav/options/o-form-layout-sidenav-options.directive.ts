import { AfterViewInit, Directive, Input, OnInit } from '@angular/core';

import { BooleanConverter } from '../../../../decorators/input-converter';
import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';

@Directive({
  selector: 'o-form-layout-sidenav-options, o-form-layout-manager[mode="sidenav"]'
})
export class OFormLayoutSidenavOptionsDirective  implements AfterViewInit, OnInit {

  constructor(protected formLayoutManager: OFormLayoutManagerComponent) { }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.formLayoutManager) {
      this.formLayoutManager.addSidenavOptions(this.getOptions());
    }
  }

  /* ===============================
     Layout options
     =============================== */

  @Input()
  public width: string;

  @Input()
  public position: 'start' | 'end';

  /* ===============================
     Behavior options
     =============================== */

  protected _disableClose: boolean = false;
  @Input('disable-close')
  set disableClose(value: boolean) {
    this._disableClose = BooleanConverter(value);
  }

  /* ===============================
     Label / title options
     =============================== */

  @Input('label-columns')
  public labelColumns: string;

  @Input()
  public separator: string;

  getOptions(): any {
    const result = {
      width: this.width,
      position: this.position,
      disableClose: this._disableClose,
      labelColumns: this.labelColumns,
      separator: this.separator
    };

    // Remove undefined properties
    Object.keys(result).forEach(
      key => result[key] == null ? delete result[key] : {}
    );

    return result;
  }
}
