import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatListOption, MatSelectionList } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { ITableFiltersStatus } from '../../o-table-storage.class';

@Component({
  selector: 'o-table-load-filter-dialog',
  templateUrl: './o-table-load-filter-dialog.component.html',
  styleUrls: ['./o-table-load-filter-dialog.component.scss']
})
export class OTableLoadFilterDialogComponent implements OnInit {

  @ViewChild(MatSelectionList) filterList: MatSelectionList;

  filters: Array<ITableFiltersStatus> = [];
  private anyFilterDeleted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<OTableLoadFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<ITableFiltersStatus>
  ) {
    this.loadFilters(data);
  }

  ngOnInit(): void {
    this.filterList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  loadFilters(filters: Array<ITableFiltersStatus>): void {
    this.filters = [];
    filters.forEach((filter: ITableFiltersStatus) => {
      this.filters.push(filter);
    });
  }

  getSelectedFilterName(): string {
    let selected: MatListOption[] = this.filterList.selectedOptions.selected;
    return selected.length ? selected[0].value : void 0;
  }

  removeFilter(index: number) {
    this.anyFilterDeleted = true;
    this.filters.splice(index, 1);
  }

  onDialogClose(val: boolean) {
    this.dialogRef.close({
      updateSelectedFilter: val,
      updateStoredFilters: this.anyFilterDeleted
    });
  }
}
