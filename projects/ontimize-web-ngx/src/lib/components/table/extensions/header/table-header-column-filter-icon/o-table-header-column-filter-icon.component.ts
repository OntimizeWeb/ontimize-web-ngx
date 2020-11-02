import { ChangeDetectionStrategy, Component, forwardRef, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OColumnValueFilter } from '../../../../../types/o-column-value-filter.type';
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
  public columnValueFilters: Array<OColumnValueFilter> = [];

  public isColumnFilterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public indicatorNumber: BehaviorSubject<string> = new BehaviorSubject('');
  private subscription = new Subscription();

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent
  ) {
    const self = this;
    const sFilterByColumnChange = this.table.onFilterByColumnChange.subscribe(x => {
      self.updateStateColumnFilter(x);
    });
    this.subscription.add(sFilterByColumnChange);
  }

  ngOnInit(): void {
    this.updateStateColumnFilter(this.table.dataSource.getColumnValueFilters());
  }

  public updateStateColumnFilter(columnValueFilters: Array<OColumnValueFilter>) {
    this.columnValueFilters = columnValueFilters;
    this.indicatorNumber.next(this.getFilterIndicatorNumbered());
    this.isColumnFilterActive.next(this.getColumnValueFilterByAttr() !== undefined);
  }

  public getColumnValueFilterByAttr(): OColumnValueFilter {
    return this.columnValueFilters.filter(item => item.attr === this.column.attr)[0];
  }

  public openColumnFilterDialog(event) {
    this.table.openColumnFilterDialog(this.column, event);
  }

  public getFilterIndicatorNumbered(): string {
    let result = '';

    const columnsValueFilters = this.columnValueFilters;
    if (columnsValueFilters.length < 2) { return result; }

    const index = columnsValueFilters.findIndex(x => x.attr === this.column.attr);
    if (index > -1) {
      result += index + 1;
    }

    return result;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
