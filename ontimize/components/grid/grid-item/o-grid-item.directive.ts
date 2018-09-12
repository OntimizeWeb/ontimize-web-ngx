import { Directive, ElementRef, EventEmitter, HostListener, Renderer } from '@angular/core';

import { Codes, ObservableWrapper } from '../../../utils';
import { OGridComponent } from '../o-grid.component';

@Directive({
  selector: 'mat-grid-tile',
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
  onMouseEnter() {
    if (this.grid.detailMode !== Codes.DETAIL_MODE_NONE) {
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

  onItemClicked(e?: Event) {
    ObservableWrapper.callEmit(this.mdClick, this);
  }

  onItemDoubleClicked(e?: Event) {
    ObservableWrapper.callEmit(this.mdDoubleClick, this);
  }

  setItemData(data) {
    if (!this.modelData) {
      this.modelData = data;
    }
  }

  getItemData() {
    return this.modelData;
  }

  setGridComponent(grid: OGridComponent) {
    this.grid = grid;
  }

}
