import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InputConverter } from '../../../decorators/input-converter';
import { DialogService } from '../../../services/dialog.service';
import { OLoadFilterDialogComponent } from '../../../shared/components/filter/load-filter/o-load-filter-dialog.component';
import { OStoreFilterDialogComponent } from '../../../shared/components/filter/store-filter/o-store-filter-dialog.component';
import { OFilterBuilderComponent } from '../o-filter-builder.component';

export const DEFAULT_INPUTS_O_FILTER_BUILDER_MENU = [
  '_filterBuilder: oFilterBuilder',
  // icon [string]: Name of google icon (see https://design.google.com/icons/)
  'icon',
  // Name of svg icon
  'svgIcon : svg-icon',
  // show-clear-filter-option [yes|no|true|false]: show clear filter option in the filter builder menu
  'showClearFilterOption: show-clear-filter-option',
  // show-filter-option [yes|no|true|false]: show filter option in the filter builder menu
  'showFilterOption: show-filter-option'
];

@Component({
  selector: 'o-filter-builder-menu',
  templateUrl: './filter-builder-menu.component.html',
  inputs: DEFAULT_INPUTS_O_FILTER_BUILDER_MENU,
  encapsulation: ViewEncapsulation.None
})
export class OFilterBuilderMenuComponent {
  protected dialog: MatDialog;
  protected dialogService: DialogService;
  protected _filterBuilder: OFilterBuilderComponent;
  @InputConverter()
  showFilterOption: boolean = true;
  @InputConverter()
  showClearFilterOption: boolean = true;
  public icon: string;
  public svgIcon: string;
  public defaultSvgIcon = 'ontimize:more_vert';

  constructor(
    protected injector: Injector,
  ) {
    this.dialog = this.injector.get(MatDialog);
    this.dialogService = this.injector.get(DialogService);
  }

  public onStoreFilterClicked(): void {
    const dialogRef = this.dialog.open(OStoreFilterDialogComponent, {
      data: this._filterBuilder.state.storedFilterBuilders.map(filter => filter.name),
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._filterBuilder.storeFilterInState(dialogRef.componentInstance.getFilterAttributes());
      }
    });
  }

  public onLoadFilterClicked(): void {
    const dialogRef = this.dialog.open(OLoadFilterDialogComponent, {
      data: this._filterBuilder.state.storedFilterBuilders,
      width: 'calc((75em - 100%) * 1000)',
      maxWidth: '65vw',
      minWidth: '30vw',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.componentInstance.onDelete.subscribe(filterName => this._filterBuilder.state.deleteStoredFilter(filterName));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedFilterName: string = dialogRef.componentInstance.getSelectedFilterName();
        if (selectedFilterName) {
          this._filterBuilder.state.applyFilter(selectedFilterName);
          this._filterBuilder.setFilterValues(this._filterBuilder.state.filterBuilderValues)
          this._filterBuilder.triggerReload();
        }
      }
    });
  }

  onClearFilterClicked(): void {
    this.dialogService.confirm('CONFIRM', 'FILTERBUILDERMENU.DIALOG.CONFIRM_CLEAR_FILTER').then(result => {
      if (result) {
        this._filterBuilder.clearFilter();
        this._filterBuilder.triggerReload();
      }
    });
  }

  onFilterClicked() {
    if (this._filterBuilder) {
      this._filterBuilder.triggerReload();
    }
  }
}
