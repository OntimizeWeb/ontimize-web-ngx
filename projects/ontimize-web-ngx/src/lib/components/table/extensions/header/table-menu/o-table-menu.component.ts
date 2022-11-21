import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatDialog, MatMenu } from '@angular/material';
import { Observable } from 'rxjs';
import { InputConverter } from '../../../../../decorators/input-converter';
import { IChartOnDemandService } from '../../../../../interfaces/chart-on-demand.interface';
import { OTableMenu } from '../../../../../interfaces/o-table-menu.interface';
import { IReportService } from '../../../../../interfaces/report-on-demand-service.interface';
import { DialogService } from '../../../../../services/dialog.service';

import { O_CHART_ON_DEMAND_SERVICE, O_REPORT_SERVICE } from '../../../../../services/factories';
import { OntimizeExportDataProviderService } from '../../../../../services/ontimize-export-data-provider.service';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OPermissions } from '../../../../../types/o-permissions.type';
import { OTableMenuPermissions } from '../../../../../types/table/o-table-menu-permissions.type';
import { PermissionsUtils } from '../../../../../util/permissions';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../column/o-column.class';
import { OTableComponent } from '../../../o-table.component';
import { OTableGroupByColumnsDialogComponent } from '../../dialog';
import {
  OTableApplyConfigurationDialogComponent
} from '../../dialog/apply-configuration/o-table-apply-configuration-dialog.component';
import { OTableExportDialogComponent } from '../../dialog/export/o-table-export-dialog.component';
import { OTableLoadFilterDialogComponent } from '../../dialog/load-filter/o-table-load-filter-dialog.component';
import {
  OTableStoreConfigurationDialogComponent
} from '../../dialog/store-configuration/o-table-store-configuration-dialog.component';
import { OTableStoreFilterDialogComponent } from '../../dialog/store-filter/o-table-store-filter-dialog.component';
import { OTableVisibleColumnsDialogComponent } from '../../dialog/visible-columns/o-table-visible-columns-dialog.component';
import { OTableOptionComponent } from '../table-option/o-table-option.component';




export const DEFAULT_INPUTS_O_TABLE_MENU = [
  // select-all-checkbox [yes|no|true|false]: show selection check boxes. Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // export-button [no|yes]: show export button. Default: yes.
  'exportButton: export-button',

  // columns-visibility-button [no|yes]: show columns visibility button. Default: yes.
  'columnsVisibilityButton: columns-visibility-button',

  // show-configuration-option [yes|no|true|false]: show configuration button in header. Default: yes.
  'showConfigurationOption: show-configuration-option',

  // show-filter-option [yes|no|true|false]: show filter menu option in the header menu
  'showFilterOption: show-filter-option',

  // show-group-by-option [yes|no|true|false]: show group by menu option in the header menu
  'showGroupByOption: show-group-by-option',

  // show-reset-width-option [yes|no|true|false]: show reset width menu option in the header menu
  'showResetWidthOption: show-reset-width-option',

  // show-report-on-demand-option [yes|no|true|false]: show report on demand option in the header menu
  'showReportOnDemandOption: show-report-on-demand-option',

  // show-charts-on-demand-option [yes|no|true|false]: show charts on demand option in the header menu
  'showChartsOnDemandOption: show-charts-on-demand-option'
];

export const DEFAULT_OUTPUTS_O_TABLE_MENU = [];

