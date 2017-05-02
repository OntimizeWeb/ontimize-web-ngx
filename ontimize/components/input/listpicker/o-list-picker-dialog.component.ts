import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { MdDialogRef } from '@angular/material';
import {Util} from '../../../util/util';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'data',
  'visibleColumns: visible-columns',
  'filter'
];

@Component({
  selector: 'o-list-picker-dialog',
  templateUrl: 'o-list-picker-dialog.component.html',
  styleUrls: ['o-list-picker.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_PICKER
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListPickerDialogComponent {

  data: Array<any>;
  filter: boolean = true;

  visibleColsArray: Array<string>;

  constructor( protected dialogRef: MdDialogRef<OListPickerDialogComponent>) { }

  initialize(parameters: Object): any {
    if ( Util.isArray(parameters['data']) ) {
      this.data = parameters['data'];
    }
    if ( Util.isArray(parameters['visibleColumns']) ) {
      this.visibleColsArray = parameters['visibleColumns'];
    }
    if (typeof parameters['filter'] !== 'undefined') {
      this.filter = parameters['filter'];
    }
  }

  onClickListItem(e: Event, value: any): void {
    this.dialogRef.close(value);
  }

}


