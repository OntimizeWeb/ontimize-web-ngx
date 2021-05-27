import { Directive, Input } from '@angular/core';

import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';

@Directive({
  selector: 'o-form-layout-split-pane-options, o-form-layout-manager[mode="split-pane"]'
})
export class OFormLayoutSplitPaneOptionsDirective {

  constructor(protected formLayoutManager: OFormLayoutManagerComponent) { }

  ngOnChanges() {
    if (this.formLayoutManager) {
      this.formLayoutManager.addSplitPaneOptions(this.getOptions());
    }
  }

  @Input('main-width') mainWidth: number | string;
  @Input('main-max-width') mainMaxWidth: number | string;
  @Input('main-min-width') mainMinWidth: number | string;
  @Input('detail-width') detailWidth: number | string;
  @Input('detail-max-width') detailMaxWidth: number | string;
  @Input('detail-min-width') detailMinWidth: number | string;

  getOptions() {
    const result = {
      mainWidth: this.mainWidth,
      mainMaxWidth: this.mainMaxWidth,
      mainMinWidth: this.mainMinWidth,
      detailWidth: this.detailWidth,
      detailMaxWidth: this.detailMaxWidth,
      detailMinWidth: this.detailMinWidth
    }
    // Deleting undefined properties
    Object.keys(result).forEach(key => result[key] == null ? delete result[key] : {});
    return result;
  }
}
