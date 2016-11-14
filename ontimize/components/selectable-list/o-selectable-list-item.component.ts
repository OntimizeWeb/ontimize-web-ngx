import {Component, OnInit, forwardRef, Inject,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MdListModule } from '@angular2-material/list';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdDividerModule } from '../material/ng2-material/index';

import {MdSelectableListItemDirective} from '../../directives/MdSelectableListItemDirective';
import {OSelectableListComponent} from './o-selectable-list.component';
import {Util} from '../../util/util';
import {OrderByPipe} from '../../pipes';


@Component({
  selector: 'o-selectable-list-item',
  inputs: [
    'display',
    'separator',
    'orderByCol: order-by-col'
  ],
  templateUrl: 'selectable-list/o-selectable-list-item.component.html',
  styleUrls: ['selectable-list/o-selectable-list-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OSelectableListItemComponent implements OnInit {

  separator: string;
  display: string;
  displayCols: string[] = [];
  model: Object;
  orderByCol: string;

  list: OSelectableListComponent;

  constructor( @Inject(forwardRef(() => OSelectableListComponent)) _list: OSelectableListComponent) {
    this.list = _list;
  }

  ngOnInit(): void {
    this.displayCols = Util.parseArray(this.display);

    if(! this.orderByCol) {
      this.orderByCol = this.displayCols[0];
    }
  }

  onClick(item, event) {
    this.list.syncSelected(item);
  }

  getModel() {
    return this.model;
  }

  isItemSelected(item) {
    return this.list.isItemSelected(item);
  }

  getListItemDisplayValue(item) {
    let txt = '';
    if (item && this.displayCols) {
      this.displayCols.forEach((val, index) => {
        if (item.hasOwnProperty(val)) {
          txt = txt + item[val];
          if (index < this.displayCols.length - 1) {
            if (this.separator) {
              txt = txt + this.separator;
            } else {
              txt = txt + ' ';
            }
          }
        }
      });
    }
    return txt;
  }

}

@NgModule({
  declarations: [OrderByPipe, MdSelectableListItemDirective, OSelectableListItemComponent],
  imports: [CommonModule, MdListModule, MdCheckboxModule, MdDividerModule],
  exports: [OSelectableListItemComponent],
})
export class OSelectableListItemModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSelectableListItemModule,
      providers: []
    };
  }
}

