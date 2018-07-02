import { Directive, Optional } from '@angular/core';

import { Util } from '../../utils';
import { OFilterBuilderComponent } from './o-filter-builder-components';

@Directive({
  selector: '[oFilterBuilderClear]',
  inputs: [
    '_filterBuilder: oFilterBuilderClear'
  ],
  host: {
    '(click)': 'onClick()'
  }
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

  onClick(): void {
    if (this._filterBuilder) {
      this._filterBuilder.clearFilter();
    }
  }

}
