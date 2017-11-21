import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdButton } from '@angular/material';

import { DialogService, OExportExtension, OntimizeExportService, OTranslateService } from '../../../../../services';
import { SQLTypes, Util } from '../../../../../utils';

export class OTableExportConfiguration {
  data: any[];
  columns: Array<any>;
  columnNames: Object;
  sqlTypes: Object;
  service: string;
}

@Component({
  selector: 'o-table-export-dialog',
  templateUrl: 'o-table-export-dialog.component.html',
  styleUrls: ['o-table-export-dialog.component.scss']
})
export class OTableExportDialogComponent implements OnInit {

  protected dialogService: DialogService;
  protected exportService: OntimizeExportService;
  protected translateService: OTranslateService;

  constructor(
    public dialogRef: MdDialogRef<OTableExportDialogComponent>,
    protected injector: Injector,
    @Inject(MD_DIALOG_DATA) protected config: OTableExportConfiguration
  ) {
    this.dialogService = injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(): void {
    this.configureService();
  }

  configureService(): void {
    let loadingService: any = OntimizeExportService;
    // TODO: allow service type selection (extension)
    // if (this.serviceType) {
    //   loadingService = this.serviceType;
    // }
    try {
      this.exportService = this.injector.get(loadingService);
      let serviceCfg = this.exportService.getDefaultServiceConfiguration(this.config.service);
      this.exportService.configureService(serviceCfg);
    } catch (e) {
      console.error(e);
    }
  }

  exportExcel(excelButton: MdButton): void {
    excelButton.disabled = true;
    let exportData = {
      data: this.config.data,
      columns: this.config.columns,
      columnNames: this.config.columnNames,
      sqlTypes: this.config.sqlTypes
    };
    let self = this;
    this.proccessExportData(exportData.data, exportData.sqlTypes);
    this.exportService.exportData(exportData, OExportExtension.Excel).subscribe(
      (resp) => {
        self.exportService.downloadFile(resp.data[0]['xslxId'], OExportExtension.Excel).subscribe(
          () => self.dialogRef.close(true),
          downloadError => {
            console.log(downloadError);
            self.dialogRef.close(false);
          }
        );
      },
      (err) => {
        console.log(err);
        if (err) {
          self.dialogService.alert('ERROR', err).then(() => self.dialogRef.close(false));
        } else {
          self.dialogService.alert('ERROR', 'MESSAGES.ERROR_EXPORT_TABLE_DATA').then(() => self.dialogRef.close(false));
        }
      }
    );
  }

  proccessExportData(data: Object[], sqlTypes: Object): void {
    // Parse boolean
    Object.keys(sqlTypes).forEach(key => {
      if (SQLTypes.BOOLEAN === sqlTypes[key]) {
        let yes = this.translateService.get('YES');
        let no = this.translateService.get('NO');
        data.forEach(row => {
          if (row[key]) {
            row[key] = Util.parseBoolean(row[key]) ? yes : no;
          }
        });
      }
    });
  }

}
