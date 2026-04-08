import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { OMatErrorDirective } from '../../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../../pipes/o-translate.pipe';
import { OTableBaseDialogClass } from '../../../../components/table/extensions/dialog/o-table-base-dialog.class';
import { OFilterDefinition } from '../../../../types/o-filter-definition.type';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTooltipModule, OTranslatePipe, OMatErrorDirective],
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

  protected filterNameValidator(control: AbstractControl) {
    const ctrlValue: string = control.value;
    if (this.filterNames.indexOf(ctrlValue) !== -1) {
      return { filterNameAlreadyExists: true };
    }
    return {};
  }

}
