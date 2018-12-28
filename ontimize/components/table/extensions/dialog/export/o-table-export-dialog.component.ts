import { Component, Inject, Injector, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatButton } from '@angular/material';

import { DialogService, OExportExtension, OntimizeExportService, OTranslateService } from '../../../../../services';
import { SQLTypes, Util, Codes } from '../../../../../utils';
import { HttpErrorResponse } from '@angular/common/http';

export class OTableExportConfiguration {
  data: any[];
  columns: Array<any>;
  columnNames: Object;
  sqlTypes: Object;
  service: string;
}

@Component({
  moduleId: module.id,
  selector: 'o-table-export-dialog',
  templateUrl: 'o-table-export-dialog.component.html',
  styleUrls: ['o-table-export-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'o-table-export-dialog'
  }
})
export class OTableExportDialogComponent implements OnInit {

  protected dialogService: DialogService;
  protected exportService: OntimizeExportService;
  protected translateService: OTranslateService;

  constructor(
    public dialogRef: MatDialogRef<OTableExportDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) protected config: OTableExportConfiguration
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

  exportExcel(excelButton: MatButton): void {
    excelButton.disabled = true;
    let exportData = {
      data: this.config.data,
      columns: this.config.columns,
      columnNames: this.config.columnNames,
      sqlTypes: this.config.sqlTypes
    };
    let self = this;
    this.proccessExportData(exportData.data, exportData.sqlTypes);
    this.exportService.exportData(exportData, OExportExtension.Excel).subscribe((resp) => {
      if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
        self.exportService.downloadFile(resp.data[0]['xslxId'], OExportExtension.Excel).subscribe(
          () => self.dialogRef.close(true),
          downloadError => {
            console.log(downloadError);
            self.dialogRef.close(false);
          }
        );
      } else {
        self.dialogService.alert('ERROR', resp.message).then(() => self.dialogRef.close(false));
      }
    },
      (err) => self.handleError(err)
    );
  }

  exportHTML(htmlButton: MatButton): void {
    htmlButton.disabled = true;
    let exportData = {
      data: this.config.data,
      columns: this.config.columns,
      columnNames: this.config.columnNames,
      sqlTypes: this.config.sqlTypes
    };
    let self = this;
    this.proccessExportData(exportData.data, exportData.sqlTypes);
    this.exportService.exportData(exportData, OExportExtension.HTML).subscribe(
      (resp) => {
        if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
          self.exportService.downloadFile(resp.data[0]['htmlId'], OExportExtension.HTML).subscribe(
            () => self.dialogRef.close(true),
            downloadError => {
              console.log(downloadError);
              self.dialogRef.close(false);
            }
          );
        } else {
          self.dialogService.alert('ERROR', resp.message).then(() => self.dialogRef.close(false));
        }
      },
      (err) => self.handleError(err)
    );
  }

  exportPDF(pdfButton: MatButton): void {
    pdfButton.disabled = true;
    let exportData = {
      data: this.config.data,
      columns: this.config.columns,
      columnNames: this.config.columnNames,
      sqlTypes: this.config.sqlTypes
    };
    let self = this;
    this.proccessExportData(exportData.data, exportData.sqlTypes);
    this.exportService.exportData(exportData, OExportExtension.PDF).subscribe(
      (resp) => {
        if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
          self.exportService.downloadFile(resp.data[0]['pdfId'], OExportExtension.PDF).subscribe(
            () => self.dialogRef.close(true),
            downloadError => {
              console.log(downloadError);
              self.dialogRef.close(false);
            }
          );
        } else {
          self.dialogService.alert('ERROR', resp.message).then(() => self.dialogRef.close(false));
        }
      },
      (err) => self.handleError(err)
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

  protected handleError(err): void {
    console.log(err);
    const self = this;
    if (err instanceof HttpErrorResponse) {
      this.dialogService.alert('ERROR', err.message).then(() => self.dialogRef.close(false));
    } else {
      this.dialogService.alert('ERROR', 'MESSAGES.ERROR_EXPORT_TABLE_DATA').then(() => self.dialogRef.close(false));
    }
  }

}
