import { Component, ElementRef, EventEmitter, TemplateRef, ViewChild } from '@angular/core';

import { NumberInputConverter } from '../../../decorators/input-converter';
import { IGridItem } from '../../../interfaces/o-grid-item.interface';
import { ObservableWrapper } from '../../../util/async';

export const DEFAULT_INPUTS_O_GRID_ITEM = [
  'colspan',
  'rowspan'
];

@Component({
  selector: 'o-grid-item',
  templateUrl: './o-grid-item.component.html',
  inputs: DEFAULT_INPUTS_O_GRID_ITEM,
  host: {
    '[class.o-grid-item]': 'true',
    '(click)': 'onItemClicked($event)',
    '(dblclick)': 'onItemDoubleClicked($event)'
  },

})
export class OGridItemComponent implements IGridItem {

  modelData: object;
  mdClick: EventEmitter<any> = new EventEmitter();
  mdDoubleClick: EventEmitter<any> = new EventEmitter();

  @ViewChild(TemplateRef) public template: TemplateRef<any>;
  @NumberInputConverter()
  colspan: number = 1;
  @NumberInputConverter()
  rowspan: number = 1;

  constructor(public _el: ElementRef) { }

  onItemClicked(e?: Event) {
    ObservableWrapper.callEmit(this.mdClick, this);
  }

  onItemDoubleClicked(e?: Event) {
    ObservableWrapper.callEmit(this.mdDoubleClick, this);
  }

  public onClick(onNext: (item: OGridItemComponent) => void): object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  public onDoubleClick(onNext: (item: OGridItemComponent) => void): object {
    return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
  }

  setItemData(data: object): void {
    if (!this.modelData) {
      this.modelData = data;
    }
  }

  getItemData(): object {
    return this.modelData;
  }

}
