import { Component, Injector, Inject, forwardRef, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ObservableWrapper } from '../../../../../../utils';
import { SnackBarService } from '../../../../../../services';
import { OTableEditableRowDataSource, OTableDataSource } from '../../../../o-table.datasource';
import { OTableComponent, OTableOptions, OColumn } from '../../../../o-table.component';
import { OTableInsertableRowComponent } from '../o-table-insertable-row.component';

export const DEFAULT_INPUTS_O_TABLE_EDITABLE_ROW = [
  'tableDataSource: datasource'
];

@Component({
  selector: 'o-table-editable-row',
  templateUrl: './o-table-editable-row.component.html',
  styleUrls: ['./o-table-editable-row.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_EDITABLE_ROW,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-editable-row]': 'true',
    '(document:keyup)': 'handleKeyboardEvent($event)'
  }
})

export class OTableEditableRowComponent {

  protected _tableDataSource: OTableDataSource;

  public editableDatasource: OTableEditableRowDataSource;
  protected _insertableRowTable: OTableInsertableRowComponent;

  protected controls: any = {};

  protected snackBarService: SnackBarService;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.snackBarService = this.injector.get(SnackBarService);
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode !== 13) {
      // not intro
      return;
    }
    let anyTouched = false;
    Object.keys(this.controls).forEach((controlKey) => {
      const control = this.controls[controlKey];
      anyTouched = control.touched || anyTouched;
    });
    if (anyTouched) {
      this.insertRecord();
    }
  }

  get insertableRowTable(): OTableInsertableRowComponent {
    return this._insertableRowTable;
  }

  set insertableRowTable(arg: OTableInsertableRowComponent) {
    this._insertableRowTable = arg;
  }

  get tableDataSource(): OTableDataSource {
    return this._tableDataSource;
  }

  set tableDataSource(value: OTableDataSource) {
    this._tableDataSource = value;
    if (value !== undefined) {
      this.editableDatasource = new OTableEditableRowDataSource(this);
      this.insertableRowTable = this.table.oTableInsertableRowComponent;
    }
  }

  get oTableOptions(): OTableOptions {
    return this.table.oTableOptions;
  }

  isColumnInsertable(column: OColumn): boolean {
    return this.insertableRowTable !== undefined && this.insertableRowTable.isColumnInsertable(column);
  }

  getControl(column: OColumn): FormControl {
    if (!this.controls[column.attr]) {
      const validators: ValidatorFn[] = this.resolveValidators(column);
      const cfg = {
        value: undefined,
        disabled: false
      };
      this.controls[column.attr] = new FormControl(cfg, validators);
    }
    return this.controls[column.attr];
  }

  resolveValidators(column: OColumn): ValidatorFn[] {
    let validators: ValidatorFn[] = [];
    if (this.isColumnRequired(column)) {
      validators.push(Validators.required);
    }
    return validators;
  }

  isColumnRequired(column: OColumn): boolean {
    return this._insertableRowTable.isColumnRequired(column);
  }

  columnHasError(column: OColumn, error: string): boolean {
    const control = this.controls[column.attr];
    return control && control.touched && control.hasError(error);
  }

  insertRecord() {
    let valid = true;
    Object.keys(this.controls).forEach((controlKey) => {
      const control = this.controls[controlKey];
      control.markAsTouched();
      valid = valid && control.valid;
    });

    if (!valid) {
      this.table.showDialogError('TABLE.ROW_VALIDATION_ERROR');
      return;
    }

    const self = this;
    let values = this.getAttributesValuesToInsert();
    this.table.daoTable.insertQuery(values).subscribe(res => {
      self.onInsertSuccess(res);
    }, error => {
      console.log('[OTableEditableRow.insertRecord]: error', error);
      self.table.showDialogError(error, 'MESSAGES.ERROR_INSERT');
    });
  }

  protected getAttributesValuesToInsert(): Object {
    let attrValues = {};
    // let filter = this.table.getFilterUsingParentKeys(this.table.parentItem);
    Object.keys(this.controls).forEach((controlKey) => {
      const control = this.controls[controlKey];
      attrValues[controlKey] = control.value;
    });
    return attrValues;
  }

  protected onInsertSuccess(res: any) {
    console.log('[OTableEditableRow.insertRecord]: response', res);
    ObservableWrapper.callEmit(this.insertableRowTable.onPostInsertRecord, res);
    this.snackBarService.open('MESSAGES.INSERTED', { icon: 'check_circle' });
    this.cleanFields();
    this.table.reloadData();
  }

  protected cleanFields() {
    const controlKeys = Object.keys(this.controls);
    controlKeys.forEach((controlKey) => {
      const control: FormControl = this.controls[controlKey];
      control.reset();
    });
    let firstInputEl = this.elRef.nativeElement.querySelector('input#' + controlKeys[0]);
    if (firstInputEl) {
      firstInputEl.focus();
    }
  }
}
