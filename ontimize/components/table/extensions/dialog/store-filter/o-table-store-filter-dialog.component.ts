import { Component, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { ITableFiltersStatus } from '../../o-table-storage.class';

@Component({
  selector: 'o-table-store-filter-dialog',
  templateUrl: './o-table-store-filter-dialog.component.html',
  styleUrls: ['./o-table-store-filter-dialog.component.scss']
})
export class OTableStoreFilterDialogComponent {

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<OTableStoreFilterDialogComponent>
  ) { }

  getFilterAttributes(): ITableFiltersStatus {
    return this.formGroup.value;
  }

}
