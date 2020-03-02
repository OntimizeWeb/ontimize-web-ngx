import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatButton, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DialogService } from '../../../../../services/dialog.service';
import { OntimizeExportService } from '../../../../../services/ontimize-export.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Codes } from '../../../../../util/codes';
import { SQLTypes } from '../../../../../util/sqltypes';
import { Util } from '../../../../../util/util';
import { OTableExportButtonService } from '../../export-button/o-table-export-button.service';

export class OTableExportConfiguration {
  columns: Array<any>;
  columnNames: object;
  sqlTypes: object;
  service: string;
  data?: any[];
  filter?: object;
  mode: string;
  entity: string;
  options?: any;
}

@Component({
  selector: 'o-table-export-dialog',
  templateUrl: 'o-table-export-dialog.component.html',
  styleUrls: ['o-table-export-dialog.component.scss'],
  providers: [OntimizeExportService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'o-table-export-dialog'
  },
  encapsulation: ViewEncapsulation.None
})
export class OTableExportDialogComponent implements OnInit, OnDestroy {

  protected dialogService: DialogService;
  protected exportService: OntimizeExportService;
  protected translateService: OTranslateService;
  protected oTableExportButtonService: OTableExportButtonService;
  private subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<OTableExportDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) public config: OTableExportConfiguration
  ) {
    this.dialogService = injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
    this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initialize(): void {
    this.configureService();
    this.subscription.add(
      this.oTableExportButtonService.export$.pipe(filter(type => ['xlsx', 'html', 'pdf'].indexOf(type) === -1)).subscribe(e => this.export(e))
    );
  }

  configureService(): void {
    const loadingService: any = OntimizeExportService;
    // TODO: allow service type selection (extension)
    // if (this.serviceType) {
    //   loadingService = this.serviceType;
    // }
    try {
      this.exportService = this.injector.get(loadingService);
      const serviceCfg = this.exportService.getDefaultServiceConfiguration(this.config.service);
      this.exportService.configureService(serviceCfg, Codes.EXPORT_MODE_ALL === this.config.mode);
    } catch (e) {
      console.error(e);
    }
  }

  export(exportType: string, button?: any): void {
    if (button) {
      button.disabled = true;
    }
    const exportData = {
      data: this.config.data,
      columns: this.config.columns,
      columnNames: this.config.columnNames,
      sqlTypes: this.config.sqlTypes,
      filter: this.config.filter
    };
    const self = this;
    this.proccessExportData(exportData.data, exportData.sqlTypes);
    this.exportService.exportData(exportData, exportType, this.config.entity).subscribe((resp) => {
      if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
        self.exportService.downloadFile(resp.data[0][exportType + 'Id'], exportType).subscribe(
          () => self.dialogRef.close(true),
          downloadError => {
            console.error(downloadError);
            self.dialogService.alert('ERROR', downloadError.message).then(() => self.dialogRef.close(false));
          }
        );
      } else {
        self.dialogService.alert('ERROR', resp.message).then(() => self.dialogRef.close(false));
      }
    },
      (err) => self.handleError(err)
    );
  }

  proccessExportData(data: object[], sqlTypes: object): void {
    // Parse boolean
    Object.keys(sqlTypes).forEach(key => {
      if (SQLTypes.BOOLEAN === sqlTypes[key]) {
        const yes = this.translateService.get('YES');
        const no = this.translateService.get('NO');
        data.forEach(row => {
          if (row[key]) {
            row[key] = Util.parseBoolean(row[key]) ? yes : no;
          }
        });
      }
    });
  }

  protected handleError(err): void {
    console.error(err);
    const self = this;
    if (err instanceof HttpErrorResponse) {
      this.dialogService.alert('ERROR', err.message).then(() => self.dialogRef.close(false));
    } else {
      this.dialogService.alert('ERROR', 'MESSAGES.ERROR_EXPORT_TABLE_DATA').then(() => self.dialogRef.close(false));
    }
  }

}
