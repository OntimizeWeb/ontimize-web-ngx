import { Component, ViewEncapsulation } from '@angular/core';
import { OTableTotalDataSource } from '../../../../o-table.datasource';
import { OTableDataSource } from '../../../../o-table.datasource';
import { OTableOptions } from '../../../../o-table.component';

export const DEFAULT_TABLE_AGGREGATE = [
  // string
  'dataSource: datasource',
  //function
  'oTableOptions: o-table-options'
];

@Component({
  selector: 'o-table-aggregate',
  templateUrl: './o-table-aggregate.component.html',
  styleUrls: ['./o-table-aggregate.component.scss'],
  inputs: DEFAULT_TABLE_AGGREGATE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-aggregate]': 'true'
  }
})
export class OTableAggregateComponent {

  public dataSourceTotals: OTableTotalDataSource | null;

  protected _dataSource: OTableDataSource;
  protected _oTableOptions: OTableOptions;

  get dataSource(): OTableDataSource {
    return this._dataSource;
  }

  set dataSource(value: OTableDataSource) {
    this._dataSource = value;
    this.dataSourceTotals = new OTableTotalDataSource(this);
  }

  get oTableOptions(): OTableOptions {
    return this._oTableOptions;
  }

  set oTableOptions(value: OTableOptions) {
    this._oTableOptions = value;
  }

}