@Component({
  selector: 'o-table-menu',
  templateUrl: './o-table-menu.component.html',
  styleUrls: ['./o-table-menu.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_MENU,
  outputs: DEFAULT_OUTPUTS_O_TABLE_MENU,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-menu]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableMenuComponent implements OTableMenu, OnInit, AfterViewInit, OnDestroy {

  /* Inputs */
  @InputConverter()
  selectAllCheckbox: boolean = false;
  @InputConverter()
  exportButton: boolean = true;
  @InputConverter()
  showConfigurationOption: boolean = true;
  @InputConverter()
  showFilterOption: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  @InputConverter()
  showGroupByOption: boolean = true;
  @InputConverter()
  showResetWidthOption: boolean = true;
  @InputConverter()
  showReportOnDemandOption: boolean = true;
  @InputConverter()
  showChartsOnDemandOption: boolean = true;


  public onVisibleFilterOptionChange: EventEmitter<any> = new EventEmitter();
  /* End of inputs */

  protected dialogService: DialogService;
  protected translateService: OTranslateService;
  protected snackBarService: SnackBarService;

  @ViewChild('menu', { static: true })
  matMenu: MatMenu;
  @ViewChild('selectAllCheckboxOption', { static: false })
  selectAllCheckboxOption: OTableOptionComponent;
  @ViewChild('exportButtonOption', { static: false })
  exportButtonOption: OTableOptionComponent;
  @ViewChild('columnsVisibilityButtonOption', { static: false })
  columnsVisibilityButtonOption: OTableOptionComponent;
  @ViewChild('filterMenuButton', { read: ElementRef, static: false })
  filterMenuButton: ElementRef;
  @ViewChild('configurationMenuButton', { read: ElementRef, static: false })
  configurationMenuButton: ElementRef;

  @ViewChild('filterMenu', { static: false })
  filterMenu: MatMenu;
  @ViewChild('configurationMenu', { static: false })
  configurationMenu: MatMenu;
  @ViewChild('columnFilterOption', { static: false })
  columnFilterOption: OTableOptionComponent;
  @ViewChild('chartMenu', { static: true })
  chartMenu: MatMenu;

  protected permissions: OTableMenuPermissions;
  protected mutationObservers: MutationObserver[] = [];
  protected exportDataProvider: OntimizeExportDataProviderService;


  constructor(
    protected injector: Injector,
    protected dialog: MatDialog,
    protected cd: ChangeDetectorRef,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent,

    @Optional() @Inject(O_CHART_ON_DEMAND_SERVICE) public chartOnDemandService: IChartOnDemandService,

    @Optional() @Inject(O_REPORT_SERVICE) public reportService: IReportService

  ) {
    this.dialogService = this.injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
    this.snackBarService = this.injector.get(SnackBarService);
    this.exportDataProvider = this.injector.get(OntimizeExportDataProviderService)
  }

  ngOnInit() {
    this.permissions = this.table.getMenuPermissions();
  }

  get isColumnFilterOptionActive() {
    return this.table && this.table.isColumnFiltersActive;
  }

  ngAfterViewInit() {

    if (!this.permissions.items || this.permissions.items.length === 0) {
      return;
    }
    if (this.selectAllCheckboxOption && !this.enabledSelectAllCheckbox) {
      this.disableOTableOptionComponent(this.selectAllCheckboxOption);
    }
    if (this.exportButtonOption && !this.enabledExportButton) {
      this.disableOTableOptionComponent(this.exportButtonOption);
    }
    if (this.columnsVisibilityButtonOption && !this.enabledColumnsVisibilityButton) {
      this.disableOTableOptionComponent(this.columnsVisibilityButtonOption);
    }
    if (this.filterMenuButton && !this.enabledFilterMenu) {
      this.disableButton(this.filterMenuButton);
    }
    if (this.configurationMenuButton && !this.enabledConfigurationMenu) {
      this.disableButton(this.configurationMenuButton);
    }

    this.cd.detectChanges();
  }

  protected disableOTableOptionComponent(comp: OTableOptionComponent) {
    comp.enabled = false;
    const buttonEL = comp.elRef.nativeElement.querySelector('button');
    const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
    this.mutationObservers.push(obs);
  }

  protected disableButton(buttonEL: ElementRef) {
    buttonEL.nativeElement.disabled = true;
    const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL.nativeElement);
    this.mutationObservers.push(obs);
  }

  ngOnDestroy() {
    if (this.mutationObservers) {
      this.mutationObservers.forEach((m: MutationObserver) => {
        m.disconnect();
      });
    }
  }

  registerOptions(oTableOptions: OTableOptionComponent[]) {
    const items: OPermissions[] = this.permissions.items || [];
    const fixedOptions = ['select-all-checkbox', 'export', 'show-hide-columns', 'filter', 'configuration'];
    const userItems: OPermissions[] = items.filter((perm: OPermissions) => fixedOptions.indexOf(perm.attr) === -1);
    const self = this;
    userItems.forEach((perm: OPermissions) => {
      const option = oTableOptions.find((oTableOption: OTableOptionComponent) => oTableOption.oattr === perm.attr);
      self.setPermissionsToOTableOption(perm, option);
    });
  }

  protected setPermissionsToOTableOption(perm: OPermissions, option: OTableOptionComponent) {
    if (perm.visible === false && option) {
      option.elRef.nativeElement.remove();
    } else if (perm.enabled === false && option) {
      option.enabled = false;
      const buttonEL = option.elRef.nativeElement.querySelector('button');
      const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
      this.mutationObservers.push(obs);
    }
  }

  getPermissionByAttr(attr: string) {
    const items: OPermissions[] = this.permissions.items || [];
    return items.find((perm: OPermissions) => perm.attr === attr);
  }

  get isSelectAllOptionActive(): boolean {
    return this.table.oTableOptions.selectColumn.visible;
  }

  get showSelectAllCheckbox(): boolean {
    if (!this.selectAllCheckbox) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('select-all-checkbox');
    return this.showFilterOption && !(perm && perm.visible === false);
  }

  get rowHeightObservable(): Observable<string> {
    return this.table.rowHeightObservable;
  }
  get enabledSelectAllCheckbox(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('select-all-checkbox');
    return !(perm && perm.enabled === false);
  }

  get showExportButton(): boolean {
    if (!this.exportButton) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('export');
    return !(perm && perm.visible === false);
  }

  get enabledExportButton(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('export');
    return !(perm && perm.enabled === false);
  }

  get showColumnsVisibilityButton(): boolean {
    if (!this.columnsVisibilityButton) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('show-hide-columns');
    return !(perm && perm.visible === false);
  }

  get showReportOnDemandButton(): boolean {
    if (!this.showReportOnDemandOption) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('show-report-on-demand');
    return !(perm && perm.visible === false);
  }

  get enabledColumnsVisibilityButton(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('show-hide-columns');
    return !(perm && perm.enabled === false);
  }

  get showFilterMenu(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('filter');
    return this.showFilterOption && !(perm && perm.visible === false);
  }

  get enabledFilterMenu(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('filter');
    return !(perm && perm.enabled === false);
  }

  get showConfigurationMenu(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('configuration');
    return this.showConfigurationOption && !(perm && perm.visible === false);
  }

  get enabledConfigurationMenu(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('configuration');
    return !(perm && perm.enabled === false);
  }

  get showGroupByButton(): boolean {
    return this.showGroupByOption;
  }

  get showChartsOnDemandButton(): boolean {
    if (!this.showChartsOnDemandOption) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('show-chart-on-demand');
    return !(perm && perm.visible === false);

  }

  onShowsSelects() {
    const tableOptions = this.table.oTableOptions;
    tableOptions.selectColumn.visible = !tableOptions.selectColumn.visible;
    this.table.initializeCheckboxColumn();
  }

  onExportButtonClicked() {
    this.exportDataProvider.initializeProvider(this.table);

    this.dialog.open(OTableExportDialogComponent, {
      data: {
        visibleButtons: this.table.visibleExportDialogButtons,
        service: this.table.service,
        serviceType: this.table.exportServiceType,
        options: this.table.exportOptsTemplate
      },
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
  }

  onChangeColumnsVisibilityClicked() {
    const dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
      data: {
        table: this.table
      },
      maxWidth: '35vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (Util.isDefined(result)) {
        this.table.visibleColArray = result.visibleColArray;
        const columnsOrder = result.columnsOrder;
        this.table.oTableOptions.columns.sort((a: OColumn, b: OColumn) => columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr));

        if (Util.isDefined(result.sortColumns)) {
          this.table.reinitializeSortColumns(result.sortColumns);
        }

        if (Util.isDefined(result.groupColumns)) {
          this.table.setGroupColumns(result.groupColumns);
        }

        if (result.columnValueFiltersToRemove.length > 0) {
          this.table.clearColumnFilters(false, result.columnValueFiltersToRemove);
        }

        this.table.cd.detectChanges();
        this.table.refreshColumnsWidth();
      }
    });
  }

  onGroupByClicked() {
    const dialogRef = this.dialog.open(OTableGroupByColumnsDialogComponent, {
      data: {
        groupedColumns: this.table.groupedColumnsArray,
        columnsData: this.table.oTableOptions.columns,
        rowHeight: this.table.rowHeight,
        groupedColumnTypes: this.table.groupedColumnTypes
      },
      height: '75vh',
      width: '50vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog', 'o-table-group-by-column-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.setGroupedColumnTypes(dialogRef.componentInstance.getGroupedColumnTypes());
        this.table.setGroupColumns(dialogRef.componentInstance.getGroupedColumns());
      }
    });
  }

  onFilterByColumnClicked() {
    if (this.table.isColumnFiltersActive && this.table.dataSource.isColumnValueFilterActive()) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DISCARD_FILTER_BY_COLUMN').then(res => {
        if (res) {
          this.table.clearColumnFilters();
        }
        this.table.isColumnFiltersActive = !res;
      });
    } else {
      this.table.isColumnFiltersActive = !this.table.isColumnFiltersActive;
    }
  }

  public onStoreFilterClicked(): void {
    const dialogRef = this.dialog.open(OTableStoreFilterDialogComponent, {
      data: this.table.state.storedFilters.map(filter => filter.name),
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.storeFilterInState(dialogRef.componentInstance.getFilterAttributes());
      }
    });
  }

  public onLoadFilterClicked(): void {
    const dialogRef = this.dialog.open(OTableLoadFilterDialogComponent, {
      data: this.table.state.storedFilters,
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.componentInstance.onDelete.subscribe(filterName => this.table.state.deleteStoredFilter(filterName));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedFilterName: string = dialogRef.componentInstance.getSelectedFilterName();
        if (selectedFilterName) {
          this.table.state.applyFilter(selectedFilterName);
          this.table.setFiltersConfiguration();
          this.table.reloadPaginatedDataFromStart(false);
        }
      }
    });
  }

  onClearFilterClicked(): void {
    this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_CLEAR_FILTER').then(result => {
      if (result) {
        this.table.clearFilters();
        this.table.reloadPaginatedDataFromStart(false);
      }
    });
  }


  onChartsOnDemandClicked(): void {
    if (this.chartOnDemandService) {
      this.chartOnDemandService.openChartOnDemand(this.table);
    } else {
      console.warn("You must have ontimize-web-ngx-charts installed in your app to use charts on demand.")
    }
  }
  onResetWidthClicked() {
    this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_RESET_WIDTH').then(result => {
      if (result) {
        this.table.resetColumnsWidth();
      }
    });
  }

  onReportOnDemandClicked(): void {
    if (this.reportService) {
      this.reportService.openReportOnDemand(this.table);
    } else {
      console.warn("You must have ontimize-web-ngx-report-on-demand installed in your app to use report on demand.")
    }
  }

  public onStoreConfigurationClicked(): void {
    const dialogRef = this.dialog.open(OTableStoreConfigurationDialogComponent, {
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const configurationData = dialogRef.componentInstance.getConfigurationAttributes();
        const tableProperties = dialogRef.componentInstance.getSelectedTableProperties();
        this.table.componentStateService.storeConfiguration(configurationData, tableProperties);
      }
    });
  }

  public onApplyConfigurationClicked(): void {
    const dialogRef = this.dialog.open(OTableApplyConfigurationDialogComponent, {
      data: this.table.state.storedConfigurations,
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
    dialogRef.componentInstance.onDelete.subscribe(configurationName => this.table.state.deleteStoredConfiguration(configurationName));
    dialogRef.afterClosed().subscribe(result => {
      if (result && dialogRef.componentInstance.isDefaultConfigurationSelected()) {
        this.table.state.reset(this.table.pageable);
        this.table.applyDefaultConfiguration();
      } else if (result) {
        const selectedConfigurationName: string = dialogRef.componentInstance.getSelectedConfigurationName();
        if (selectedConfigurationName) {
          this.table.state.applyConfiguration(selectedConfigurationName);
          this.table.applyConfiguration(selectedConfigurationName);
        }
      }
    });
  }

}
