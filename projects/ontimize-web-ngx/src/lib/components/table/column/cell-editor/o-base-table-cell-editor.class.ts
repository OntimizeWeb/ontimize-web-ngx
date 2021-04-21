import { EventEmitter, HostListener, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { InputConverter } from '../../../../decorators/input-converter';
import { OTableColumn } from '../../../../interfaces/o-table-column.interface';
import { SnackBarService } from '../../../../services/snackbar.service';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { ObservableWrapper } from '../../../../util/async';
import { Util } from '../../../../util/util';
import { OTableComponent } from '../../o-table.component';
import { OColumn } from '../o-column.class';
import { OTableColumnComponent } from '../o-table-column.component';

// import { OTableColumnComponent } from '../o-table-column.component';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR = [
  'orequired: required',
  'showPlaceHolder: show-placeholder',
  'olabel: label',
  'updateRecordOnEdit: update-record-on-edit',
  'showNotificationOnEdit: show-notification-on-edit',
  'enabled'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR = [
  'editionStarted',
  'editionCancelled',
  'editionCommitted',
  'onPostUpdateRecord'
];

export class OBaseTableCellEditor implements OnInit {

  protected translateService: OTranslateService;

  @InputConverter()
  orequired: boolean = false;
  @InputConverter()
  showPlaceHolder: boolean = false;
  olabel: string;
  @InputConverter()
  updateRecordOnEdit: boolean = true;
  @InputConverter()
  showNotificationOnEdit: boolean = true;
  protected _enabled: boolean = true;

  protected _tableColumn: OTableColumn;
  protected _table: OTableComponent;

  protected _rowData: any;

  formControl: FormControl;
  controlArgs: any;

  formGroup: FormGroup = new FormGroup({});

  editionStarted: EventEmitter<object> = new EventEmitter<object>();
  editionCancelled: EventEmitter<object> = new EventEmitter<object>();
  editionCommitted: EventEmitter<object> = new EventEmitter<object>();

  onPostUpdateRecord: EventEmitter<object> = new EventEmitter<object>();

  public editorCreated: EventEmitter<object> = new EventEmitter<object>();

  inputRef: any;

  protected type: string;
  registerInColumn: boolean = true;

  protected snackBarService: SnackBarService;
  protected oldValue: any;

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyup(event: KeyboardEvent) {
    this.handleKeyup(event);
  }

  constructor(protected injector: Injector) {
    this.snackBarService = this.injector.get(SnackBarService);
    this.tableColumn = this.injector.get(OTableColumnComponent);
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit(): void {
    this.initialize();
  }

  /**
   * Initializes the cell editor
   */
  public initialize(): void {
    this.createFormControl();
    this.registerEditor();
    this.editorCreated.emit(this);
  }

  protected handleKeyup(event: KeyboardEvent) {
    const oColumn = this.table.getOColumn(this.tableColumnAttr);
    if (!oColumn || !oColumn.editing) {
      return;
    }

    if (this.checkKey(event, "Escape", 27)) {
      this.onEscClicked();
      return;
    }

    if (!this.table.editingCell.contains(event.target)) {
      return;
    }

    if (this.checkKey(event, "Enter", 13) || this.checkKey(event, "Tab", 9)) {
      // intro or tab
      this.commitEdition();
    }
  }

  protected checkKey(event: KeyboardEvent, key: string, keyCode: number): boolean {
    return (event.key && event.key === key) || (event.keyCode && event.keyCode === keyCode);
  }

  /**
   * Creates form control
   */
  createFormControl() {
    if (!this.formControl) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: undefined,
        disabled: !this.enabled
      };
      this.formControl = new FormControl(cfg, validators);
      this.formGroup.addControl(Math.random().toString(36), this.formControl);
    }
  }

  /**
   * Registers editor
   */
  registerEditor() {
    if (this.registerInColumn && !Util.isDefined(this.tableColumn.editor)) {
      this.tableColumn.registerEditor(this);
      if (!Util.isDefined(this.type) && Util.isDefined(this.tableColumn.type)) {
        this.type = this.tableColumn.type;
      }
    }
  }

  /**
   * Gets the value of the cell data
   * @returns cell data
   */
  getCellData(): any {
    return this._rowData[this.tableColumnAttr];
  }

  /**
   * Start edition with given the data
   * @param data
   */
  startEdition(data: any) {
    this.formGroup.reset();
    this.rowData = data;
    if (!this.isSilentControl()) {
      this.editionStarted.emit(this._rowData);
    }
  }



  /**
   * Ends edition with the ability to skip or save changes
   * @param saveChanges
   */
  endEdition(saveChanges: boolean) {
    const oColumn: OColumn = this.table.getOColumn(this.tableColumnAttr);
    if (oColumn) {
      const self = this;
      const updateObserver = this.table.updateCellData(oColumn, this._rowData, saveChanges);
      if (updateObserver) {
        updateObserver.subscribe(res => {
          self.onUpdateSuccess(res);
        }, error => {
          self._rowData[self.tableColumnAttr] = self.oldValue;
          self.table.dataSource.updateRenderedRowData(self._rowData);
          self.table.showDialogError(error, 'MESSAGES.ERROR_UPDATE');
          self.table.cd.detectChanges();
        });
      } else {
        self.table.cd.detectChanges();
      }
    }
  }


  /**
   * Commits edition
   */
  commitEdition() {
    if (!this.formControl.invalid) {
      this.oldValue = this._rowData[this.tableColumnAttr];
      this._rowData[this.tableColumnAttr] = this.formControl.value;
      if (!this.isSilentControl()) {
        this.endEdition(true);
        this.editionCommitted.emit(this._rowData);
      }
    }
  }

  get tableColumn(): OTableColumn {
    return this._tableColumn;
  }

  set tableColumn(arg: OTableColumn) {
    this._tableColumn = arg;
    if (arg) {
      this._table = arg.table;
    }
  }

  get tableColumnAttr(): string {
    if (this._tableColumn) {
      return this._tableColumn.attr;
    }
    return undefined;
  }

  set table(arg: OTableComponent) {
    this._table = arg;
  }

  get table(): OTableComponent {
    return this._table;
  }

  get rowData(): any {
    return this._rowData;
  }

  set rowData(arg: any) {
    this._rowData = arg;
    const cellData = this.getCellData();
    this.formControl.setValue(cellData);
    this.formControl.markAsTouched();

    if (this.inputRef && this.inputRef.nativeElement.type === 'text') {
      this.inputRef.nativeElement.setSelectionRange(0, String(cellData).length);
    }
  }


  /**
   * Resolves validators
   * @returns validators
   */
  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }


  /**
   * Determines whether error has
   * @param error
   * @returns true if error
   */
  hasError(error: string): boolean {
    return this.formControl && this.formControl.touched && this.hasErrorExclusive(error);
  }

  hasErrorExclusive(error: string): boolean {
    let hasError = false;
    const errorsOrder = ['matDatepickerMax', 'matDatepickerMin', 'matDatepickerFilter', 'matDatepickerParse', 'required'];
    const errors = this.formControl.errors;
    if (Util.isDefined(errors)) {
      if (Object.keys(errors).length === 1) {
        return errors.hasOwnProperty(error);
      } else {
        for (let i = 0, len = errorsOrder.length; i < len; i++) {
          hasError = errors.hasOwnProperty(errorsOrder[i]);
          if (hasError) {
            hasError = (errorsOrder[i] === error);
            break;
          }
        }
      }
    }
    return hasError;
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

  getPlaceholder(): string {
    return this.showPlaceHolder ?
      this.translateService.get(this.olabel || this.tableColumn ? (this.tableColumn.title || this.tableColumnAttr) : this.tableColumnAttr) :
      undefined;
  }

  protected onUpdateSuccess(res: any) {
    ObservableWrapper.callEmit(this.onPostUpdateRecord, this._rowData);
    if (this.showNotificationOnEdit) {
      this.snackBarService.open('MESSAGES.UPDATED', { icon: 'check_circle' });
    }
  }

  set enabled(arg: boolean) {
    this._enabled = arg;
    if (this.formControl) {
      this._enabled ? this.formControl.enable() : this.formControl.disable();
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  getFormControl() {
    return this.formControl;
  }
}
