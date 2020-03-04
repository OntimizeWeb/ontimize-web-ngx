import { OColumn } from '../../../interfaces/o-column.interface';
import { OTableOptions } from '../../../interfaces/o-table-options.interface';
import { OTableComponent } from '../o-table.component';

export class DefaultOTableOptions implements OTableOptions {
  selectColumn: OColumn;
  columns: Array<OColumn> = [];
  _visibleColumns: Array<any> = [];
  filter: boolean = true;
  filterCaseSensitive: boolean = false;

  constructor() {
    this.selectColumn.name = OTableComponent.NAME_COLUMN_SELECT;
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
      return col + OTableComponent.SUFFIX_COLUMN_INSERTABLE;
    });
  }
}
