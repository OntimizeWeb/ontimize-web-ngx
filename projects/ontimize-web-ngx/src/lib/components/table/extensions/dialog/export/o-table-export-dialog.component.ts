import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppConfig } from '../../../../../config/app-config';

import { IExportService } from '../../../../../interfaces/export-service.interface';
import { OntimizeExportServiceProvider } from '../../../../../services/factories';
import { OntimizeExportService } from '../../../../../services/ontimize/ontimize-export.service';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
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
  private appConfig: AppConfig;

  constructor(
    public dialogRef: MatDialogRef<OTableExportDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) public config: OTableExportConfiguration
  ) {
    this.snackBarService = injector.get(SnackBarService);
    this.translateService = this.injector.get(OTranslateService);
    this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
    this.appConfig = this.injector.get(AppConfig)

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
    this.exportService.configureService(serviceCfg);
  }

  export(exportType: string, button?: any): void {

    if (button) {
      button.disabled = true;
    }

    this.dialogRef.close(true);
    this.exportService.exportData(exportType).subscribe(
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

    const useExportConfiguration3X = this.appConfig.useExportConfiguration();
    let isVisible = true;
    if (this.visibleButtons) {
      isVisible = (this.visibleButtons.indexOf(btn) !== -1)
    } else {
      if (useExportConfiguration3X) {
        isVisible = Codes.VISIBLE_EXPORT_BUTTONS3X.indexOf(btn) !== -1;
      } else {
        isVisible = Codes.VISIBLE_EXPORT_BUTTONS.indexOf(btn) !== -1
      }
    }

    return isVisible;
  }

  protected handleError(err): void {
    if (err instanceof HttpErrorResponse) {
      this.snackBarService.open(err.message, { icon: 'error' });
    } else {
      this.snackBarService.open('MESSAGES.ERROR_EXPORT_TABLE_DATA', { icon: 'error' });
    }
  }
}
