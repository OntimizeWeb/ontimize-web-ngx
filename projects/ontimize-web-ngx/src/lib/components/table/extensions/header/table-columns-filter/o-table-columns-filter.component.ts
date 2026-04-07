import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, forwardRef, Inject, Injector, Input, OnInit, QueryList } from '@angular/core';

import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import type { OColumn } from '../../../column/o-column.class';
import { OFilterColumn, OTableColumnsFilterColumnComponent, OTableFilterMode } from './columns/o-table-columns-filter-column.component';
import { OTableBase } from '../../../o-table-base.class';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = [
  // columns [string]: columns that might be filtered, separated by ';'. Default: all visible columns.
  'columns',
  // preloadValues [true|false|yes|no]: indicates whether or not to show the list values when the filter dialog is opened. Default: true.
  'preloadValues: preload-values',
  // mode [default | selection |  custom]
  'mode',
  //filter-values-in-data: 'current-page' | 'all-data': set mode to filter by. Default 'current-page'
  'filterValuesInData: filter-values-in-data'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = [
];

@Component({
  standalone: true,
  selector: 'o-table-columns-filter',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER
})

export class OTableColumnsFilterComponent implements OnInit, AfterContentInit {

  public static DEFAULT_COMPARISON_TYPE = 'VIEW';
  public static MODEL_COMPARISON_TYPE = 'MODEL';
  public static readonly OTableColumnsFilterModes: OTableFilterMode[] = ['default', 'selection', 'custom'];

  protected _columns: string;
  protected _mode: OTableFilterMode = 'default';
  @BooleanInputConverter()
  preloadValues: boolean = true;
  filterValuesInData: 'current-page' | 'all-data';

  protected _columnsArray: Array<OFilterColumn> = [];
  protected columnsComparisonProperty: object = {};

  @ContentChildren(OTableColumnsFilterColumnComponent, { descendants: true }) filterColumns: QueryList<OTableColumnsFilterColumnComponent>;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableBase)) public table: OTableBase
  ) { }

  ngOnInit() {
    if (this.columnsArray.length === 0) {
      this.columnsArray = this.table.oTableOptions.visibleColumns;
    }
    let columns = Util.parseArray(this._columns, true);

    columns.forEach((colData, i, arr) => {
      const colDef = colData.split(Codes.TYPE_SEPARATOR);
      const colName = colDef[0];
      let compType = (colDef[1] || '').toUpperCase();
      if ([OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE, OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE].indexOf(compType) === -1) {
        compType = OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE;
      }
      arr[i] = colName;
      this.columnsComparisonProperty[colName] = compType;
    });

    this.table.setOTableColumnsFilter(this);

    this.filterValuesInData = this.filterValuesInData ?? this.getFilterValuesInDataByDefault();
  }

  ngAfterContentInit() {
    if (!Util.isDefined(this.filterColumns)) return;

    const newColumns = this.parseFilterColumns(this.filterColumns);

    // Create a map to merge arrays based on the "attr" property
    const mergedMap = new Map<string, any>();

    // Add existing columns to the map
    for (const col of this.columnsArray) {
      mergedMap.set(col.attr, col);
    };

    // Add new columns to the map, overriding existing ones with the same "attr"
    for (const col of newColumns) {
      mergedMap.set(col.attr, col);
    }

    // Convert the map values back to an array
    this.columnsArray = Array.from(mergedMap.values());
  }

  // -------------------- Getters / Setters --------------------

  get mode(): OTableFilterMode {
    return this._mode;
  }

  @Input()
  set mode(val: OTableFilterMode) {
    const m = OTableColumnsFilterComponent.OTableColumnsFilterModes.find(e => e === val);
    if (Util.isDefined(m)) {
      this._mode = m;
    } else {
      console.error('Invalid `o-table-columns-filter` mode (' + val + ')');
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

  //---------------- METHODS -----------------
  getFilterColumnByAttr(attr: string) {
    return this.filterColumns.find(filterColumn => filterColumn.attr === attr);
  }

  private getFilterValuesInDataByDefault() {
    return this.table.pageable ? 'current-page' : 'all-data';
  }

  isColumnFilterable(attr: string): boolean {
    const filterColumnDefinition = this.columnsArray.find(x => x.attr === attr);
    return Util.isDefined(filterColumnDefinition) && (filterColumnDefinition.filterLocked ?? true);
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

  getQueryMethodOfFilterColumn(attr: string): string {
    let queryMethod = '';
    if (Util.isDefined(this.columnsArray)) {
      this.columnsArray.forEach(column => {
        if (column.attr == attr) {
          queryMethod = column.queryMethod;
        }
      });
    }
    return queryMethod;
  }

  getFilterValuesInData(attr: string): 'current-page' | 'all-data' {
    let filterValuesInData: 'current-page' | 'all-data' = this.filterValuesInData;
    if (Util.isDefined(this.filterColumns)) {
      for (const column of this.filterColumns) {
        if (column.attr === attr && (column.filterValuesInData === 'current-page' || column.filterValuesInData === 'all-data')) {
          filterValuesInData = column.filterValuesInData;
          break; // salimos del bucle una vez encontrada la coincidencia
        }
      }
    }
    return filterValuesInData;
  }

  getColumnComparisonValue(column: OColumn, val: any): any {
    if (!column || this.columnsComparisonProperty[column.attr] === OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE) {
      return val;
    } else {
      return column.renderer ? column.renderer.getCellData(val) : val;
    }
  }

  // -------------------- Parsing --------------------

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
        let obj: OFilterColumn = { attr: '', sort: '', startView: '', queryMethod: void 0 };
        obj.attr = x.attr;
        obj.sort = x.sort;
        obj.startView = x.startView;
        obj.queryMethod = x.queryMethod;
        if (x.service) {
          obj.service = x.service
        }
        if (x.serviceType) {
          obj.serviceType = x.serviceType
        }
        if (x.separator) {
          obj.separator = x.separator
        }
        if (x.visibleColumns) {
          obj.visibleColumns = Util.parseArray(x.visibleColumns, true)
        }
        obj.filterValuesInData = (x.filterValuesInData || this.filterValuesInData) ?? this.getFilterValuesInDataByDefault();

        obj.dateValueType = x.dateValueType;
        obj.dateFormat = x.dateFormat;
        obj.mode = x.mode;
        return obj;
      });
  }

}
