import { Directive, Output, EventEmitter } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material';
import { Codes } from '../../../../util/codes';
import { Util } from '../../../../util/util';
import { ISQLOrder } from '../../../../util/service.utils';

export type OMatSortGroupedData = {
  key: any;
  values: any[];
};

@Directive({
  selector: '[oMatSort]',
  exportAs: 'oMatSort',
  inputs: ['disabled: oMatSortDisabled']
})
export class OMatSort extends MatSort {

  activeArray: Array<MatSortable> = [];
  directionById: any = {};

  protected multipleSort: boolean;
  protected activeSortColumn: string;
  protected activeSortDirection: string;

  @Output('matSortChange') readonly oSortChange: EventEmitter<any> = new EventEmitter<any>();

  setMultipleSort(val: boolean) {
    this.multipleSort = val;
  }

  getSortColumns(): any[] {
    let activeData = [];
    this.activeArray.forEach((s: MatSortable) => {
      activeData.push({
        id: s.id,
        direction: this.directionById[s.id]
      });
    });
    return activeData;
  }

  setTableInfo(sortColArray: Array<ISQLOrder>) {
    sortColArray.forEach((colData: ISQLOrder) => {
      const sortDirection: any = colData.ascendent ? Codes.ASC_SORT : Codes.DESC_SORT;
      this.activeArray.push({
        id: colData.columnName,
        start: sortDirection,
        disableClear: false
      });
      this.directionById[colData.columnName] = sortDirection;
    });
  }

  addSortColumn(sortable: MatSortable): void {
    if (this.isActive(sortable)) {
      // workaround for having a propper work in getNextSortDirection;
      this.direction = this.directionById[sortable.id];
      this.directionById[sortable.id] = this.getNextSortDirection(sortable);
      this.direction = '';
      if (this.directionById[sortable.id] === '') {
        this.deleteSortColumn(sortable.id);
      }
    } else {
      if (!this.multipleSort) {
        this.activeArray = [];
        this.directionById = {};
      }
      this.activeArray.push(sortable);
      this.directionById[sortable.id] = sortable.start ? sortable.start : this.start;
    }
    let activeData = this.getSortColumns();
    this._stateChanges.next();
    this.oSortChange.emit(activeData);
  }

  protected deleteSortColumn(id: string) {
    delete this.directionById[id];
    for (let i = 0, len = this.activeArray.length; i < len; i++) {
      if (this.activeArray[i].id === id) {
        this.activeArray.splice(i, 1);
        break;
      }
    }
  }

  isActive(sortable: MatSortable): boolean {
    return Util.isDefined(this.activeArray.find((s: MatSortable) => sortable.id === s.id));
  }

  hasDirection(id: any): boolean {
    let direction;
    if (Util.isDefined(this.directionById[id])) {
      direction = this.directionById[id];
    }
    return (direction === 'asc' || direction === 'desc');
  }

  getSortedData(data: any[]): any[] {
    let sortColumns = this.getSortColumns();
    if (sortColumns.length === 0 || data.length === 0) {
      return data;
    }
    this.sortables.forEach((value, key) => {
      this.deregister(value);
    });
    return this.sortByColumns(data, sortColumns);
  }

  protected sortByColumns(data: any[], sortColumns: any[]) {
    const sortFunctionBind = this.sortFunction.bind(this);
    for (let i = 0, len = sortColumns.length; i < len; i++) {
      const sortC = sortColumns[i];
      this.activeSortColumn = sortC.id;
      this.activeSortDirection = sortC.direction;
      if (i === 0) {
        data = data.sort(sortFunctionBind);
      } else {
        const groupedData: OMatSortGroupedData[] = this.getDataGrouped(data, sortColumns, i);
        if (groupedData.length >= data.length) {
          break;
        }
        data = this.sortGroupedData(groupedData);
      }
    }
    return data;
  }

  protected getDataGrouped(data: any, sortColumns: any[], index: number): OMatSortGroupedData[] {
    var propArr = [];
    sortColumns.forEach((item, i) => {
      if (i < index) {
        propArr.push(item.id);
      }
    });
    if (propArr.length === 0) {
      return data;
    }
    let result: OMatSortGroupedData[] = [];
    data.forEach(item => {
      let value = '';
      propArr.forEach(prop => {
        value += item[prop];
      });

      let filtered = result.filter(resItem => resItem.key === value);
      if (filtered.length === 0) {
        result.push({
          key: value,
          values: [item]
        });
      } else if (filtered.length === 1) {
        filtered[0].values.push(item);
      }
    });
    return result;
  }

  protected sortGroupedData(groupedData: OMatSortGroupedData[]): any[] {
    const self = this;
    return groupedData.reduce((obj: any, item: any) => {
      const arr = item.values;
      const sorted = arr.length <= 1 ? arr : arr.sort(self.sortFunction.bind(self));
      obj.push(...sorted);
      return obj;
    }, []);
  }

  sortFunction(a: any, b: any): number {
    let propertyA: number | string = '';
    let propertyB: number | string = '';
    [propertyA, propertyB] = [a[this.activeSortColumn], b[this.activeSortColumn]];

    let valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim().toLowerCase() : +propertyA;
    let valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim().toLowerCase() : +propertyB;
    return (valueA <= valueB ? -1 : 1) * (this.activeSortDirection === 'asc' ? 1 : -1);
  }

}
