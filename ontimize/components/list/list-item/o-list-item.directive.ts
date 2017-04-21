import {
  Directive, ElementRef, OnInit, OnDestroy,
  Input, HostListener, Renderer,
  ViewContainerRef, ComponentFactoryResolver, ContentChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';

import { ObservableWrapper } from '../../../util/async';

import { IList } from '../../../interfaces/list.interface';

import { MdListItem } from '@angular/material';

@Directive({
  selector: 'md-list-item[o-list-item]',
  exportAs: 'olistitem',
  host: {
    '(click)': 'onItemClicked($event)',
    '(dblclick)': 'onItemDblClicked($event)'
  }
})
export class OListItemDirective implements OnInit, OnDestroy {

  mdClick: EventEmitter<any> = new EventEmitter();
  mdDblClick: EventEmitter<any> = new EventEmitter();

  subcription: any;
  _list: IList;

  @Input('o-list-item')
  modelData: Object;

  @ContentChild(MdListItem, { read: ViewContainerRef }) other;

  @Input('selectable')
  selectable: boolean = false;

  constructor(public _el: ElementRef,
    private renderer: Renderer,
    public actRoute: ActivatedRoute,
    private containerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.subcription = this.actRoute
      .params
      .subscribe(params => {
        this.updateActiveState(params);
      });
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.selectable) {
      this.renderer.setElementStyle(this._el.nativeElement, 'cursor', 'pointer');
    }
  }

  updateActiveState(params) {
    if (this._list) {
      let aKeys = this._list.getKeys();
      if (this.modelData) {
        let _act = false;
        if (aKeys.length > 0) {
          for (let k = 0; k < aKeys.length; ++k) {
            let key = aKeys[k];
            let id = params[key];
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

  ngOnDestroy() {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  onItemClicked(evt?) {
    var self = this;
    window.setTimeout(() => {
      ObservableWrapper.callEmit(self.mdClick, self);
    }, 250);
  }

  public onClick(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  public isSelected() {
    return this._list.isItemSelected(this.modelData);
  }

  public onSelect() {
    this._list.setSelected(this.modelData);
  }

  onItemDblClicked(evt) {
    var self = this;
    window.setTimeout(() => {
      ObservableWrapper.callEmit(self.mdDblClick, self);
    }, 250);
  }

  public onDblClick(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdDblClick, onNext);
  }

  setListComponent(list: IList) {
    this._list = list;
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
