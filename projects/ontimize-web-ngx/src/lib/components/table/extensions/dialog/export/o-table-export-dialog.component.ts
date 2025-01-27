import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppConfig } from '../../../../../config/app-config';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IExportService } from '../../../../../interfaces/export-service.interface';
import { OntimizeExportServiceProvider } from '../../../../../services/factories';
import { OntimizeExportService } from '../../../../../services/ontimize/ontimize-export.service';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableExportButtonService } from '../../export-button/o-table-export-button.service';
import { OTableExportConfiguration } from '../../header/table-menu/o-table-export-configuration.class';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

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
  columns: string[];
  columnsData: string[];
  public orientations = [{ text: "EXPORT.DIALOG.VERTICAL", value: true }, { text: "EXPORT.DIALOG.HORIZONTAL", value: false }];
  public exportTypes = [{
    exportType: 'xlsx',
    svgIcon: 'ontimize:EXCEL',
    olabel: 'TABLE.BUTTONS.EXCEL',
    className: 'excel-button'
  }, {
    exportType: 'html',
    svgIcon: 'ontimize:HTML',
    olabel: 'TABLE.BUTTONS.HTML',
    className: 'html-button'
  }, {
    exportType: 'pdf',
    svgIcon: 'ontimize:PDF',
    olabel: 'TABLE.BUTTONS.PDF',
    className: 'pdf-button'
  }, {
    exportType: 'csv',
    svgIcon: 'ontimize:CSV',
    olabel: 'TABLE.BUTTONS.CSV',
    className: 'csv-button'
  }];
  vertical: boolean = true;
  selectedExportFormat: string;
  filename: string = '';
  isExpanded: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OTableExportDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) public config: OTableExportConfiguration
  ) {
    this.snackBarService = injector.get(SnackBarService);
    this.translateService = this.injector.get(OTranslateService);
    this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
    this.appConfig = this.injector.get(AppConfig);
    this.selectedExportFormat = this.getDefaultSelection();

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
    this.columnsData = this.config.columns;
    this.columns = [...this.columnsData];
    this.configureService();
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
  updateColumnsSort() {
    this.columns.sort((a: any, b: any) => {
      let indexA = this.columnsData.findIndex(x => x === a);
      let indexB = this.columnsData.findIndex(x => x === b);
      return indexA - indexB;
    });
  }
  dropColumns(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsData, event.previousIndex, event.currentIndex);
    this.updateColumnsSort();
  }
  columnsCompareFunction(co1: any, co2: any) {
    return co1.id === co2.id;
  }

  export(): void {
    this.dialogRef.close(true);
    this.exportService.exportData(this.selectedExportFormat, this.columns, !this.vertical, this.filename).subscribe({
      next: () => {
        this.snackBarService.open('MESSAGES.SUCCESS_EXPORT_TABLE_DATA', { icon: 'check_circle' });
      },
      error: (err: any) => {
        this.handleError(err);
      }
    }
    );
  }

  isButtonVisible(btn: string): boolean {

    const useExportConfiguration3X = this.appConfig.useExportConfiguration();
    let isVisible = true;
    if (this.visibleButtons) {
      isVisible = this.visibleButtons.indexOf(btn) !== -1;
    } else {
      if (useExportConfiguration3X) {
        isVisible = Codes.VISIBLE_EXPORT_BUTTONS3X.indexOf(btn) !== -1;
      } else {
        isVisible = Codes.VISIBLE_EXPORT_BUTTONS.indexOf(btn) !== -1
      }
    }

    return isVisible;
  }

  getDefaultSelection() {
    const useExportConfiguration3X = this.appConfig.useExportConfiguration();

    if (useExportConfiguration3X) {
      return Codes.VISIBLE_EXPORT_BUTTONS3X[0];
    } else {
      return Codes.VISIBLE_EXPORT_BUTTONS[0];
    }

  }

  protected handleError(err): void {
    if (err instanceof HttpErrorResponse) {
      this.snackBarService.open(err.message, { icon: 'error' });
    } else {
      this.snackBarService.open('MESSAGES.ERROR_EXPORT_TABLE_DATA', { icon: 'error' });
    }
  }

  onChangeMatButtonToggleGroup(event: MatButtonToggleChange) {
    event.source.buttonToggleGroup.value = event.value;
    this.selectedExportFormat = event.value;
  }
}
