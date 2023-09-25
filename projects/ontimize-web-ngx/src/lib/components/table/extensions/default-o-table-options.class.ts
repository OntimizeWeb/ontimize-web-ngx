import { OTableOptions } from '../../../interfaces/o-table-options.interface';
import { Codes } from '../../../util/codes';
import { OColumn } from '../column/o-column.class';

export class DefaultOTableOptions implements OTableOptions {

  columns: Array<OColumn> = [];
  filter: boolean = true;
  filterCaseSensitive: boolean = false;

  protected _visibleColumns: Array<any> = [];
  protected _selectColumn: OColumn;
  protected _expandableColumn: OColumn;

  constructor() {
    this.selectColumn = new OColumn();
    this.selectColumn.name = Codes.NAME_COLUMN_SELECT;
    this.selectColumn.title = '';
    this.selectColumn.visible = false;
  }

  get visibleColumns(): Array<any> {
    return this._visibleColumns;
  }

  set visibleColumns(arg: Array<any>) {
    this._visibleColumns = arg;
    this.columns.forEach((oCol: OColumn) => {
      oCol.visible = this._visibleColumns.indexOf(oCol.attr) !== -1;
    });
  }

  get columnsInsertables(): Array<string> {
    return this._visibleColumns.map((col: string) => {
      return col + Codes.SUFFIX_COLUMN_INSERTABLE;
    });
  }

  get selectColumn(): OColumn {
    return this._selectColumn;
  }

  set selectColumn(val: OColumn) {
    this._selectColumn = val;
    this.selectColumn.name = Codes.NAME_COLUMN_SELECT;
    this.selectColumn.title = '';
    this.selectColumn.visible = false;
  }

  get expandableColumn(): OColumn {
    return this._expandableColumn;
  }

  set expandableColumn(val: OColumn) {
    this._expandableColumn = val;
    this._expandableColumn.name = Codes.NAME_COLUMN_EXPANDABLE;
    this._expandableColumn.title = '';
    this._expandableColumn.visible = true;
    this._expandableColumn.resizable = false;
    this._expandableColumn.searchable = false;
  }

}
