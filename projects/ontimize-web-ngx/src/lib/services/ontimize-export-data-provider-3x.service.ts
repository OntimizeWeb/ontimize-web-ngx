import { Injectable, Injector } from "@angular/core";
import { IExportDataProvider } from "../interfaces/export-data-provider.interface";
import { OTableExportData3X } from "../types/table/o-table-export-data.type";
import { Util } from "../util/util";
import { OntimizeExportDataBaseProviderService } from "./ontimize-export-data-base-provider.service";

@Injectable()
export class OntimizeExportDataProviderService3X extends OntimizeExportDataBaseProviderService implements IExportDataProvider {

  protected pathService: string;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getExportConfiguration(): OTableExportData3X {

    // Table data/filters/queryParam
    let currentPage = 0;
    if (this.table.pageable && Util.isDefined(this.table.currentPage)) {
      currentPage = this.table.currentPage;
    }
    let exportData: OTableExportData3X = {
      queryParam: {
        columns: this.columns,
        sqltypes: this.sqlTypes,
        offset: this.table.pageable ? currentPage * this.table.queryRows : -1,
        pageSize: this.table.queryRows

      },
      advQuery: (this.table.pageable ? true : false),
      path: this.pathService,
      dao: this.entity,
      excelColumns: this.parseExcelColumns(this.columns),
      columnTitles: this.columnNames,
      styles: {},
      rowStyles: {},
      columnStyles: {},
      columnTypes: {},
      cellStyles: {}

    };

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