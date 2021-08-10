import { ChangeDetectionStrategy, Component, forwardRef, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { OColumnValueFilter } from '../../../../../types/table/o-column-value-filter.type';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../column';
import { OTableComponent } from '../../../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON = [
  'column'
]

@Component({
  selector: 'o-table-header-column-filter-icon',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON,
  templateUrl: './o-table-header-column-filter-icon.component.html',
  styleUrls: ['./o-table-header-column-filter-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-column-filter-icon]': 'true'
  }
})
export class OTableHeaderColumnFilterIconComponent implements OnInit, OnDestroy {

  public column: OColumn;

  public isColumnFilterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public indicatorNumber: BehaviorSubject<string> = new BehaviorSubject('');
  private subscription = new Subscription();

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    this.subscription.add(this.table.onFilterByColumnChange.subscribe(() => {
      this.updateStateColumnFilter();
    }));
  }

  ngOnInit(): void {
    this.updateStateColumnFilter();
  }

  public updateStateColumnFilter() {
    this.indicatorNumber.next(this.getFilterIndicatorNumbered());
    this.isColumnFilterActive.next(Util.isDefined(this.table.dataSource.getColumnValueFilterByAttr(this.column.attr)));
  }

  public openColumnFilterDialog(event) {
    this.table.openColumnFilterDialog(this.column, event);
  }

  public getFilterIndicatorNumbered(): string {
    let result = '';

    const columnValueFilters = this.table.dataSource.getColumnValueFilters();
    if (columnValueFilters.length < 2) {
      return result;
    }

    const index = columnValueFilters.findIndex(x => x.attr === this.column.attr);
    if (index > -1) {
      result += index + 1;
    }

    return result;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
