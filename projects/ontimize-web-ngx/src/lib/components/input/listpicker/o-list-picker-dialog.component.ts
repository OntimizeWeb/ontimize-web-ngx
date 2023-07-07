import { AfterViewInit, Component, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { Util } from '../../../util/util';
import { OSearchInputComponent } from '../../input/search-input/o-search-input.component';
import { OListPickerCustomRenderer } from './listpicker-renderer/o-list-picker-renderer.class';

export const DEFAULT_INPUTS_O_LIST_PICKER_DIALOG = [
  'data',
  'visibleColumns: visible-columns',
  'filter'
];

@Component({
  selector: 'o-list-picker-dialog',
  templateUrl: './o-list-picker-dialog.component.html',
  styleUrls: ['./o-list-picker-dialog.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_PICKER_DIALOG,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-picker-dialog]': 'true'
  }
})
export class OListPickerDialogComponent implements AfterViewInit {

  public filter: boolean = true;
  public visibleData: any = [];
  public searchVal: string;
  public itemSize: number = 30;
  public renderer: OListPickerCustomRenderer;

  @ViewChild('searchInput')
  public searchInput: OSearchInputComponent;

  protected data: any[] = [];
  public menuColumns: string;
  protected visibleColsArray: string[];

  constructor(
    public dialogRef: MatDialogRef<OListPickerDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.data && Util.isArray(data.data)) {
      this.data = data.data;
      this.visibleData = this.data;
    }
    if (data.visibleColumns && Util.isArray(data.visibleColumns)) {
      this.visibleColsArray = data.visibleColumns;
    }

    if (data.filter !== undefined) {
      this.filter = data.filter;
    }
    if (data.menuColumns) {
      this.menuColumns = data.menuColumns;
    }
    if (data.renderer) {
      this.renderer = data.renderer;
    }
    this.searchVal = data.searchVal;
  }

  public ngAfterViewInit(): void {
    if (Util.isDefined(this.searchVal) && this.searchInput !== undefined && this.searchVal.length > 0) {
      this.searchInput.getFormControl().setValue(this.searchVal, {
        emitEvent: false
      });
      //TODO improve: Added setTimeout for resolving ExpressionChangedAfterItHasBeenCheckedError error because the observables dont work
      setTimeout(() => this.searchInput.onSearch.emit(this.searchVal));
    }
  }


  public onClickListItem(e: any, value: any): void {
    this.dialogRef.close(value);
  }

  public trackByFn(index: number, item: any): number {
    return index;
  }

  public onFilterList(searchVal: any): void {
    this.visibleData = this.transform(this.data, {
      filtervalue: searchVal,
      filtercolumns: this.visibleColsArray
    });
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
