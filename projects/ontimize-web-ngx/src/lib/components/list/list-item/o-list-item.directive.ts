import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IListItem, instanceOfIListItem } from '../../../interfaces/o-list-item.interface';
import { IList } from '../../../interfaces/o-list.interface';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';

@Directive({
  selector: 'o-list-item, mat-list-item[o-list-item], mat-card[o-list-item]',
  exportAs: 'olistitem',
  host: {
    '[class.o-list-item]': 'true',
    '(click)': 'onItemClicked($event)',
    '(dblclick)': 'onItemDoubleClicked($event)'
  }
})
export class OListItemDirective implements OnInit, OnDestroy {

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();

  @Input('o-list-item')
  public modelData: any;

  @Input()
  public selectable: boolean = false;

  protected _list: IList;
  protected listItem: IListItem;
  protected subscription: Subscription = new Subscription();

  constructor(
    private _viewContainerRef: ViewContainerRef,
    public _el: ElementRef,
    private renderer: Renderer2,
    public actRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    const hostComponent = this._viewContainerRef["_data"].componentView.component;
    if (instanceOfIListItem(hostComponent)) {
      this.listItem = hostComponent
    }
    this.subscription.add(this.actRoute.params.subscribe(params => this.updateActiveState(params)));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    if (!this.selectable && this._list && this._list.detailMode !== Codes.DETAIL_MODE_NONE) {
      this.renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
    }
  }

  public updateActiveState(params): void {
    if (this._list) {
      const aKeys = this._list.getKeys();
      if (this.modelData) {
        let _act = false;
        if (aKeys.length > 0) {
          for (let k = 0; k < aKeys.length; ++k) {
            const key = aKeys[k];
            const id = params[key];
            _act = (this.modelData[key] === id);
            if (_act === false) {
              break;
            }
          }
        }
        if (_act) {
          this._el.nativeElement.classList.add('mat-active');
        } else {
          this._el.nativeElement.classList.remove('mat-active');
        }
      } else {
        this._el.nativeElement.classList.remove('mat-active');
      }
    }
  }

  public onItemClicked(e?: Event): void {
    if (!this.selectable && this._list) {
      this._list.onItemDetailClick(this);
      this.onClick.emit(this.getItemData())
    }
  }

  public onItemDoubleClicked(e?: Event): void {
    if (!this.selectable && this._list) {
      this._list.onItemDetailDoubleClick(this);
      this.onDoubleClick.emit(this.getItemData())
    }
  }

  public isSelected(): boolean {
    return this._list && this._list.isItemSelected(this.modelData);
  }

  public setListComponent(list: IList): void {
    this._list = list;
  }

  public setItemData(data: any): void {
    if (!Util.isDefined(this.modelData) || this.modelData !== 'object') {
      this.modelData = data;
    }
    if (Util.isDefined(this.listItem)) {
      this.listItem.setItemData(this.modelData);
    }
  }

  public getItemData(): any {
    return this.modelData;
  }

}
