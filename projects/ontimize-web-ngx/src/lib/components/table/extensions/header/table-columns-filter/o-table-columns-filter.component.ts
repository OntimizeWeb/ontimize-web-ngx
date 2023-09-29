import { ChangeDetectionStrategy, Component, ContentChildren, forwardRef, Inject, Injector, Input, OnInit, QueryList } from '@angular/core';

import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import type { OColumn } from '../../../column/o-column.class';
import { OTableComponent } from '../../../o-table.component';
import { OFilterColumn, OTableColumnsFilterColumnComponent } from './columns/o-table-columns-filter-column.component';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = [
  // columns [string]: columns that might be filtered, separated by ';'. Default: all visible columns.
  'columns',
  // preloadValues [true|false|yes|no]: indicates whether or not to show the list values when the filter dialog is opened. Default: true.
  'preloadValues: preload-values',
  // mode [default | selection |  custom]
  'mode'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = [
];

@Component({
  selector: 'o-table-columns-filter',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER
})

export class OTableColumnsFilterComponent implements OnInit {

  public static DEFAULT_COMPARISON_TYPE = 'VIEW';
  public static MODEL_COMPARISON_TYPE = 'MODEL';
  public static OTableColumnsFilterModes = ['default', 'selection', 'custom'];

  protected _columns: string;
  protected _mode: string = 'default';
  @BooleanInputConverter()
  preloadValues: boolean = true;

  get mode(): string {
    return this._mode;
  }

  @Input()
  set mode(val: string) {
    const m = OTableColumnsFilterComponent.OTableColumnsFilterModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._mode = m;
    } else {
      console.error('Invalid `o-table-columns-filter` mode (' + val + ')');
    }
  }

  protected _columnsArray: Array<OFilterColumn> = [];
  protected columnsComparisonProperty: object = {};

  @ContentChildren(OTableColumnsFilterColumnComponent, { descendants: true }) filterColumns: QueryList<OTableColumnsFilterColumnComponent>;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }

  ngOnInit() {
    if (this.columnsArray.length === 0) {
      this.columnsArray = this.table.oTableOptions.visibleColumns;
    }
    const self = this;
    let columns = Util.parseArray(this._columns, true);

    columns.forEach((colData, i, arr) => {
      const colDef = colData.split(Codes.TYPE_SEPARATOR);
      const colName = colDef[0];
      let compType = (colDef[1] || '').toUpperCase();
      if ([OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE, OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE].indexOf(compType) === -1) {
        compType = OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE;
      }
      arr[i] = colName;
      self.columnsComparisonProperty[colName] = compType;
    });

    this.table.setOTableColumnsFilter(this);
  }

  ngAfterContentInit() {
    if (Util.isDefined(this.filterColumns)) {
      this.columnsArray = this.columnsArray.concat(this.parseFilterColumns(this.filterColumns));
    }
  }

  isColumnFilterable(attr: string): boolean {
    return Util.isDefined(this.columnsArray.find(x => x.attr === attr));
  }

  getSortValueOfFilterColumn(attr: string): string {
    let sortValue = '';
    if (Util.isDefined(this.columnsArray)) {
      this.columnsArray.forEach(column => {
        if (column.attr == attr) {
          sortValue = column.sort;
        }
      });
    }
    return sortValue;
  }

  getStartViewValueOfFilterColumn(attr: string): string {
    let startView = '';
    if (Util.isDefined(this.columnsArray)) {
      this.columnsArray.forEach(column => {
        if (column.attr == attr) {
          startView = column.startView;
        }
      });
    }
    return startView;
  }

  getColumnComparisonValue(column: OColumn, val: any): any {
    if (!column || this.columnsComparisonProperty[column.attr] === OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE) {
      return val;
    } else {
      return column.renderer ? column.renderer.getCellData(val) : val;
    }
  }

  set columns(arg: string) {
    this._columns = arg;
    this._columnsArray = this.parseColumns(this._columns);
  }

  set columnsArray(arg: OFilterColumn[]) {
    this._columnsArray = arg;
  }

  get columnsArray(): OFilterColumn[] {
    return this._columnsArray;
  }

  parseColumns(columns: string) {
    return columns.split(';')
      .map(x => {
        let obj: OFilterColumn = { attr: '', sort: '', startView: '' };
        obj.attr = x;
        obj.sort = '';
        obj.startView = '';
        return obj;
      });
  }

  parseFilterColumns(columns: QueryList<OTableColumnsFilterColumnComponent>) {
    return columns
      .map(x => {
        let obj: OFilterColumn = { attr: '', sort: '', startView: '' };
        obj.attr = x.attr;
        obj.sort = x.sort;
        obj.startView = x.startView;
        return obj;
      });
  }

}
