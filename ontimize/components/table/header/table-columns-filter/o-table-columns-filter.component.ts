import { Component, Inject, forwardRef, OnInit, Injector } from '@angular/core';
import { OTableComponent } from '../../o-table.component';
import { Util } from '../../../../utils';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = [
  // columns [string]: columns that might be filtered, separated by ';'. Default: all visible columns.
  'columns'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = [
];

@Component({
  selector: 'o-table-columns-filter',
  templateUrl: './o-table-columns-filter.component.html',
  styleUrls: ['./o-table-columns-filter.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER
})

export class OTableColumnsFilterComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER;

  protected columns: string;
  protected columnsArray: Array<string> = [];

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
  }

  ngOnInit() {
    this.columnsArray = Util.parseArray(this.columns);
    this.table.setFilterableColumns(this.columnsArray);
  }
}
