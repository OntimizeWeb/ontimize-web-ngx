import { Directive, Optional } from '@angular/core';

import { Util } from '../../util/util';
import { OFilterBuilderComponent } from './o-filter-builder.component';

@Directive({
  selector: '[oFilterBuilderQuery]',
  inputs: [
    '_filterBuilder: oFilterBuilderQuery'
  ],
  host: {
    '(click)': 'onClick($event)'
  },
  exportAs: 'oFilterBuilderQuery'
})
export class OFilterBuilderQueryDirective {

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
      this._filterBuilder.triggerReload();
    }
  }

}
