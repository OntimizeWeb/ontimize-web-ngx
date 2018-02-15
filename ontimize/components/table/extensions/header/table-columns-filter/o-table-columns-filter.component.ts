import { Component, Inject, forwardRef, OnInit, Injector } from '@angular/core';
import { OTableComponent, OColumn } from '../../../o-table.component';
import { Util } from '../../../../../utils';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = [
  // columns [string]: columns that might be filtered, separated by ';'. Default: all visible columns.
  'columns'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = [
];

export interface IColumnValueFilter {
  attr: string;
  values: any[];
}

@Component({
  selector: 'o-table-columns-filter',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER
})

export class OTableColumnsFilterComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER;
  public static COMPARISON_TYPE_SEPARATOR = ':';

  public static DEFAULT_COMPARISON_TYPE = 'VIEW';
  public static MODEL_COMPARISON_TYPE = 'MODEL';

  columns: string;
  protected columnsArray: Array<string> = [];
  protected columnsComparisonProperty: Object = {};

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
  }

  ngOnInit() {
    this.columnsArray = Util.parseArray(this.columns, true);
    if (this.columnsArray.length === 0) {
      this.columnsArray = this.table.oTableOptions.visibleColumns;
    }
    const self = this;
    this.columnsArray.map((colData, i, arr) => {
      let colDef = colData.split(OTableColumnsFilterComponent.COMPARISON_TYPE_SEPARATOR);
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
}
