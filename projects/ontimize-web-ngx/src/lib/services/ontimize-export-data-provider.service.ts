import { Injectable, Injector } from "@angular/core";
import { IExportDataProvider } from "../interfaces/export-data-provider.interface";
import { OTableExportData } from "../interfaces/o-table-export-data.interface";
import { OntimizeExportDataBaseProviderService } from "./ontimize-export-data-base-provider.service";

@Injectable()
export class OntimizeExportDataProviderService extends OntimizeExportDataBaseProviderService implements IExportDataProvider {

  constructor(protected injector: Injector) {
    super(injector);
  }

  getExportConfiguration(): OTableExportData {

    // Table data/filters
    let data = [];

    /*
     PENDING THAT THIS FUNCTIONALITY IS COMPATIBLE WITH ONTIMIZE BACK
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
     */


    const exportData: OTableExportData = {
      data: data,
      columns: this.columns,
      columnNames: this.columnNames,
      sqlTypes: this.sqlTypes,
      filter: this.filter
    }
    return exportData;
  }
}