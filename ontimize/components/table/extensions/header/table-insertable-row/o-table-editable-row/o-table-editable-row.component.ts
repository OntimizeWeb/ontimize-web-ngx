import { Component, Injector, Inject, forwardRef, ViewEncapsulation, ElementRef, ChangeDetectionStrategy, ComponentFactoryResolver, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ObservableWrapper, Util } from '../../../../../../utils';
import { SnackBarService, OTranslateService, OPermissions } from '../../../../../../services';
import { OTableEditableRowDataSource, OTableDataSource } from '../../../../o-table.datasource';
import { OTableComponent, OTableOptions, OColumn } from '../../../../o-table.component';
import { OTableColumnComponent } from '../../../../column/o-table-column.component';
import { OBaseTableCellEditor } from '../../../../column/cell-editor/o-base-table-cell-editor.class';
import { OTableInsertableRowComponent } from '../o-table-insertable-row.component';

export const DEFAULT_INPUTS_O_TABLE_EDITABLE_ROW = [
  'tableDataSource: datasource'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-editable-row',
  templateUrl: './o-table-editable-row.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_EDITABLE_ROW,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-editable-row]': 'true',
    '(document:keyup)': 'handleKeyboardEvent($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    OTableColumnComponent
  ]
})

export class OTableEditableRowComponent {
  protected translateService: OTranslateService;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  protected _tableDataSource: OTableDataSource;

  public editableDatasource: OTableEditableRowDataSource = null;
  protected _insertableRowTable: OTableInsertableRowComponent;

  protected controls: any = {};
  columnEditors: any = {};

  protected snackBarService: SnackBarService;

  rowData: any = {};

  protected table: OTableComponent;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    protected resolver: ComponentFactoryResolver,
    public cd: ChangeDetectorRef,
    @Inject(forwardRef(() => OTableColumnComponent)) protected tableColumn: OTableColumnComponent
  ) {
    this.snackBarService = this.injector.get(SnackBarService);
    this.table = this.tableColumn.table;
    this.translateService = this.injector.get(OTranslateService);
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode !== 13) {
      // not intro
      return;
    }
    if (!this.elRef.nativeElement.contains(event.target)) {
      // if keyboard event is not contained in this editable-row
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.insertRecord();
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
      this.initializeEditors();
    }
  }

  get oTableOptions(): OTableOptions {
    return this.table.oTableOptions;
  }

  isColumnInsertable(column: OColumn): boolean {
    return this.insertableRowTable !== undefined && this.insertableRowTable.isColumnInsertable(column);
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

  isColumnRequired(column: OColumn): boolean {
    return this._insertableRowTable.isColumnRequired(column);
  }

  columnHasError(column: OColumn, error: string): boolean {
    const control = this.controls[column.attr];
    return control && control.touched && control.hasError(error);
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

  protected getAttributesValuesToInsert(): Object {
    let attrValues = {};
    if (this.insertableRowTable.includeParentKeys) {
      attrValues = this.table.getParentKeysValues();
    }
    Object.keys(this.controls).forEach((controlKey) => {
      attrValues[controlKey] = this.controls[controlKey].value;
    });
    return attrValues;
  }

  protected onInsertSuccess(res: any) {
    ObservableWrapper.callEmit(this.insertableRowTable.onPostInsertRecord, res);
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
      this.controls[controlKey].reset();
    });
    let firstInputEl = this.elRef.nativeElement.querySelector('input#' + controlKeys[0]);
    if (firstInputEl) {
      setTimeout(() => {
        firstInputEl.focus();
      });
    }
  }

  useCellEditor(column: OColumn): boolean {
    return this._insertableRowTable.isColumnInsertable(column) && Util.isDefined(this.columnEditors[column.attr]);
  }

  initializeEditors(): void {
    const self = this;
    this.table.oTableOptions.columns.forEach(col => {
      if (self._insertableRowTable.isColumnInsertable(col)) {
        const columnEditorType = col.editor ? col.editor.type : col.type;
        const editor: OBaseTableCellEditor = this.tableColumn.buildCellEditor(columnEditorType, this.resolver, this.container, col.editor);
        this.columnEditors[col.attr] = editor;
        let disabledCol = !this._insertableRowTable.enabled;
        if (!disabledCol) {
          const columnPermissions: OPermissions = this.table.getOColumnPermissions(col.attr);
          disabledCol = columnPermissions.enabled === false;
        }
        editor.enabled = !disabledCol;
        editor.registerInColumn = false;
        editor.showPlaceHolder = this._insertableRowTable.showPlaceHolder || editor.showPlaceHolder;
        editor.table = self.table;
        editor.tableColumn = col.editor ? col.editor.tableColumn : col.definition;
        editor.orequired = this.isColumnRequired(col);
        editor.formControl = this.getControl(col, disabledCol);
        editor.controlArgs = { silent: true };
        editor.startEdition(self.rowData);
        editor.formControl.markAsUntouched();
      }
    });
  }

  getPlaceholder(column: OColumn): string {
    const cellEditor = this.columnEditors[column.attr];
    const showPlaceHolder = cellEditor ? cellEditor.showPlaceHolder : (this._insertableRowTable.showPlaceHolder || column.definition.showPlaceHolder);
    return showPlaceHolder ? this.translateService.get(column.title) : undefined;
  }
}
