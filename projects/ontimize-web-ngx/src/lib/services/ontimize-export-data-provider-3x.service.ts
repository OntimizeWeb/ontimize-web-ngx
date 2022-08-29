import { Injectable, Injector } from "@angular/core";
import { IExportDataProvider } from "../interfaces/export-data-provider.interface";
import { Util } from "../util/util";
import { OntimizeExportDataBaseProviderService } from "./ontimize-export-data-base-provider.service";

@Injectable()
export class OntimizeExportDataProviderService3X extends OntimizeExportDataBaseProviderService implements IExportDataProvider {

  constructor(protected injector: Injector) {
    super(injector);
  }

  getExportConfiguration(param: any): any {

    // Table data/filters/queryParam
    let currentPage = 0;
    if (this.table.pageable && Util.isDefined(this.table.currentPage)) {
      currentPage = this.table.currentPage;
    }
    let exportData: any = {
      type: param.format,
      queryParam: {
        columns: this.columns,
        sqltypes: this.sqlTypes,
        offset: this.table.pageable ? currentPage * this.table.queryRows : -1,
        pageSize: this.table.queryRows,
        filter: this.filter

      },
      advQuery: (this.table.pageable ? true : false),
      path: param.path,
      dao: this.entity
    };

    switch (param.format) {
      case 'xlsx':
        exportData.excelColumns = this.parseExcelColumns(this.columns);
        exportData.columnTitles = this.columnNames;
        exportData.styles = {};
        exportData.rowStyles = {};
        exportData.columnStyles = {};
        exportData.columnTypes = {};
        exportData.cellStyles = {};

        break;
    }

    return exportData;


  }

  private parseExcelColumns(columns: any[]): { [key: string]: string } {
    let obj = {};
    columns.forEach((column: string) => {
      obj[column] = {};
    });
    return obj
  }



}