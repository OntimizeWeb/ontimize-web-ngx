import { Injector, EventEmitter } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

import { InputConverter } from '../../../../decorators';
import { OTableColumnComponent } from '../o-table-column.component';
import { OTableComponent } from '../../o-table.component';



export class OBaseTableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR = [
    'orequired: required'
  ];
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR = [
    'onEditionEnd'
  ];

  tableColumn: OTableColumnComponent;
  protected fControl: FormControl;

  @InputConverter()
  protected orequired: boolean = false;


  onEditionEnd: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(protected injector: Injector) {
    this.tableColumn = this.injector.get(OTableColumnComponent);
  }

  initialize() {
    this.tableColumn.registerEditor(this);
  }

  onBlur(event: any) {
    const oColumn = this.tableColumn.table.oTableOptions.columns.find(item => item.name === this.tableColumn.attr);
    if (oColumn) {
      oColumn.editing = false;
    }
    this.onEditionEnd.emit(event);
  }

  get table(): OTableComponent {
    return this.tableColumn.table;
  }

  get column(): string {
    return this.tableColumn.attr;
  }

  getControl(): FormControl {
    if (!this.fControl) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: undefined,
        disabled: false
      };
      this.fControl = new FormControl(cfg, validators);
    }
    return this.fControl;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = [];
    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  hasError(error: string): boolean {
    return this.fControl && this.fControl.touched && this.fControl.hasError(error);
  }
}
