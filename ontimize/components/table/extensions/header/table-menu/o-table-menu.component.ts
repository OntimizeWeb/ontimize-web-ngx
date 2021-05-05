import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import { MatDialog, MatMenu } from '@angular/material';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { InputConverter } from '../../../../../decorators';
import { DialogService, OPermissions, OTableMenuPermissions, OTranslateService, SnackBarService } from '../../../../../services';
import { PermissionsUtils } from '../../../../../util/permissions';
import { Codes, Util } from '../../../../../utils';
import { OColumn, OTableComponent } from '../../../o-table.component';
import { OTableCellRendererImageComponent } from '../../../table-components';
import {
  OTableApplyConfigurationDialogComponent,
  OTableExportConfiguration,
  OTableExportDialogComponent,
  OTableLoadFilterDialogComponent,
  OTableStoreConfigurationDialogComponent,
  OTableStoreFilterDialogComponent,
  OTableVisibleColumnsDialogComponent
} from '../../dialog/o-table-dialog-components';
import { OTableOptionComponent } from '../table-option/o-table-option.component';


export const DEFAULT_INPUTS_O_TABLE_MENU = [
  // select-all-checkbox [yes|no|true|false]: show selection check boxes. Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // export-button [no|yes]: show export button. Default: yes.
  'exportButton: export-button',

  // columns-visibility-button [no|yes]: show columns visibility button. Default: yes.
  'columnsVisibilityButton: columns-visibility-button',

  // show-configuration-option [yes|no|true|false]: show configuration option in header. Default: yes.
  'showConfigurationOption: show-configuration-option',

  // show-filter-option [yes|no|true|false]: show filter menu option in the header menu
  'showFilterOption: show-filter-option'
];

export const DEFAULT_OUTPUTS_O_TABLE_MENU = [];

