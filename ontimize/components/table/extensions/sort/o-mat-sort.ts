import { Directive, Output, EventEmitter } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material';
import { Util, Codes } from '../../../../utils';
import { ISQLOrder } from '../../../service.utils';

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

  setActiveSortColumns(sortColArray: Array<ISQLOrder>) {
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
    this.oSortChange.emit(activeData);
    this._stateChanges.next();
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
    const self = this;
    let firstOrd = false;
    sortColumns.forEach((sortC: any, i: number) => {
      self.activeSortColumn = sortC.id;
      self.activeSortDirection = sortC.direction;
      if (self.activeSortDirection !== '') {
        if (!firstOrd) {
          data = data.sort(self.sortFunction.bind(self));
          firstOrd = true;
        } else {
          let groupedData = self.getDataGroupedByProperty(data, sortColumns[i - 1].id);
          if (Object.keys(groupedData).length < data.length) {
            data = self.sortGroupedData(groupedData);
          }
        }
      }
    });
    return data;
  }

  protected getDataGroupedByProperty(data: any, property: string) {
    return data.reduce((obj: any, item: any) => {
      let value = item[property] || '';
      obj[value] = obj[value] || [];
      obj[value].push(item);
      return obj;
    }, {});
  }

  protected sortGroupedData(groupedData: any): any[] {
    let result = [];
    const self = this;
    Object.keys(groupedData).forEach(key => {
      let dataArr = groupedData[key];
      if (dataArr.length > 1) {
        dataArr = dataArr.sort(self.sortFunction.bind(self));
      }
      result.push(...dataArr);
    });
    return result;
  }

  protected sortFunction(a: any, b: any) {
    let propertyA: number | string = '';
    let propertyB: number | string = '';
    [propertyA, propertyB] = [a[this.activeSortColumn], b[this.activeSortColumn]];

    let valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim().toLowerCase() : +propertyA;
    let valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim().toLowerCase() : +propertyB;
    return (valueA <= valueB ? -1 : 1) * (this.activeSortDirection === 'asc' ? 1 : -1);
  }

}
