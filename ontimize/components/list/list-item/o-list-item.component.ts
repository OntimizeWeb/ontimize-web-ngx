import { AfterContentInit, Component, ElementRef, forwardRef, Inject, Injector, ContentChild, ContentChildren, NgModule, Optional, QueryList, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLine, MatListAvatarCssMatStyler, MatListItem } from '@angular/material';

import { Util } from '../../../util/util';
import { OSharedModule } from '../../../shared';
import { OListComponent } from '../o-list.component';

@Component({
  selector: 'o-list-item',
  templateUrl: './o-list-item.component.html',
  styleUrls: ['./o-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-item]': 'true'
  }
})
export class OListItemComponent implements AfterContentInit {

  modelData: Object;
  protected _isSelected: boolean = false;

  @ContentChildren(MatLine) _lines: QueryList<MatLine>;

  @ViewChild('innerListItem') _innerListItem: MatListItem;

  @ContentChild(MatListAvatarCssMatStyler)
  set _hasAvatar(avatar: MatListAvatarCssMatStyler) {
    let listItemNativeEl = this.elRef.nativeElement.getElementsByTagName('mat-list-item');
    if (listItemNativeEl && listItemNativeEl.length === 1) {
      this._renderer.setElementClass(listItemNativeEl[0], 'mat-list-avatar', (avatar !== null && avatar !== undefined));
    }
  }

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListComponent)) public _list: OListComponent
  ) { }

  ngAfterContentInit() {
    var matLinesRef = this._lines;
    var ngAfterContentInitOriginal = this._innerListItem.ngAfterContentInit;
    this._innerListItem.ngAfterContentInit = function () {
      let emptyDiv = this._element.nativeElement.querySelector('.mat-list-text:empty');
      if (emptyDiv) {
        emptyDiv.remove();
      }
      this._lines = matLinesRef;
      ngAfterContentInitOriginal.apply(this);
    };
  }

  onClick(e?: Event) {
    if (!this._list.detailButtonInRow) {
      this._list.onItemDetailClick(this);
    }
  }

  onDoubleClick(e?: Event) {
    if (!this._list.detailButtonInRow) {
      this._list.onItemDetailDoubleClick(this);
    }
  }

  onDetailIconClicked(e?: Event) {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this._list.viewDetail(this.modelData);
  }

  onEditIconClicked(e?: Event) {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
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

  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(val: boolean) {
    this._isSelected = val;
  }

}

@NgModule({
  declarations: [OListItemComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OListItemComponent]
})
export class OListItemModule { }
