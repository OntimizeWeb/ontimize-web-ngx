import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ObservableWrapper } from '../../../util/async';
import { Codes } from '../../../util/codes';
import { IList } from '../o-list.component';

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

  public mdClick: EventEmitter<any> = new EventEmitter();
  public mdDoubleClick: EventEmitter<any> = new EventEmitter();

  @Input('o-list-item')
  public modelData: Object;

  @Input('selectable')
  public selectable: boolean = false;

  protected _list: IList;
  protected subcription: any;

  constructor(
    public _el: ElementRef,
    private renderer: Renderer2,
    public actRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.subcription = this.actRoute.params.subscribe(params => this.updateActiveState(params));
  }

  public ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    if (!this.selectable && this._list.detailMode !== Codes.DETAIL_MODE_NONE) {
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
    if (!this.selectable) {
      ObservableWrapper.callEmit(this.mdClick, this);
    }
  }

  public onClick(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  public onItemDoubleClicked(e?: Event): void {
    if (!this.selectable) {
      ObservableWrapper.callEmit(this.mdDoubleClick, this);
    }
  }

  public onDoubleClick(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
  }

  public isSelected(): boolean {
    return this._list.isItemSelected(this.modelData);
  }

  public onSelect(): void {
    this._list.setSelected(this.modelData);
  }

  public setListComponent(list: IList): void {
    this._list = list;
  }

  public setItemData(data: any): void {
    if (!this.modelData) {
      this.modelData = data;
    }
  }

  public getItemData(): any {
    return this.modelData;
  }

}
