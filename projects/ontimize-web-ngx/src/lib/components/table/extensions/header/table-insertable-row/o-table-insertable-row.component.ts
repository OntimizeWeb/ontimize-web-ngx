import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, EventEmitter, Inject, Injector, OnInit, forwardRef } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { OColumn, OTableComponent } from '../../../o-table.component';
import { OPermissions, OTranslateService, SnackBarService } from '../../../../../services';
import { Observable, ObservableWrapper, Util } from '../../../../../utils';

import { InputConverter } from '../../../../../decorators';
import { OBaseTableCellEditor } from '../../../column/cell-editor/cell-editor';

export const DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW = [
  // columns [string]: columns that can be inserted, separated by ';'. Default: all visible columns.
  'columns',
  'requiredColumns : required-columns',
  // position [first |last ] default: last
  'position',
  'showPlaceHolder: show-placeholder',
  'includeParentKeys: include-parent-keys'
];

export const DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW = [
  'onPostInsertRecord'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-insertable-row',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW,
  outputs: DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW
})

export class OTableInsertableRowComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW = DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW;
  public static DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW = DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW;
  public static AVAILABLE_ROW_POSITIONS = ['first', 'last'];
  public static DEFAULT_ROW_POSITION = 'last';

  protected columns: string;
  protected columnsArray: Array<string> = [];

  protected requiredColumns: string;
  protected requiredColumnsArray: Array<string> = [];

  onPostInsertRecord: EventEmitter<any> = new EventEmitter();
  columnEditors: any = {};
  trWrapper: EventTarget;

  protected position: string = OTableInsertableRowComponent.DEFAULT_ROW_POSITION;

  @InputConverter()
  showPlaceHolder: boolean = false;
  @InputConverter()
  includeParentKeys: boolean = true;

  enabled = true;
  rowData = {};
  protected controls: any = {};
  translateService: OTranslateService;
  snackBarService: SnackBarService;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent,
    protected resolver: ComponentFactoryResolver
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.snackBarService = this.injector.get(SnackBarService);
  }

  ngOnInit() {
    this.columnsArray = Util.parseArray(this.columns, true);
    if (this.columnsArray.length === 0) {
      this.columnsArray = this.table.oTableOptions.visibleColumns;
    }
    this.requiredColumnsArray = Util.parseArray(this.requiredColumns, true);
    if (OTableInsertableRowComponent.AVAILABLE_ROW_POSITIONS.indexOf((this.position || '').toLowerCase()) === -1) {
      this.position = OTableInsertableRowComponent.DEFAULT_ROW_POSITION;
    }
    this.table.setOTableInsertableRow(this);
  }

  isFirstRow(): boolean {
    return this.position === 'first';
  }

  isColumnInsertable(column: OColumn): boolean {
    return (this.columnsArray.indexOf(column.attr) !== -1);
  }

  isColumnRequired(column: OColumn): boolean {
    return (this.requiredColumnsArray.indexOf(column.attr) !== -1);
  }

  initializeEditors(): void {
    const self = this;
    this.table.oTableOptions.columns.forEach((col, i, array) => {
      if (self.isColumnInsertable(col)) {
        const columnEditorType = col.editor ? col.editor.type : col.type;
        if (col.definition) {
          const editor: OBaseTableCellEditor = col.definition.buildCellEditor(columnEditorType, this.resolver, col.definition.container, col.definition);
          this.columnEditors[col.attr] = editor;
          let disabledCol = !this.enabled;
          if (!disabledCol) {
            const columnPermissions: OPermissions = this.table.getOColumnPermissions(col.attr);
            disabledCol = columnPermissions.enabled === false;
          }
          editor.enabled = !disabledCol;
          editor.showPlaceHolder = this.showPlaceHolder || editor.showPlaceHolder;
          editor.table = self.table;
          editor.tableColumn = col.editor ? col.editor.tableColumn : col.definition;
          editor.orequired = this.isColumnRequired(col);
          editor.formControl = this.getControl(col, disabledCol);
          editor.controlArgs = { silent: true };
          editor.rowData = self.rowData;
          editor.startEdition(self.rowData);
          editor.formControl.markAsUntouched();
          col.editor = editor;
        }
      }
      array[i] = col;
    });
  }

  useCellEditor(column: OColumn): boolean {
    return this.isColumnInsertable(column) && Util.isDefined(this.columnEditors[column.attr]);
  }

  getControl(column: OColumn, disabled: boolean = false): FormControl {
    if (!this.controls[column.attr]) {
      const validators: ValidatorFn[] = this.resolveValidators(column);
      const cfg = {
        value: undefined,
        disabled: disabled
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

  getPlaceholder(column: OColumn): string {
    let showPlaceHolder = this.showPlaceHolder;
    const cellEditor = this.columnEditors[column.attr];
    if (cellEditor) {
      showPlaceHolder = cellEditor.showPlaceHolder;
    } else if (column.definition) {
      showPlaceHolder = showPlaceHolder || column.definition.showPlaceHolder;
    }
    return showPlaceHolder ? this.translateService.get(column.title) : undefined;
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode !== 13) {
      // not intro
      return;
    }
    this.trWrapper = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    this.insertRecord();
  }

  insertRecord() {
    const self = this;
    if (!this.validateFields()) {
      // this.table.showDialogError('TABLE.ROW_VALIDATION_ERROR');
      return;
    }
    let values = this.getAttributesValuesToInsert();
    const insertObservable: Observable<any> = this.table.insertRecord(values);
    if (insertObservable) {
      insertObservable.subscribe(res => {
        self.onInsertSuccess(res);
      }, error => {
        self.table.showDialogError(error, 'MESSAGES.ERROR_INSERT');
      });
    }
  }

  protected validateFields(): boolean {
    let valid = true;
    // columns with no editor defined
    Object.keys(this.controls).forEach((controlKey) => {
      const control = this.controls[controlKey];
      control.markAsTouched();
      valid = valid && control.valid;
    });
    return valid;
  }

  protected getAttributesValuesToInsert(): Object {
    let attrValues = {};
    if (this.includeParentKeys) {
      attrValues = this.table.getParentKeysValues();
    }
    Object.keys(this.controls).forEach((controlKey) => {
      attrValues[controlKey] = this.controls[controlKey].value;
    });
    return attrValues;
  }

  protected onInsertSuccess(res: any) {
    ObservableWrapper.callEmit(this.onPostInsertRecord, res);
    this.snackBarService.open('MESSAGES.INSERTED', { icon: 'check_circle' });
    this.cleanFields();

    if (this.table.daoTable.usingStaticData) {
      this.table.setDataArray(res);
    } else {
      this.table.reloadData();
    }
  }

  protected cleanFields() {
    // columns with no editor defined
    const controlKeys = Object.keys(this.controls);
    controlKeys.forEach((controlKey) => {
      this.controls[controlKey].setValue(void 0);
    });
    let firstInputEl = (this.trWrapper as any).querySelector('input');
    if (firstInputEl) {
      setTimeout(() => {
        firstInputEl.focus();
      });
    }
  }

  columnHasError(column: OColumn, error: string): boolean {
    const control = this.controls[column.attr];
    return control && control.touched && control.hasError(error);
  }

}
