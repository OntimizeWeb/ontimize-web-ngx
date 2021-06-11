import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, OnInit } from '@angular/core';

import { InputConverter } from '../../../../../decorators/input-converter';
import { OTablePaginator } from '../../../../../interfaces/o-table-paginator.interface';
import { OTableComponent } from '../../../o-table.component';
import { OBaseTablePaginator } from './o-base-table-paginator.class';

export const DEFAULT_PAGINATOR_TABLE = [
  // page-size [number]: Number of items to display on a page. By default set to 50.
  'pageSize: page-size',
  // pageSizeOptions [Array]: The set of provided page size options to display to the user.
  'pageSizeOptions: page-size-options',
  'showFirstLastButtons: show-first-last-buttons'
];

@Component({
  selector: 'o-table-paginator',
  template: ' ',
  inputs: DEFAULT_PAGINATOR_TABLE,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTablePaginatorComponent extends OBaseTablePaginator implements OTablePaginator, OnInit {

  @InputConverter()
  showFirstLastButtons: boolean = true;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    super();
  }

  ngOnInit() {
    this.pageSize = this.table.queryRows;
    this.pageIndex = this.table.currentPage;
    this.showFirstLastButtons = this.table.showPaginatorFirstLastButtons;

    this.table.registerPagination(this);
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageIndex(value: number) {
    this._pageIndex = value;
    if (this.table.matpaginator) {
      this.table.matpaginator.pageIndex = this._pageIndex;
    }
  }

  public isShowingAllRows(selectedLength: number): boolean {
    // return this._pageSizeOptions.indexOf(selectedLength) === (this._pageSizeOptions.length - 1);
    // temporal while not having an option for showing all records in paginated tables
    return false;
  }
}
