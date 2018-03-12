import { Injector, EventEmitter, OnInit, HostListener } from '@angular/core';
import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';

import { InputConverter } from '../../../../decorators';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';

export class OBaseTableCellEditor implements OnInit {


  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR = [
    'orequired: required'
  ];

  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR = [
    'editionStarted',
    'editionCancelled',
    'editionCommitted'
  ];

  @InputConverter()
  orequired: boolean = false;

  tableColumn: OTableColumnComponent;

  protected _rowData: any;

  formControl: FormControl;
  controlArgs: any;

  formGroup: FormGroup = new FormGroup({});

  editionStarted: EventEmitter<Object> = new EventEmitter<Object>();
  editionCancelled: EventEmitter<Object> = new EventEmitter<Object>();
  editionCommitted: EventEmitter<Object> = new EventEmitter<Object>();

  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    const oColumn = this.table.getOColumn(this.tableColumn.attr);
    if (!oColumn.editing) {
      return;
    }
    if (event.keyCode === 27) {
      this.onEscClicked();
    } else if (event.keyCode === 13 || event.keyCode === 9) {
      this.commitEdition();
    }
  }
  inputRef: any;

  constructor(protected injector: Injector) {
    this.tableColumn = this.injector.get(OTableColumnComponent);
  }

  createFormControl() {
    if (!this.formControl) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: undefined,
        disabled: false
      };
      this.formControl = new FormControl(cfg, validators);
      this.formGroup.addControl(Math.random().toString(36), this.formControl);
    }
  }

  ngOnInit(): void {
    this.createFormControl();
  }

  initialize() {
    this.tableColumn.registerEditor(this);
  }

  getCellData(): any {
    return this._rowData[this.tableColumn.attr];
  }

  startEdtion(data: any) {
    this.formGroup.reset();
    this.rowData = data;
    if (!this.isSilentControl()) {
      this.editionStarted.emit(this._rowData);
    }
  }

  endEdition(saveChanges) {
    const oColumn = this.table.getOColumn(this.tableColumn.attr);
    if (oColumn) {
      this.table.updateCellData(oColumn, this._rowData, saveChanges);
    }
  }

  commitEdition() {
    if (!this.formControl.invalid) {
      this._rowData[this.tableColumn.attr] = this.formControl.value;
      if (!this.isSilentControl()) {
        this.endEdition(true);
        this.editionCommitted.emit(this._rowData);
      }
    }
  }

  get table(): OTableComponent {
    return this.tableColumn.table;
  }

  get column(): string {
    return this.tableColumn.attr;
  }

  get rowData(): any {
    return this._rowData;
  }

  set rowData(arg: any) {
    this._rowData = arg;
    const cellData = this.getCellData();
    this.formControl.setValue(cellData);
    this.formControl.markAsTouched();

    if (this.inputRef) {
      this.inputRef.nativeElement.setSelectionRange(0, String(cellData).length);
    }
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
    if (!this.isSilentControl()) {
      this.endEdition(false);
      this.editionCancelled.emit(this._rowData);
    }
  }

  protected isSilentControl(): boolean {
    return this.controlArgs !== undefined && this.controlArgs.silent;
  }
}
