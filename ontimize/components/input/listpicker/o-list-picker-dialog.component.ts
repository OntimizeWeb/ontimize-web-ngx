import { Component, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Util } from '../../../util/util';
import { OSearchInputComponent } from '../../input/search-input/o-search-input.component';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'data',
  'visibleColumns: visible-columns',
  'filter'
];

@Component({
  moduleId: module.id,
  selector: 'o-list-picker-dialog',
  templateUrl: './o-list-picker-dialog.component.html',
  styleUrls: ['./o-list-picker-dialog.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_PICKER,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-picker-dialog]': 'true'
  }
})
export class OListPickerDialogComponent {

  public filter: boolean = true;
  public visibleData: any = [];
  public searchVal: string;

  @ViewChild('searchInput')
  public searchInput: OSearchInputComponent;

  protected data: any[] = [];
  protected menuColumns: string;
  protected visibleColsArray: string[];

  protected _startIndex: number = 0;
  protected recordsNumber: number = 100;
  protected scrollThreshold: number = 200;

  constructor(
    public dialogRef: MatDialogRef<OListPickerDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.data && Util.isArray(data.data)) {
      this.data = data.data;
    }
    if (data.visibleColumns && Util.isArray(data.visibleColumns)) {
      this.visibleColsArray = data.visibleColumns;
    }
    if (data.queryRows !== undefined) {
      this.recordsNumber = data.queryRows;
    }
    if (data.filter !== undefined) {
      this.filter = data.filter;
    }
    if (data.menuColumns) {
      this.menuColumns = data.menuColumns;
    }
    this.searchVal = data.searchVal;
  }

  public ngAfterViewInit(): void {
    if (Util.isDefined(this.searchVal) && this.searchInput !== undefined && this.searchVal.length > 0) {
      this.searchInput.getFormControl().setValue(this.searchVal, {
        emitEvent: false
      });
      this.onFilterList(this.searchVal);
    } else {
      this.startIndex = 0;
    }
  }

  get startIndex(): number {
    return this._startIndex;
  }

  set startIndex(val: number) {
    this._startIndex = val;
    this.visibleData = this.data.slice(this.startIndex, this.recordsNumber);
  }

  public onClickListItem(e: Event, value: any): void {
    this.dialogRef.close(value);
  }

  public trackByFn(index: number, item: any): number {
    return index;
  }

  public onScroll(event: any): void {
    if (event && event.target && this.visibleData.length < this.data.length) {
      const pendingScroll = event.target.scrollHeight - (event.target.scrollTop + event.target.clientHeight);
      if (!isNaN(pendingScroll) && pendingScroll <= this.scrollThreshold) {
        let index = this.visibleData.length;
        const searchVal = this.searchInput.getValue();
        if (Util.isDefined(searchVal) && searchVal.length > 0) {
          index = this.visibleData[this.visibleData.length - 1]['_parsedIndex'];
        }
        let appendData = this.data.slice(index, this.visibleData.length + this.recordsNumber);
        if (appendData.length) {
          appendData = this.transform(appendData, {
            filtervalue: this.searchInput.getValue(),
            filtercolumns: this.visibleColsArray
          });
          if (appendData.length) {
            this.visibleData = this.visibleData.concat(appendData);
          }
        }
      }
    }
  }

  public onFilterList(searchVal: any): void {
    this.visibleData = this.transform(this.data, {
      filtervalue: searchVal,
      filtercolumns: this.visibleColsArray
    });
    this._startIndex = 0;
    this.visibleData = this.visibleData.slice(this.startIndex, this.recordsNumber);
  }

  public isEmptyData(): boolean {
    return Util.isDefined(this.visibleData) ? this.visibleData.length === 0 : true;
  }

  private transform(value: any[], args: any): any {
    if (!args || args.length <= 1) {
      return value;
    }

    const filterValue = args['filtervalue'] ? args['filtervalue'] : '';
    const filterColumns = args['filtercolumns'];

    if (!filterColumns || !filterValue || filterValue.length === 0) {
      return value;
    }

    if (value === undefined || value === null) {
      return value;
    }

    return value.filter(item => {
      for (let i = 0; i < filterColumns.length; i++) {
        const colName = filterColumns[i];
        if (this._isBlank(colName)) {
          continue;
        }
        let origValue = item[colName];
        if (origValue) {
          origValue = origValue.toString();
          if (this._isBlank(origValue)) {
            continue;
          }

          if (origValue.toUpperCase().indexOf(filterValue.toUpperCase()) > -1) {
            return item;
          }
        }
      }
    });
  }

  private _isBlank(value: string): boolean {
    return !Util.isDefined(value) || value.length === 0;
  }

}
