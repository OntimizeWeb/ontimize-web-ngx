import {
  Component, NgModule, ModuleWithProviders, NgZone,
  ViewEncapsulation, ElementRef, forwardRef,
  Inject, Injector, Optional, ContentChildren, QueryList
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MdListModule, MdIconModule, MdLine } from '@angular/material';
import { OListComponent } from './o-list.component';

@Component({
  selector: 'o-list-item',
  templateUrl: 'list/o-list-item.component.html',
  styleUrls: ['list/o-list-item.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OListItemComponent {

  modelData: Object;

  @ContentChildren(MdLine)
  private mdLines: QueryList<MdLine>;
  private mdLinesClass: string = '';

  constructor(
    protected _router: Router,
    protected _actRoute: ActivatedRoute,
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
    }
  }

  getItemData() {
    return this.modelData;
  }
}

@NgModule({
  declarations: [OListItemComponent],
  imports: [MdListModule, MdIconModule, CommonModule],
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
