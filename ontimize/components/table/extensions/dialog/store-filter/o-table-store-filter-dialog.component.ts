import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ITableFiltersStatus } from '../../o-table-storage.class';

@Component({
  moduleId: module.id,
  selector: 'o-table-store-filter-dialog',
  templateUrl: './o-table-store-filter-dialog.component.html',
  styleUrls: ['./o-table-store-filter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableStoreFilterDialogComponent {

  filterNames: Array<string> = [];
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      this.filterNameValidator.bind(this)
    ]),
    description: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<OTableStoreFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<string>
  ) {
    this.loadFilterNames(data);
  }

  loadFilterNames(filterNames): void {
    this.filterNames = filterNames;
  }

  getFilterAttributes(): ITableFiltersStatus {
    return this.formGroup.value;
  }

  protected filterNameValidator(control: FormControl) {
    let ctrlValue: string = control.value;
    if (this.filterNames.indexOf(ctrlValue) !== -1) {
      return { 'filterNameAlreadyExists': true };
    }
    return {};
  }

}
