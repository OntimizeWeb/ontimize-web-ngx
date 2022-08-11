import { Injectable, Injector } from "@angular/core";
import { OTableExportData } from "../types/table/o-table-export-data.type";
import { Codes } from "../util/codes";

import { OntimizeExportDataBaseProviderService } from "./ontimize-export-data-base-provider.service";

@Injectable()
export class OntimizeExportDataProviderService extends OntimizeExportDataBaseProviderService {

  constructor(protected injector: Injector) {
    super(injector);
  }

  getExportConfiguration(pathService?:string): any {


    let data = [];
    let filter = {};

    // Table data/filters
    switch (this.table.exportMode) {
      case Codes.EXPORT_MODE_ALL:
        filter = this.table.getComponentFilter();
        break;
      case Codes.EXPORT_MODE_LOCAL:
        data = this.table.getAllRenderedValues();
        this.colsNotIncluded.forEach(attr => data.forEach(row => delete row[attr]));
        break;
      default:
        data = this.table.getRenderedValue();
        this.colsNotIncluded.forEach(attr => data.forEach(row => delete row[attr]));
        break;
    }


    const exportData: OTableExportData = {
      data: data,
      columns: this.columns,
      columnNames: this.columnNames,
      sqlTypes: this.sqlTypes,
      filter: filter
    }
    return exportData;
  }
}