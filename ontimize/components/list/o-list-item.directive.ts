import {
  Directive, ElementRef, forwardRef, OnInit, OnDestroy,
  Inject, Input, HostListener, Renderer, AfterViewInit,
  ViewContainerRef,ComponentFactoryResolver, ContentChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { EventEmitter } from '@angular/core';

import {ObservableWrapper} from '../../util/async';

import {OListComponent} from './o-list.component';

import { MdCheckbox, MdLine } from '@angular/material';

@Directive({
  selector: '[o-list-item]',
  exportAs: 'olistitem',
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

 // @ContentChild(OListItemDirective, { read: ViewContainerRef }) other;
  @ContentChild(MdLine, { read: ViewContainerRef }) other;

  @Input('selectable')
  selectable: boolean = false;

  constructor(public _el: ElementRef,
    private renderer: Renderer,
    public actRoute: ActivatedRoute,
    @Inject(forwardRef(() => OListComponent)) public _list: OListComponent,
    private containerRef: ViewContainerRef,
    private componentFactoryResolver : ComponentFactoryResolver) {
       this._list.registerListItem(this);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.selectable) {
      this.renderer.setElementStyle(this._el.nativeElement, 'cursor', 'pointer');
    }
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
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  /*
  ngAfterViewInit() {

    let checkBoxFactory = this.componentFactoryResolver.resolveComponentFactory(MdCheckbox);
    let checkBoxRef = this.other.createComponent(checkBoxFactory, 0);
    checkBoxRef.instance.change.subscribe((value: any) => {
      this.onSelect();
    });
    window.setTimeout(() => {
      checkBoxRef.instance.checked = this._list.isItemSelected(this.modelData);
    }, 50);

    // this.containerRef.move(checkBoxRef.hostView, 0);
  }*/

  onItemClicked(evt) {
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

}
