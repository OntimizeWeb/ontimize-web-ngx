import { Injectable, Injector } from "@angular/core";
import { OTableExportData3X } from "../types/table/o-table-export-data.type";
import { Util } from "../util/util";
import { OntimizeExportDataBaseProviderService } from "./ontimize-export-data-base-provider.service";

@Injectable()
export class OntimizeExportDataProviderService3X extends OntimizeExportDataBaseProviderService {

  protected pathService: string;

  constructor(protected injector: Injector) {
    super(injector);
  }

  getExportConfiguration(pathService: string): any {

    // Table data/filters
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
      path: pathService,
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