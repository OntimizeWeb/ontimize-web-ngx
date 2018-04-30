import { Component, Inject, ViewEncapsulation, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { IColumnValueFilter } from '../../header/o-table-header-components';

export interface ITableFilterByColumnDataInterface {
  value: any;
  selected: boolean;
}

@Component({
  selector: 'o-table-filter-by-column-data-dialog',
  templateUrl: 'o-table-filter-by-column-data-dialog.component.html',
  styleUrls: ['o-table-filter-by-column-data-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-filter-by-column-dialog]': 'true'
  }
})
export class OTableFilterByColumnDataDialogComponent implements OnInit, AfterViewInit {

  attr: string;
  protected columnData: Array<ITableFilterByColumnDataInterface> = [];
  protected _listData: Array<ITableFilterByColumnDataInterface> = [];

  @ViewChild('filter') filter: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<OTableFilterByColumnDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {

    if (data.columnAttr) {
      this.attr = data.columnAttr;
    }
    let previousFilter: IColumnValueFilter = {
      attr: undefined,
      values: undefined
    };
    if (data.previousFilter) {
      previousFilter = data.previousFilter;
    }
    if (data.columnDataArray && Array.isArray(data.columnDataArray)) {
      this.columnData = this.getDistinctValues(data.columnDataArray, previousFilter);
      this.listData = this.columnData.slice();
    }
  }

  ngOnInit() {
    // TODO
  }

  ngAfterViewInit() {
    this.initializeFilterEvent();
  }

  get listData(): Array<ITableFilterByColumnDataInterface> {
    return this._listData;
  }

  set listData(arg: Array<ITableFilterByColumnDataInterface>) {
    this._listData = arg;
  }

  initializeFilterEvent() {
    if (this.filter) {
      const self = this;
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150).distinctUntilChanged().subscribe(() => {
          let filterValue: string = self.filter.nativeElement.value;
          filterValue = filterValue.toLowerCase();
          self.listData = self.columnData.filter(item => (item.value.toLowerCase().indexOf(filterValue) !== -1));
        });
    }
  }

  getDistinctValues(data: Array<ITableFilterByColumnDataInterface>, previousFilter: IColumnValueFilter): Array<ITableFilterByColumnDataInterface> {
    let result: Array<ITableFilterByColumnDataInterface> = [];
    const distinctValues = Array.from(new Set(data.map(item => item.value)));
    distinctValues.forEach(item => {
      result.push({
        value: item,
        selected: (previousFilter.values || []).indexOf(item) !== -1
      });
    });
    return result;
  }

  get selectedValues(): Array<ITableFilterByColumnDataInterface> {
    return this.columnData.filter(item => item.selected);
  }

  areAllSelected(): boolean {
    return this.selectedValues.length === this.columnData.length;
  }

  isIndeterminate(): boolean {
    return this.selectedValues.length > 0 && this.selectedValues.length !== this.columnData.length;
  }

  onSelectAllChange(event: MatCheckboxChange) {
    this.columnData.forEach((item: ITableFilterByColumnDataInterface) => {
      item.selected = event.checked;
    });
  }

  getColumnValuesFilter(): IColumnValueFilter {
    return {
      attr: this.attr,
      values: this.selectedValues.map((item) => item.value)
    };
  }
}
