import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IExportService } from '../../../../../interfaces/export-service.interface';
import { OntimizeExportServiceProvider } from '../../../../../services/factories';
import { OntimizeExportService } from '../../../../../services/ontimize/ontimize-export.service';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OTableExportData } from '../../../../../types/table/o-table-export-data.type';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableExportButtonService } from '../../export-button/o-table-export-button.service';
import { OTableExportConfiguration } from '../../header/table-menu/o-table-export-configuration.class';

@Component({
  selector: 'o-table-export-dialog',
  templateUrl: 'o-table-export-dialog.component.html',
  styleUrls: ['o-table-export-dialog.component.scss'],
  providers: [
    OntimizeExportServiceProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'o-table-export-dialog'
  },
  encapsulation: ViewEncapsulation.None
})
export class OTableExportDialogComponent implements OnInit, OnDestroy {

  protected snackBarService: SnackBarService;
  protected exportService: IExportService;
  protected translateService: OTranslateService;
  protected oTableExportButtonService: OTableExportButtonService;
  protected visibleButtons: string[];
  private subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<OTableExportDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) public config: OTableExportConfiguration
  ) {
    this.snackBarService = injector.get(SnackBarService);
    this.translateService = this.injector.get(OTranslateService);
    this.oTableExportButtonService = this.injector.get(OTableExportButtonService);

    if (config && Util.isDefined(config.visibleButtons)) {
      this.visibleButtons = Util.parseArray(config.visibleButtons.toLowerCase(), true);
    }
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
    let loadingService: any = OntimizeExportService;
    if (this.config.serviceType) {
      loadingService = this.config.serviceType;
    }
    this.exportService = this.injector.get(loadingService);
    const serviceCfg = this.exportService.getDefaultServiceConfiguration(this.config.service);
    this.exportService.configureService(serviceCfg, Codes.EXPORT_MODE_ALL === this.config.mode);
  }

  export(exportType: string, button?: any): void {

    if (button) {
      button.disabled = true;
    }

    const exportData: OTableExportData = {
      queryParam: {
        columns: this.config.columns,
        sqltypes: this.config.sqlTypes
      },
      service: 'CustomerService',
      dao: this.config.entity,
      advQuery: false,
      excelColumns: this.parseExcelColumns(this.config.columns),
      columnTitles: this.config.columnNames,
      styles: {},
      columnStyles: {},
      rowStyles: {},
      cellStyles: {}
    };

    this.dialogRef.close(true);
    this.exportService.exportData(exportData, exportType).subscribe(
      res => {
        this.snackBarService.open('MESSAGES.SUCCESS_EXPORT_TABLE_DATA', { icon: 'check_circle' });
      },
      err => {
        this.handleError(err);
      }
    );
  }

  parseExcelColumns(columns: any[]): { [key: string]: string } {
    let obj = {};
    columns.forEach((column: string) => {
      obj[column] = {};
    });
    return obj
  }

  isButtonVisible(btn: string): boolean {
    return !this.visibleButtons || (this.visibleButtons.indexOf(btn) !== -1);
  }

  protected handleError(err): void {
    if (err instanceof HttpErrorResponse) {
      this.snackBarService.open(err.message, { icon: 'error' });
    } else {
      this.snackBarService.open('MESSAGES.ERROR_EXPORT_TABLE_DATA', { icon: 'error' });
    }
  }
}
