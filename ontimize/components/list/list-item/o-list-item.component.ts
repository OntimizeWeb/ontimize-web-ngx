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
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MdListModule, MdIconModule, MdCheckboxModule, MdLine, MdListAvatarCssMatStyler, MdListItem } from '@angular/material';

import { OListComponent } from '../o-list.component';

@Component({
  selector: 'o-list-item',
  templateUrl: 'o-list-item.component.html',
  styleUrls: ['o-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    this.elRef.nativeElement.classList.add('o-list-item');
  }

  ngAfterContentInit() {
    var mdLinesRef = this._lines;
    var ngAfterContentInitOriginal = this._innerListItem.ngAfterContentInit;
    this._innerListItem.ngAfterContentInit = function () {
      let emptyDiv = this._element.nativeElement.querySelector('.mat-list-text:first-child:empty');
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
  imports: [MdListModule, MdIconModule, CommonModule, MdCheckboxModule],
  exports: [OListItemComponent],
})
export class OListItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListItemModule,
      providers: []
    };
  }
}
