import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { OTableFiltersStatus } from '../../../../../types/table/o-table-filter-status.type';
import { OTableBaseDialogClass } from '../o-table-base-dialog.class';

@Component({
  selector: 'o-table-store-filter-dialog',
  templateUrl: './o-table-store-filter-dialog.component.html',
  styleUrls: ['./o-table-store-filter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableStoreFilterDialogComponent extends OTableBaseDialogClass {

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
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) data: Array<string>
  ) {
    super(injector);
    this.setFormControl(this.formGroup.get('name'));
    this.loadFilterNames(data);
  }

  loadFilterNames(filterNames): void {
    this.filterNames = filterNames;
  }

  getFilterAttributes(): OTableFiltersStatus {
    return this.formGroup.value;
  }

  protected filterNameValidator(control: FormControl) {
    const ctrlValue: string = control.value;
    if (this.filterNames.indexOf(ctrlValue) !== -1) {
      return { filterNameAlreadyExists: true };
    }
    return {};
  }

}
