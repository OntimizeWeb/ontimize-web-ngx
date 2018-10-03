import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Inject, NgModule, Optional, Renderer, TemplateRef, ViewChild } from '@angular/core';
import { OSharedModule } from '../../../shared';
import { Codes, ObservableWrapper } from '../../../utils';
import { OGridComponent } from '../../grid/o-grid.component';


@Component({
  moduleId: module.id,
  selector: 'o-grid-item',
  templateUrl: './o-grid-item.component.html',
  host: {
    '[class.o-grid-item]': 'true',
    '(click)': 'onItemClicked($event)',
    '(dblclick)': 'onItemDoubleClicked($event)'
  },

})
export class OGridItemComponent {

  modelData: Object;
  mdClick: EventEmitter<any> = new EventEmitter();
  mdDoubleClick: EventEmitter<any> = new EventEmitter();

  @ViewChild(TemplateRef) public template: TemplateRef<any>;

  constructor(
    public _el: ElementRef,
    private renderer: Renderer,
    @Optional() @Inject(forwardRef(() => OGridComponent)) public _grid: OGridComponent) {  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this._grid.detailMode !== Codes.DETAIL_MODE_NONE) {
      this.renderer.setElementStyle(this._el.nativeElement, 'cursor', 'pointer');
    }
  }

  onItemClicked(e?: Event) {
    ObservableWrapper.callEmit(this.mdClick, this);
  }

  onItemDoubleClicked(e?: Event) {
    ObservableWrapper.callEmit(this.mdDoubleClick, this);
  }

  public onClick(onNext: (item: OGridItemComponent) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  public onDoubleClick(onNext: (item: OGridItemComponent) => void): Object {
    return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
  }

  setItemData(data) {
    if (!this.modelData) {
      this.modelData = data;
    }
  }

  getItemData() {
    return this.modelData;
  }

}


@NgModule({
  declarations: [OGridItemComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OGridItemComponent]
})

export class OGridItemModule {

}
