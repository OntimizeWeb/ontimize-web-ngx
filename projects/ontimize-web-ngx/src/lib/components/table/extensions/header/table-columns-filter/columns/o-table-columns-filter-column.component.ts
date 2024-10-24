import { ChangeDetectionStrategy, Component } from '@angular/core';


export type OFilterColumn = {
  attr: string;
  sort: 'asc' | 'desc' | '';
  startView: 'month' | 'year' | 'multi-year' | '';
  queryMethod?: string;
  filterValuesInData?: 'current-page' | 'all-data';
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
  'filterValuesInData: filter-values-in-data'
];

@Component({
  selector: 'o-table-columns-filter-column',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_COLUMN
})

export class OTableColumnsFilterColumnComponent {

  public attr: string = '';
  public sort: 'asc' | 'desc' | '' = '';
  public startView: 'month' | 'year' | 'multi-year' | '' = 'month';
  public queryMethod: string;
  public filterValuesInData: 'current-page' | 'all-data';

}
