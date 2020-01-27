import { Directive, Optional } from '@angular/core';

import { Util } from '../../util/util';
import { OFilterBuilderComponent } from './o-filter-builder.component';

@Directive({
  selector: '[oFilterBuilderClear]',
  inputs: [
    '_filterBuilder: oFilterBuilderClear'
  ],
  host: {
    '(click)': 'onClick($event)'
  },
  exportAs: 'oFilterBuilderClear'
})
export class OFilterBuilderClearDirective {

  protected _filterBuilder: OFilterBuilderComponent;

  constructor(
    @Optional() filterBuilder: OFilterBuilderComponent
  ) {
    if (Util.isDefined(filterBuilder)) {
      this._filterBuilder = filterBuilder;
    }
  }

  onClick(e?: Event): void {
    if (this._filterBuilder) {
      this._filterBuilder.clearFilter();
    }
  }

}
