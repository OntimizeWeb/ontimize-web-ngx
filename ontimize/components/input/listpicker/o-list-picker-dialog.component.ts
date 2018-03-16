import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util } from '../../../util/util';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'data',
  'visibleColumns: visible-columns',
  'filter'
];

@Component({
  selector: 'o-list-picker-dialog',
  templateUrl: './o-list-picker-dialog.component.html',
  styleUrls: ['./o-list-picker.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_PICKER,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-picker-dialog]': 'true'
  }
})
export class OListPickerDialogComponent {

  data: Array<any>;
  filter: boolean = true;

  visibleColsArray: Array<string>;
  searchVal: string;

  constructor(
    public dialogRef: MatDialogRef<OListPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.data && Util.isArray(data.data)) {
      this.data = data.data;
    }
    if (data.visibleColumns && Util.isArray(data.visibleColumns)) {
      this.visibleColsArray = data.visibleColumns;
    }
    if (data.filter !== undefined) {
      this.filter = data.filter;
    }
  }

  onClickListItem(e: Event, value: any): void {
    this.dialogRef.close(value);
  }

}


