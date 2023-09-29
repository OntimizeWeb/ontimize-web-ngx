import { Directive, ElementRef, EventEmitter, HostListener, Renderer2 } from '@angular/core';

import { ObservableWrapper } from '../../../util/async';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import type { OGridComponent } from '../o-grid.component';

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
  modelData: object;

  protected grid: OGridComponent;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (Util.isDefined(this.grid) && this.grid.detailMode !== Codes.DETAIL_MODE_NONE) {
      this.renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
    }
  }

  constructor(
    public _el: ElementRef,
    private renderer: Renderer2
  ) { }

  public onClick(onNext: (item: OGridItemDirective) => void): object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  public onDoubleClick(onNext: (item: OGridItemDirective) => void): object {
    return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
  }

  onItemClicked(e?: Event): void {
    ObservableWrapper.callEmit(this.mdClick, this);
  }

  onItemDoubleClicked(e?: Event): void {
    ObservableWrapper.callEmit(this.mdDoubleClick, this);
  }

  setItemData(data: object): void {
    if (!this.modelData) {
      this.modelData = data;
    }
  }

  getItemData(): object {
    return this.modelData;
  }

  setGridComponent(grid: OGridComponent): void {
    this.grid = grid;
  }

}
