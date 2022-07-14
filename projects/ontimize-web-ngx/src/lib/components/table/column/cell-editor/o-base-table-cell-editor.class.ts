import {
  ContentChildren,
  EventEmitter,
  HostListener,
  Injector,
  OnInit,
  QueryList,
  Renderer2,
  Type,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../../../decorators/input-converter';
import { OTableColumn } from '../../../../interfaces/o-table-column.interface';
import { SnackBarService } from '../../../../services/snackbar.service';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { OValidatorComponent } from '../../../../shared/components/validation/o-validator.component';
import { ErrorData } from '../../../../types/error-data.type';
import { ObservableWrapper } from '../../../../util/async';
import { Util } from '../../../../util/util';
import { OTableComponent } from '../../o-table.component';
import { OColumn } from '../o-column.class';
import { OTableColumnComponent } from '../o-table-column.component';

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

  @ViewChild('input', { static: false })
  protected inputRef: any;

  protected type: string;
  registerInColumn: boolean = true;

  protected snackBarService: SnackBarService;
  protected oldValue: any;
  cellEditorId: string;

  public errorsData: ErrorData[] = [];
  protected validatorsSubscription: Subscription;
  @ContentChildren(OValidatorComponent)
  protected validatorChildren: QueryList<OValidatorComponent>;
  protected renderer: Renderer2;

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyup(event: KeyboardEvent) {
    this.handleKeyup(event);
  }

  constructor(protected injector: Injector) {
    this.snackBarService = this.injector.get<SnackBarService>(SnackBarService as Type<SnackBarService>);
    this.tableColumn = this.injector.get<OTableColumnComponent>(OTableColumnComponent as Type<OTableColumnComponent>);
    this.translateService = this.injector.get<OTranslateService>(OTranslateService as Type<OTranslateService>);
    this.cellEditorId = Util.randomNumber().toString(36);
    this.renderer = this.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  }

  ngOnInit(): void {
    this.initialize();
  }

  public ngOnChanges(): void {
    this.updateValidators();
  }

  ngAfterViewInit(): void {
    if (this.validatorChildren) {
      this.validatorsSubscription = this.validatorChildren.changes.subscribe(() => {
        this.updateValidators();
      });
      if (this.validatorChildren.length > 0) {
        this.updateValidators();
      }
    }
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
    const escClicked = this.checkKey(event, 'Escape', 27);
    const enterClicked = this.checkKey(event, 'Enter', 13);
    const tabClicked = this.checkKey(event, 'Tab', 9);
    if (!escClicked && !enterClicked && !tabClicked) {
      return;
    }

    if (escClicked) {
      this.onEscClicked();
      return;
    }

    if (this.table.editingCell && !this.table.editingCell.contains(event.target)) {
      return;
    }

    if (enterClicked || tabClicked) {
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
    }
    if (!Util.isDefined(this.formGroup.get(this.cellEditorId))) {
      this.formGroup.addControl(this.cellEditorId, this.formControl);
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
    this.table.cd.detectChanges();

    // Selecting text if the template input element has defined the id=cellEditorId
    const inputEl = document.getElementById(this.cellEditorId);
    if (inputEl) {
      (inputEl as HTMLInputElement).select();
    }
    this.setEditingRowClass(true)
  }

  /**
   * Ends edition with the ability to skip or save changes
   * @param saveChanges
   */
  endEdition(saveChanges: boolean) {
    const oColumn: OColumn = this.table.getOColumn(this.tableColumnAttr);
    if (oColumn) {
      const updateObserver = this.table.updateCellData(oColumn, this._rowData, saveChanges);
      if (updateObserver) {
        updateObserver.subscribe(res => {
          this.onUpdateSuccess(res);
          this.table.daoTable.setDataArray(this.table.daoTable.data);
        }, error => {
          this._rowData[this.tableColumnAttr] = this.oldValue;
          this.table.dataSource.updateRenderedRowData(this._rowData);
          this.table.showDialogError(error, 'MESSAGES.ERROR_UPDATE');
          this.table.cd.detectChanges();
        });
      } else {
        this.table.cd.detectChanges();
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
  }


  /**
   * Resolves validators
   * @returns validators
   */
  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (this.tableColumn.angularValidatorsFn) {
      this.tableColumn.angularValidatorsFn.forEach((fn: ValidatorFn) => {
        validators.push(fn);
      });
    }
    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  public getActiveOErrors() {
    return this.formControl.errors ? Object.keys(this.formControl.errors) : [];
  }

  public getErrorText(oError: any) {
    if (this.tableColumn && this.tableColumn.editor && this.tableColumn.editor.errorsData) {
      const error = this.tableColumn.editor.errorsData.find((item) => item.name === oError);
      return error ? error.text : '';
    } else {
      return '';
    }
  }

  protected updateValidators(): void {
    if (!this.formControl) {
      return;
    }
    this.formControl.clearValidators();
    const validators = this.resolveValidators();
    if (this.validatorChildren) {
      this.validatorChildren.forEach((oValidator: OValidatorComponent) => {
        const validatorFunction: ValidatorFn = oValidator.getValidatorFn();
        if (validatorFunction) {
          validators.push(validatorFunction);
        }
        const errorsData: ErrorData[] = oValidator.getErrorsData();
        this.errorsData.push(...errorsData);
      });
    }
    this.formControl.setValidators(validators);
  }

  /**
   * Determines whether error has
   * @param error
   * @returns true if error
   */
  hasError(error: string): boolean {
    return this.formControl && this.formControl.touched && (this.hasErrorExclusive(error) || this.formControl.hasError(error));
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

  setEditingRowClass(addClass: boolean) {
    const inputEl = document.getElementById(this.cellEditorId);
    if (inputEl) {
      const tableRowEl = inputEl.closest('tr');
      if (tableRowEl) {
        addClass ? this.renderer.addClass(tableRowEl, 'o-table-editing-row') :
          this.renderer.removeClass(tableRowEl, 'o-table-editing-row')
          this.table.cd.detectChanges()
      }
    }
  }

}
