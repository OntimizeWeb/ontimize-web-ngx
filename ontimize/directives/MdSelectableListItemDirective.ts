import {Directive, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

// import {MdListItemDirective} from './MdListItemDirective';
// import {OSelectableListItemComponent, OSelectableListComponent} from '../components';
// import {IListItem, IList} from '../interfaces/list.interface';

@Directive({
    selector: '[o-md-selectable-list-item]',
    // host: {
    //   '(click)' : 'onItemClicked($event)'
    // }
})
export class MdSelectableListItemDirective /*extends MdListItemDirective*/ implements OnInit {

  constructor(public _el: ElementRef,
    public actRoute: ActivatedRoute) {
    // @Inject(forwardRef(() => OSelectableListItemComponent)) public _item: IListItem,
    // @Inject(forwardRef(() => OSelectableListComponent)) public _list: IList) {
    // super(_el, actRoute, _item, _list);
  }

  ngOnInit() {
    //Nothing to do
  }

}
