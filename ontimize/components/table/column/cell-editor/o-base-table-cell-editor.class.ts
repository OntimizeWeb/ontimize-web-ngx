import { Injector, EventEmitter } from '@angular/core';
import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';

import { InputConverter } from '../../../../decorators';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';

export class OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR = [
    'orequired: required'
  ];

  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR = [
    'editionStarted',
    'editionCancelled',
    'editionCommitted'
  ];

  @InputConverter()
  protected orequired: boolean = false;

  tableColumn: OTableColumnComponent;

  rowData: any;

  formControl: FormControl;
  formGroup: FormGroup = new FormGroup({});

  editionStarted: EventEmitter<Object> = new EventEmitter<Object>();
  editionCancelled: EventEmitter<Object> = new EventEmitter<Object>();
  editionCommitted: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(protected injector: Injector) {
    this.tableColumn = this.injector.get(OTableColumnComponent);
    this.createFormControl();
  }

  createFormControl() {
    if (!this.formControl) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: undefined,
        disabled: false
      };
      this.formControl = new FormControl(cfg, validators);
      this.formGroup.addControl('cell-editor', this.formControl);
    }
  }

  initialize() {
    this.tableColumn.registerEditor(this);
  }

  getCellData(): any {
    return this.rowData[this.tableColumn.attr];
  }

  onFocus(event: any) {
    this.editionStarted.emit(this.rowData);
  }

  protected stopEditing() {
    const oColumn = this.tableColumn.table.oTableOptions.columns.find(item => item.name === this.tableColumn.attr);
    if (oColumn) {
      oColumn.editing = false;
    }
  }

  onBlur(event: any) {
    this.stopEditing();
    this.rowData[this.tableColumn.attr] = this.formControl.value;
    this.editionCommitted.emit(this.rowData);
  }

  get table(): OTableComponent {
    return this.tableColumn.table;
  }

  get column(): string {
    return this.tableColumn.attr;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = [];
    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  hasError(error: string): boolean {
    return this.formControl && this.formControl.touched && this.formControl.hasError(error);
  }

  getErrorValue(error: string, prop: string): string {
    return this.formControl.hasError(error) ? this.formControl.getError(error)[prop] || '' : '';
  }

  onEscClicked() {
    this.stopEditing();
    this.editionCancelled.emit(this.rowData);
  }
}
