import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, forwardRef } from '@angular/core';
import { Codes, Util } from '../../../../../utils';
import { OColumn, OTableComponent } from '../../../o-table.component';
import { InputConverter } from '../../../../../decorators';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = [
  // columns [string]: columns that might be filtered, separated by ';'. Default: all visible columns.
  'columns',
  // preloadValues [true|false|yes|no]: indicates whether or not to show the list values when the filter dialog is opened. Default: true.
  'preloadValues: preload-values',
  //mode [default | selection |  custom]
  'mode'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = [
];

export enum ColumnValueFilterOperator { IN, LESS_EQUAL, MORE_EQUAL, BETWEEN, EQUAL }

export interface IColumnValueFilter {
  attr: string;
  operator: ColumnValueFilterOperator;
  values: any;
}

export type OTableColumnsFilterMode = 'default' | 'selection' | 'custom';
@Component({
  moduleId: module.id,
  selector: 'o-table-columns-filter',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER
})

export class OTableColumnsFilterComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER;

  public static DEFAULT_COMPARISON_TYPE = 'VIEW';
  public static MODEL_COMPARISON_TYPE = 'MODEL';
  public static OTableColumnsFilterModes = ['default', 'selection', 'custom'];

  protected _columns: string;
  protected _mode: string = 'default';
  @InputConverter()
  preloadValues: boolean = true;

  get mode(): string {
    return this._mode;
  }

  @InputConverter()
  set mode(val: string) {
    let m = OTableColumnsFilterComponent.OTableColumnsFilterModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._mode = m;
    } else {
      console.error('Invalid `o-table-columns-filter` mode (' + val + ')');
    }
  }

  protected _columnsArray: Array<string> = [];
  protected columnsComparisonProperty: Object = {};

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) { }

  ngOnInit() {
    if (this.columnsArray.length === 0) {
      this.columnsArray = this.table.oTableOptions.visibleColumns;
    }
    const self = this;
    this.columnsArray.forEach((colData, i, arr) => {
      let colDef = colData.split(Codes.TYPE_SEPARATOR);
      let colName = colDef[0];
      let compType = (colDef[1] || '').toUpperCase();
      if ([OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE, OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE].indexOf(compType) === -1) {
        compType = OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE;
      }
      arr[i] = colName;
      self.columnsComparisonProperty[colName] = compType;
    });
    this.table.setOTableColumnsFilter(this);
  }

  isColumnFilterable(attr: string) {
    return (this.columnsArray.indexOf(attr) !== -1);
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
    this._columnsArray = Util.parseArray(this._columns, true);
  }

  set columnsArray(arg: string[]) {
    this._columnsArray = arg;
  }

  get columnsArray(): string[] {
    return this._columnsArray;
  }

}
