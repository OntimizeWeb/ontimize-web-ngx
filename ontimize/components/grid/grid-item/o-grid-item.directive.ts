import { Directive, ElementRef, EventEmitter, HostListener, Renderer } from '@angular/core';

import { Util } from '../../../util/util';
import { Codes, ObservableWrapper } from '../../../utils';
import { OGridComponent } from '../o-grid.component';

@Directive({
  selector: 'mat-grid-tile[o-grid-item]',
  host: {
    '(click)': 'onItemClicked($event)',
    '(dblclick)': 'onItemDoubleClicked($event)'
  }
})
export class OGridItemDirective {

  mdClick: EventEmitter<any> = new EventEmitter();
  mdDoubleClick: EventEmitter<any> = new EventEmitter();
  modelData: Object;

  protected grid: OGridComponent;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (Util.isDefined(this.grid) && this.grid.detailMode !== Codes.DETAIL_MODE_NONE) {
      this.renderer.setElementStyle(this._el.nativeElement, 'cursor', 'pointer');
    }
  }

  constructor(
    public _el: ElementRef,
    private renderer: Renderer
  ) { }

  public onClick(onNext: (item: OGridItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  public onDoubleClick(onNext: (item: OGridItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
  }

  onItemClicked(e?: Event): void {
    ObservableWrapper.callEmit(this.mdClick, this);
  }

  onItemDoubleClicked(e?: Event): void {
    ObservableWrapper.callEmit(this.mdDoubleClick, this);
  }

  setItemData(data: Object): void {
    if (!this.modelData) {
      this.modelData = data;
    }
  }

  getItemData(): Object {
    return this.modelData;
  }

  setGridComponent(grid: OGridComponent): void {
    this.grid = grid;
  }

}
