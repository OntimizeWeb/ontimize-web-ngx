import {
  Component, NgModule, ModuleWithProviders, NgZone,
  ViewEncapsulation, ElementRef, forwardRef,
  Inject, Injector, Optional, ContentChildren, QueryList
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MdListModule, MdIconModule, MdLine, MdCheckboxModule } from '@angular/material';
import { OListComponent } from './o-list.component';

@Component({
  selector: 'o-list-item',
  templateUrl: 'list/o-list-item.component.html',
  styleUrls: ['list/o-list-item.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OListItemComponent {

  modelData: Object;
  isSelected: boolean = false;

  @ContentChildren(MdLine)
  private mdLines: QueryList<MdLine>;
  private mdLinesClass: string = '';

  constructor(
    public element: ElementRef,
    protected zone: NgZone,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListComponent)) protected _list: OListComponent) {
  }

  ngAfterContentInit() {
    if (this.mdLines && this.mdLines.length) {
      this.mdLinesClass = 'md-' + this.mdLines.length + '-line';
    }
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
