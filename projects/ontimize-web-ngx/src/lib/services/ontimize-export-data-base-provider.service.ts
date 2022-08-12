import { Injectable, Injector } from "@angular/core";
import { IExportDataProvider } from "../interfaces/export-data-provider.interface";
import { OTableComponent } from "../components/table/o-table.component";
import { OTableExportConfiguration } from "../components/table/extensions/header/table-menu/o-table-export-configuration.class";

@Injectable()
export class OntimizeExportDataBaseProviderService {

  table: OTableComponent;
  columns: any;
  colsNotIncluded: string[]
  columnNames: any;
  sqlTypes: any;
  entity: string;
  service: string;

  constructor(protected injector: Injector) { }


  initializeProvider(table: OTableComponent) {
    this.table = table;
    // Table columns
    const tableOptions = this.table.oTableOptions;
    this.colsNotIncluded = this.table.getColumnsNotIncluded()
    this.columns = tableOptions.visibleColumns.filter(c => this.colsNotIncluded.indexOf(c) === -1);

    // Table column names
    const tableColumnNames = tableOptions.visibleColumns.filter(c => this.colsNotIncluded.indexOf(c) === -1);
    this.columnNames = this.table.getColumnNames(tableColumnNames);

    // Table column sqlTypes
    this.sqlTypes = this.table.getSqlTypes();
    this.entity = this.table.entity;

    this.service = this.table.service;
  }


}