@Component({
  moduleId: module.id,
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
export class OTableMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_TABLE_MENU = DEFAULT_INPUTS_O_TABLE_MENU;
  public static DEFAULT_OUTPUTS_O_TABLE_MENU = DEFAULT_OUTPUTS_O_TABLE_MENU;

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

  public onVisibleFilterOptionChange: EventEmitter<any> = new EventEmitter();
  /* End of inputs */

  protected dialogService: DialogService;
  protected translateService: OTranslateService;
  protected snackBarService: SnackBarService;
  @ViewChild('menu') matMenu: MatMenu;

  @ViewChild('selectAllCheckboxOption')
  selectAllCheckboxOption: OTableOptionComponent;
  @ViewChild('exportButtonOption')
  exportButtonOption: OTableOptionComponent;
  @ViewChild('columnsVisibilityButtonOption')
  columnsVisibilityButtonOption: OTableOptionComponent;
  @ViewChild('filterMenuButton', { read: ElementRef })
  filterMenuButton: ElementRef;
  @ViewChild('configurationMenuButton', { read: ElementRef })
  configurationMenuButton: ElementRef;

  @ViewChild('filterMenu')
  filterMenu: MatMenu;
  @ViewChild('configurationMenu')
  configurationMenu: MatMenu;
  @ViewChild('columnFilterOption')
  columnFilterOption: OTableOptionComponent;

  private showColumnsFilterOptionSubject = new BehaviorSubject<boolean>(false);
  public showColumnsFilterOption: Observable<boolean> = this.showColumnsFilterOptionSubject.asObservable();

  protected permissions: OTableMenuPermissions;
  protected mutationObservers: MutationObserver[] = [];

  private subscription: Subscription;

  constructor(
    protected injector: Injector,
    protected dialog: MatDialog,
    protected cd: ChangeDetectorRef,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
    this.snackBarService = this.injector.get(SnackBarService);
    const self = this;

    this.subscription = this.onVisibleFilterOptionChange.subscribe((x: boolean) => self.showColumnsFilterOptionSubject.next(x));
  }

  ngOnInit() {
    this.permissions = this.table.getMenuPermissions();
  }

  get isColumnFilterOptionActive() {
    return this.table && this.table.showFilterByColumnIcon;
  }

  ngAfterViewInit() {

    this.showColumnsFilterOptionSubject.next(this.table.oTableColumnsFilterComponent !== undefined);


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
    this.subscription.unsubscribe();
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
    return !(perm && perm.visible === false);
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

  onShowsSelects(event?: any) {
    const tableOptions = this.table.oTableOptions;
    tableOptions.selectColumn.visible = !tableOptions.selectColumn.visible;
    this.table.initializeCheckboxColumn();
  }

  onExportButtonClicked() {
    const tableOptions = this.table.oTableOptions;
    let exportCnfg: OTableExportConfiguration = new OTableExportConfiguration();

    // get column's attr whose renderer is OTableCellRendererImageComponent
    let colsNotIncluded: string[] = tableOptions.columns.filter(c => void 0 !== c.renderer && c.renderer instanceof OTableCellRendererImageComponent).map(c => c.attr);
    colsNotIncluded.push(OTableComponent.NAME_COLUMN_SELECT);
    colsNotIncluded.push(Codes.NAME_COLUMN_EXPANDABLE);

    // Table data/filters
    switch (this.table.exportMode) {
      case Codes.EXPORT_MODE_ALL:
        exportCnfg.filter = this.table.getComponentFilter();
        break;
      case Codes.EXPORT_MODE_LOCAL:
        exportCnfg.data = this.table.getAllRenderedValues();
        colsNotIncluded.forEach(attr => exportCnfg.data.forEach(row => delete row[attr]));
        break;
      default:
        exportCnfg.data = this.table.getRenderedValue();
        colsNotIncluded.forEach(attr => exportCnfg.data.forEach(row => delete row[attr]));
        break;
    }
    exportCnfg.mode = this.table.exportMode;
    exportCnfg.entity = this.table.entity;

    // Table columns
    exportCnfg.columns = tableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1);
    // Table column names
    let tableColumnNames = {};
    tableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1).forEach(c => {
      const oColumn = tableOptions.columns.find(oc => oc.attr === c);
      tableColumnNames[c] = this.translateService.get(oColumn.title ? oColumn.title : oColumn.attr);
    });
    exportCnfg.columnNames = tableColumnNames;
    // Table column sqlTypes
    exportCnfg.sqlTypes = this.table.getSqlTypes();
    // Table service, needed for configuring ontimize export service with table service configuration
    exportCnfg.service = this.table.service;
    exportCnfg.serviceType = this.table.exportServiceType;
    exportCnfg.visibleButtons = this.table.visibleExportDialogButtons;
    exportCnfg.options = this.table.exportOptsTemplate;

    this.dialog.open(OTableExportDialogComponent, {
      data: exportCnfg,
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
  }

  onChangeColumnsVisibilityClicked() {
    let dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
      data: {
        visibleColumns: Util.parseArray(this.table.visibleColumns, true),
        columnsData: this.table.oTableOptions.columns,
        rowHeight: this.table.rowHeight
      },
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.visibleColArray = dialogRef.componentInstance.getVisibleColumns();
        let columnsOrder = dialogRef.componentInstance.getColumnsOrder();
        this.table.oTableOptions.columns.sort((a: OColumn, b: OColumn) => columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr));
        this.table.cd.detectChanges();
        this.table.refreshColumnsWidth();
        this.table.onVisibleColumnsChange.emit(this.table.visibleColArray);
      }
    });
  }

  onFilterByColumnClicked() {
    if (this.table.showFilterByColumnIcon && this.table.dataSource.isColumnValueFilterActive()) {
      const self = this;
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DISCARD_FILTER_BY_COLUMN').then(res => {
        if (res) {
          self.table.clearColumnFilters();
        }
        self.table.showFilterByColumnIcon = !res;
      });
    } else {
      this.table.showFilterByColumnIcon = !this.table.showFilterByColumnIcon;
    }
  }

  public onStoreFilterClicked(): void {
    const dialogRef = this.dialog.open(OTableStoreFilterDialogComponent, {
      data: this.table.oTableStorage.getStoredFilters().map(filter => filter.name),
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.oTableStorage.storeFilter(dialogRef.componentInstance.getFilterAttributes());
      }
    });
  }

  public onLoadFilterClicked(): void {
    const dialogRef = this.dialog.open(OTableLoadFilterDialogComponent, {
      data: this.table.oTableStorage.getStoredFilters(),
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.componentInstance.onDelete.subscribe(filterName => this.table.oTableStorage.deleteStoredFilter(filterName));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedFilterName: string = dialogRef.componentInstance.getSelectedFilterName();
        if (selectedFilterName) {
          const storedFilter = this.table.oTableStorage.getStoredFilterConf(selectedFilterName);
          if (storedFilter) {
            this.table.setFiltersConfiguration(storedFilter);
            this.table.reloadPaginatedDataFromStart();
          }
        }
      }
    });
  }

  onClearFilterClicked(): void {
    this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_CLEAR_FILTER').then(result => {
      if (result) {
        this.table.clearFilters();
        this.table.reloadPaginatedDataFromStart();
      }
    });
  }

  public onStoreConfigurationClicked(): void {
    const dialogRef = this.dialog.open(OTableStoreConfigurationDialogComponent, {
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
    const self = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const configurationData = dialogRef.componentInstance.getConfigurationAttributes();
        const tableProperties = dialogRef.componentInstance.getSelectedTableProperties();
        self.table.oTableStorage.storeConfiguration(configurationData, tableProperties);
      }
    });
  }

  public onApplyConfigurationClicked(): void {
    const dialogRef = this.dialog.open(OTableApplyConfigurationDialogComponent, {
      data: this.table.oTableStorage.getStoredConfigurations(),
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });
    const self = this;
    dialogRef.componentInstance.onDelete.subscribe(configurationName => this.table.oTableStorage.deleteStoredConfiguration(configurationName));
    dialogRef.afterClosed().subscribe(result => {
      if (result && dialogRef.componentInstance.isDefaultConfigurationSelected()) {
        self.table.applyDefaultConfiguration();
      } else if (result) {
        const selectedConfigurationName: string = dialogRef.componentInstance.getSelectedConfigurationName();
        if (selectedConfigurationName) {
          self.table.applyConfiguration(selectedConfigurationName);
        }
      }
    });
  }

}
