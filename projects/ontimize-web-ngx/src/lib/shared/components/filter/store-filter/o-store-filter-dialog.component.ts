import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { OTableBaseDialogClass } from '../../../../components/table/extensions/dialog/o-table-base-dialog.class';
import { OFilterDefinition } from '../../../../types/o-filter-definition.type';

@Component({
  selector: 'o-store-filter-dialog',
  templateUrl: './o-store-filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OStoreFilterDialogComponent extends OTableBaseDialogClass {

  filterNames: Array<string> = [];
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      this.filterNameValidator.bind(this)
    ]),
    description: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<OStoreFilterDialogComponent>,
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

  getFilterAttributes(): OFilterDefinition {
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
