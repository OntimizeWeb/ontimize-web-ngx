import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Util } from '../../../../../../util/util';
import { Codes } from '../../../../../../util/codes';


export type OFilterColumn = {
  attr: string;
  sort: 'asc' | 'desc' | '';
  startView: 'month' | 'year' | 'multi-year' | '';
  queryMethod?: string;
  filterValuesInData?: 'current-page' | 'all-data';
  service?: string;
  entity?: string;
  serviceType?: string;
  separator?: string;
  visibleColumns?: string[];
  filterLocked?: boolean;
  filterLockedMessage?: string;
};

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_COLUMN = [
  // attr [string]: column name.
  'attr',
  // sort [asc|desc]: initial sorting, with the format column:[ASC|DESC].
  'sort',
  // startView [month|year|multi-year]: Datepicker initial view in case of date column.
  'startView:start-view',
  'queryMethod:query-method',
  //filter-values-in-data:  'current-page' | 'all-data': set mode to filter by. Default 'current-page'
  'filterValuesInData: filter-values-in-data',
  //filter-locked
  'filterLocked:filter-locked',
  //filter-locked-message
  'filterLockedMessage:filter-locked-message',
  //service
  'service',
  //service-type
  'serviceType:service-type',
  //entity
  'entity',
  'visibleColumns: visible-columns',
  'separator'
];

@Component({
  selector: 'o-table-columns-filter-column',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_COLUMN
})

export class OTableColumnsFilterColumnComponent implements OnInit {

  public attr: string = '';
  public sort: 'asc' | 'desc' | '' = '';
  public startView: 'month' | 'year' | 'multi-year' | '' = 'month';
  public queryMethod: string;
  public filterValuesInData: 'current-page' | 'all-data';

  public filterLocked: boolean = false;
  public filterLockedMessage: string = 'O_TABLE_COLUMN_FILTER_COLUMN.DEFAULT_LOCKED_MESSAGE';
  public service: string;
  public serviceType: string;
  public entity: string;

  public visibleColsArray: string[];
  public visibleColumns: string;
  public separator: string = Codes.SPACE_SEPARATOR;

  ngOnInit() {
    this.visibleColsArray = Util.parseArray(this.visibleColumns, true);
    this.filterValuesInData = this.filterValuesInData ?? (this.queryMethod ? 'all-data' : 'current-page');
  }

}
