import { Component, Inject, forwardRef, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatMenu } from '@angular/material';
import { Util } from '../../../../../utils';
import { InputConverter } from '../../../../../decorators';
import { SnackBarService, OTranslateService, DialogService } from '../../../../../services';
import { OTableComponent, OColumn } from '../../../o-table.component';
import { OTableExportConfiguration, OTableExportDialogComponent, OTableVisibleColumnsDialogComponent, OTableStoreFilterDialogComponent, OTableLoadFilterDialogComponent, OTableApplyConfigurationDialogComponent, OTableStoreConfigurationDialogComponent } from '../../dialog/o-table-dialog-components';
import { OTableCellRendererImageComponent } from '../../../table-components';

export const DEFAULT_INPUTS_O_TABLE_MENU = [
  // select-all-checkbox [yes|no|true|false]: show selection check boxes. Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // export-button [no|yes]: show export button. Default: yes.
  'exportButton: export-button',

  // columns-visibility-button [no|yes]: show columns visibility button. Default: yes.
  'columnsVisibilityButton: columns-visibility-button'
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
    '[class.o-table-menu]': 'true',
  }
})

export class OTableMenuComponent {

  public static DEFAULT_INPUTS_O_TABLE_MENU = DEFAULT_INPUTS_O_TABLE_MENU;
  public static DEFAULT_OUTPUTS_O_TABLE_MENU = DEFAULT_OUTPUTS_O_TABLE_MENU;

  /* Inputs */
  @InputConverter()
  selectAllCheckbox: boolean = false;
  @InputConverter()
  exportButton: boolean = true;
  @InputConverter()
  columnsVisibilityButton: boolean = true;
  /* End of inputs */

  protected dialogService: DialogService;
  protected translateService: OTranslateService;
  protected snackBarService: SnackBarService;
  @ViewChild('menu') matMenu: MatMenu;

  constructor(
    protected injector: Injector,
    protected dialog: MatDialog,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
    this.snackBarService = this.injector.get(SnackBarService);
  }

  get isSelectAllOptionActive(): boolean {
    return !!this.table.state['select-column-visible'];
  }

  get showColumnsFilterOption(): boolean {
    return this.table.oTableColumnsFilterComponent !== undefined;
  }

  onShowsSelects(event?: any) {
    const tableOptions = this.table.oTableOptions;
    tableOptions.selectColumn.visible = !tableOptions.selectColumn.visible;
    this.table.updateSelectionColumnState();
  }

  onExportButtonClicked() {
    const tableOptions = this.table.oTableOptions;
    let exportCnfg: OTableExportConfiguration = new OTableExportConfiguration();
    // Table data
    exportCnfg.data = this.table.getRenderedValue();
    // get column's attr whose renderer is OTableCellRendererImageComponent
    let colsNotIncluded: string[] = tableOptions.columns.filter(c => void 0 !== c.renderer && c.renderer instanceof OTableCellRendererImageComponent).map(c => c.attr);
    colsNotIncluded.forEach(attr => exportCnfg.data.forEach(row => delete row[attr]));
    // Table columns
    exportCnfg.columns = tableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1);
    // Table column names
    let tableColumnNames = {};
    tableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1).map(c => tableColumnNames[c] = this.translateService.get(c));
    exportCnfg.columnNames = tableColumnNames;
    // Table column sqlTypes
    exportCnfg.sqlTypes = this.table.getSqlTypes();
    // Table service, needed for configuring ontimize export service with table service configuration
    exportCnfg.service = this.table.service;

    let dialogRef = this.dialog.open(OTableExportDialogComponent, {
      data: exportCnfg,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => result ? this.snackBarService.open('MESSAGES.SUCCESS_EXPORT_TABLE_DATA', { icon: 'check_circle' }) : null);
  }

  onChangeColumnsVisibilityClicked() {
    let dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
      data: {
        originalVisibleColumns: Util.parseArray(this.table.originalVisibleColumns, true),
        columnsData: this.table.oTableOptions.columns
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.visibleColArray = dialogRef.componentInstance.getVisibleColumns();
        let columnsOrder = dialogRef.componentInstance.getColumnsOrder();
        this.table.oTableOptions.columns.sort((a: OColumn, b: OColumn) => columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr));
      }
    });
  }

  onFilterByColumnClicked() {
    if (this.table.showFilterByColumnIcon && this.table.dataSource.isColumnValueFilterActive()) {
      const self = this;
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DISCARD_FILTER_BY_COLUMN').then(res => {
        if (res) {
          self.table.dataSource.clearColumnFilters();
        }
        self.table.showFilterByColumnIcon = !res;
      });
    } else {
      this.table.showFilterByColumnIcon = !this.table.showFilterByColumnIcon;
    }
  }

  onStoreFilterClicked(): void {
    let dialogRef = this.dialog.open(OTableStoreFilterDialogComponent, {
      data: this.table.oTableStorage.getStoredFilters().map(filter => filter.name),
      width: '30vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.oTableStorage.storeFilter(dialogRef.componentInstance.getFilterAttributes());
      }
    });
  }

  onLoadFilterClicked(): void {
    let dialogRef = this.dialog.open(OTableLoadFilterDialogComponent, {
      data: this.table.oTableStorage.getStoredFilters(),
      width: '30vw',
      disableClose: true
    });

    dialogRef.componentInstance.onDelete.subscribe(filterName => this.table.oTableStorage.deleteStoredFilter(filterName));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let selectedFilterName: string = dialogRef.componentInstance.getSelectedFilterName();
        if (selectedFilterName) {
          let storedFilter = this.table.oTableStorage.getStoredFilterConf(selectedFilterName);
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


  onStoreConfigurationClicked(): void {
    let dialogRef = this.dialog.open(OTableStoreConfigurationDialogComponent, {
      width: '30vw',
      disableClose: true
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

  onApplyConfigurationClicked(): void {
    let dialogRef = this.dialog.open(OTableApplyConfigurationDialogComponent, {
      data: this.table.oTableStorage.getStoredConfigurations(),
      width: '30vw',
      disableClose: true
    });
    const self = this;
    dialogRef.componentInstance.onDelete.subscribe(configurationName => this.table.oTableStorage.deleteStoredConfiguration(configurationName));
    dialogRef.afterClosed().subscribe(result => {
      if (result && dialogRef.componentInstance.isDefaultConfigurationSelected()) {
        self.table.applyDefaultConfiguration();
      } else if (result) {
        let selectedConfigurationName: string = dialogRef.componentInstance.getSelectedConfigurationName();
        if (selectedConfigurationName) {
          self.table.applyConfiguration(selectedConfigurationName);
        }
      }
    });
  }
}
