import {Directive, ElementRef, forwardRef, OnInit, OnDestroy, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EventEmitter} from '@angular/core';
import {ObservableWrapper} from '../util/async';

import {OListItemComponent, OListComponent} from '../components';
import {IListItem, IList} from '../interfaces/list.interface';

@Directive({
    selector: '[o-md-list-item]',
    host: {
      '(click)' : 'onItemClicked($event)'
    }
})
export class MdListItemDirective implements OnInit, OnDestroy {

  mdClick: EventEmitter<any> = new EventEmitter();

  active:boolean = false;

  subcription: any;

  constructor(public _el: ElementRef,
    public actRoute: ActivatedRoute,
    @Inject(forwardRef(() => OListItemComponent)) public  _item: IListItem,
    @Inject(forwardRef(() => OListComponent)) public _list: IList) {
       this._list.registerListItem(this);
  }

  ngOnInit() {

    this.subcription = this.actRoute
      .params
      .subscribe(params => {
        let id = +params[this._list.getKey()];
        if (this._item && this._item.getModel()) {
          let _act = ( this._item.getModel()[this._list.getKey()] === id );
          if (_act) {
          this._el.nativeElement.classList.add('md-active');
          } else {
            this._el.nativeElement.classList.remove('md-active');
          }
        } else {
          this._el.nativeElement.classList.remove('md-active');
        }

      });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  onItemClicked(evt) {
    var self = this;
    window.setTimeout(() => {
       ObservableWrapper.callEmit(self.mdClick, self);
    }, 250);

  }

  public onClick(onNext: (item: MdListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  get item() : IListItem {
    return this._item;
  }

}
