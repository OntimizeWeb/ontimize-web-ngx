import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { OTableBaseDialogClass } from '../../../../components/table/extensions/dialog/o-table-base-dialog.class';
import { OFilterDefinition } from '../../../../types/o-filter-definition.type';

@Component({
  selector: 'o-store-filter-dialog',
  templateUrl: './o-store-filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OStoreFilterDialogComponent extends OTableBaseDialogClass {

  filterNames: Array<string> = [];
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      this.filterNameValidator.bind(this)
    ]),
    description: new UntypedFormControl('')
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

  protected filterNameValidator(control: UntypedFormControl) {
    const ctrlValue: string = control.value;
    if (this.filterNames.indexOf(ctrlValue) !== -1) {
      return { filterNameAlreadyExists: true };
    }
    return {};
  }

}
