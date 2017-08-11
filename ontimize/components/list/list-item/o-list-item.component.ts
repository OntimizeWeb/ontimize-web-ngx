import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ViewEncapsulation,
  ContentChildren,
  ContentChild,
  QueryList,
  ElementRef,
  Renderer,
  AfterContentInit,
  Optional,
  ViewChild,
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdLine, MdListAvatarCssMatStyler, MdListItem } from '@angular/material';
import { OListComponent } from '../o-list.component';
import { OSharedModule } from '../../../shared';

@Component({
  selector: 'o-list-item',
  template: require('./o-list-item.component.html'),
  styles: [require('./o-list-item.component.scss')],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-item]': 'true'
  }
})

export class OListItemComponent implements AfterContentInit {

  modelData: Object;
  isSelected: boolean = false;

  _hasFocus: boolean = false;

  @ContentChildren(MdLine) _lines: QueryList<MdLine>;

  @ViewChild('innerListItem') _innerListItem: MdListItem;

  @ContentChild(MdListAvatarCssMatStyler)
  set _hasAvatar(avatar: MdListAvatarCssMatStyler) {
    let mdListItemNativeEl = this.elRef.nativeElement.getElementsByTagName('mat-list-item');
    if (mdListItemNativeEl && mdListItemNativeEl.length === 1) {
      this._renderer.setElementClass(mdListItemNativeEl[0], 'mat-list-avatar', (avatar !== null && avatar !== undefined));
    }
  }

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListComponent)) public _list: OListComponent
  ) {
  }

  ngAfterContentInit() {
    var mdLinesRef = this._lines;
    var ngAfterContentInitOriginal = this._innerListItem.ngAfterContentInit;
    this._innerListItem.ngAfterContentInit = function () {
      let emptyDiv = this._element.nativeElement.querySelector('.mat-list-text:empty');
      if (emptyDiv) {
        emptyDiv.remove();
      }
      this._lines = mdLinesRef;
      ngAfterContentInitOriginal.apply(this);
    };
  }

  onItemClick(evt) {
    if (!this._list.detailButtonInRow) {
      this._list.onItemDetailClick(this);
    }
  }

  onItemDblClick(evt) {
    if (!this._list.detailButtonInRow) {
      this._list.onItemDetailDblClick(this);
    }
  }

  onDetailIconClicked(evt) {
    this._list.viewDetail(this.modelData);
  }

  onEditIconClicked(evt) {
    this._list.editDetail(this.modelData);
  }

  setItemData(data) {
    if (!this.modelData) {
      this.modelData = data;
      if (this._list.selectable) {
        this.isSelected = this._list.isItemSelected(this.modelData);
      }
    }
  }

  getItemData() {
    return this.modelData;
  }

  onCheckboxChange(evt) {
    if (this._list.selectable) {
      this.isSelected = this._list.setSelected(this.modelData);
    }
  }
}

@NgModule({
  declarations: [OListItemComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OListItemComponent],
})
export class OListItemModule {
}
