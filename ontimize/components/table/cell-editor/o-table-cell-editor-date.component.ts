import { Component, OnInit, Inject, Injector, forwardRef, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { ObservableWrapper, SQLTypes } from '../../../utils';
import { OTableColumnComponent, ITableCellEditor } from '../o-table-column.component';
import { MomentService } from '../../../services';
import * as moment from 'moment';
import { OTableCellEditorDateDialog } from './dialog/o-table-cell-editor-date-dialog.component';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE = [

  // date-model-type [timestamp|string]: if a date column is editable, its model type must be defined to be able to save its value,
  // e.g. classic ontimize server dates come as timestamps (number), but to be able to save them they have to be send as strings with
  // the format 'YYYY-MM-DD HH:mm:ss' (especified in the date-model-format attribute). Default: timestamp.
  'dateModelType: date-model-type',

  // date-model-format [string]: if date model type is string, its date model format should be defined. Default: ISO date.
  'dateModelFormat: date-model-format'
];

@Component({
  selector: 'o-table-cell-editor-date',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE
  ],
  outputs: [
    'onFocus',
    'onBlur',
    'onSubmit'
  ]
})
export class OTableCellEditorDateComponent implements OnInit, ITableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE;

  public static DEFAULT_DATE_MODEL_TYPE = 'timestamp';
  public static DEFAULT_DATE_MODEL_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  public datePickerFormat: string;
  public datePickerLabels: any;

  public onFocus: EventEmitter<any> = new EventEmitter();
  public onBlur: EventEmitter<any> = new EventEmitter();
  public onSubmit: EventEmitter<any> = new EventEmitter();

  protected insertTableInput: any;
  protected momentService: MomentService;
  protected dateModelType: string;
  protected dateModelFormat: string;
  protected previousValue: any;
  protected rendererFormat: string;
  protected cellElement: any;


  protected ng2Dialog: MdDialog;
  protected dialogRef: MdDialogRef<OTableCellEditorDateDialog>;

  constructor(
    @Inject(forwardRef(() => OTableColumnComponent)) protected tableColumn: OTableColumnComponent,
    protected injector: Injector
  ) {
    this.tableColumn = tableColumn;
    this.momentService = this.injector.get(MomentService);
    this.ng2Dialog = this.injector.get(MdDialog);
    this.tableColumn.registerEditor(this);

    this.datePickerFormat = moment.localeData(this.momentService.getLocale())['_longDateFormat']['L'];
    this.datePickerFormat = this.datePickerFormat.toLowerCase().replace(/yyyy/g, 'yy');
    this.previousValue = undefined;
    this.rendererFormat = undefined;
  }

  public ngOnInit() {
    if (typeof (this.dateModelType) === 'undefined') {
      this.dateModelType = OTableCellEditorDateComponent.DEFAULT_DATE_MODEL_TYPE;
    }
    if (typeof (this.dateModelFormat) === 'undefined') {
      this.dateModelFormat = OTableCellEditorDateComponent.DEFAULT_DATE_MODEL_FORMAT;
    }
  }

  public init(parameters: any) {
    if (typeof (parameters) !== 'undefined') {
      if (typeof (parameters.dateModelType) !== 'undefined') {
        this.dateModelType = parameters.dateModelType;
      }
      if (typeof (parameters.dateModelFormat) !== 'undefined') {
        this.dateModelFormat = parameters.dateModelFormat;
      }
      if (typeof (parameters.rendererFormat) !== 'undefined') {
        this.rendererFormat = parameters.rendererFormat;
      }
    }
  }

  public getHtml(data: any): string {
    return '';
  }

  public handleCellBlur(cellElement: any) {
    // empty
  }

  public create(cellElement: any, data: any) {
    // empty
  }

  public destroy(cellElement: any) {
    // empty
  }

  public performInsertion(newValue: any) {
    let timestampValue = undefined;
    if (newValue instanceof Date) {
      const dateTimestamp = newValue.getTime();
      if (dateTimestamp !== this.previousValue) {
        timestampValue = dateTimestamp;
      }
    }
    if (timestampValue !== undefined) {
      let sqlTypes = {};
      sqlTypes[this.tableColumn.attr] = SQLTypes.getSQLTypeValue('DATE');
      this.tableColumn.updateCell(this.cellElement, timestampValue, sqlTypes);
    }
  }

  public handleCellFocus(cellElement: any, data: any) {
    this.configureAndOpenDialog(cellElement, data);
  }

  public createEditorForInsertTable(cellElement: any, data: any) {
    this.configureAndOpenDialog(cellElement, data);
  }

  public getInsertTableValue(): any {
    return undefined;
  }

  public configureAndOpenDialog(cellElement: any, data: any) {
    this.cellElement = cellElement;
    this.previousValue = data;
    ObservableWrapper.callEmit(this.onFocus, { editor: this });
    this.openDialog(data);
  }

  protected openDialog(data: any) {
    let cfg: MdDialogConfig = {
      role: 'dialog',
      disableClose: false,
      width: '300px',
      height: '280px'
    };
    this.dialogRef = this.ng2Dialog.open(OTableCellEditorDateDialog, cfg);
    this.dialogRef.afterClosed().subscribe(result => {
      this.onDialogClose(result);
    });
    this.dialogRef.componentInstance.initialize({
      data: data,
      label: this.tableColumn.attr
    });
  }

  onDialogClose(value: any) {
    ObservableWrapper.callEmit(this.onBlur, { editor: this });
    if (value) {
      this.performInsertion(value);
    }
    ObservableWrapper.callEmit(this.onSubmit, { editor: this });
  }
}

