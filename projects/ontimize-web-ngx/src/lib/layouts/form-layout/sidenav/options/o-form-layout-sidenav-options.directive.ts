import { Directive, Input, OnChanges } from '@angular/core';
import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';
import { OFormLayoutSidenavOptions } from '../../../../types/form-layout-sidenav-options.type';

@Directive({
  selector: 'o-form-layout-sidenav-options, o-form-layout-manager[mode="sidenav"]'
})
export class OFormLayoutSidenavOptionsDirective implements OnChanges {

  constructor(protected formLayoutManager: OFormLayoutManagerComponent) { }

  ngOnChanges(): void {
    if (this.formLayoutManager) {
      this.formLayoutManager.addSidenavOptions(this.getOptions());
    }
  }

  @Input()
  public width: string;

  @Input()
  public position: 'start' | 'end';

  @Input('label-columns')
  public labelColumns: string;

  @Input()
  public separator: string;

  getOptions(): OFormLayoutSidenavOptions {
    const result = {
      width: this.width,
      position: this.position,
      labelColumns: this.labelColumns,
      separator: this.separator
    };

    Object.keys(result).forEach(
      key => result[key] == null ? delete result[key] : {}
    );

    return result;
  }
}
