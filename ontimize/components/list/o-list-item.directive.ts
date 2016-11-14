import {
  Directive, ElementRef, forwardRef, OnInit, OnDestroy,
  Inject, Input, HostListener, Renderer
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { EventEmitter } from '@angular/core';

import {ObservableWrapper} from '../../util/async';

import {OListComponent} from './o-list.component';
import {IList} from '../../interfaces/list.interface';

@Directive({
  selector: '[o-list-item]',
  host: {
      '(click)' : 'onItemClicked($event)'
  }
})
export class OListItemDirective implements OnInit, OnDestroy {

  mdClick: EventEmitter<any> = new EventEmitter();

  active:boolean = false;

  subcription: any;

  @Input('o-list-item')
  modelData: Object;


  constructor(public _el: ElementRef,
    private renderer: Renderer,
    public actRoute: ActivatedRoute,
    @Inject(forwardRef(() => OListComponent)) public _list: IList) {
       this._list.registerListItem(this);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setElementStyle(this._el.nativeElement, 'cursor', 'pointer');
  }

  ngOnInit() {
    this.subcription = this.actRoute
      .params
      .subscribe(params => {
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

  public onClick(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }
}
