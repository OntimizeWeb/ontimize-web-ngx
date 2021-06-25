import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, forwardRef, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AnimationDurations } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';

import { OColumnValueFilter } from '../../../../../types/o-column-value-filter.type';
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
    '[class.o-table-column-filter-icon]': 'true',
    '(mouseenter)': 'setFilterIconHintVisible(true)',
    '(mouseleave)': 'setFilterIconHintVisible(false)'
  },
  animations: [
    trigger('iconState', [
      state('ACTIVE, HINT', style({ opacity: 1 })),
      state('INACTIVE', style({ opacity: 0 })),
      transition('* <=> HINT', animate(AnimationDurations.ENTERING))
    ]),

  ]
})
export class OTableHeaderColumnFilterIconComponent implements OnInit, OnDestroy {

  public column: OColumn;

  public isColumnFilterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public indicatorNumber: BehaviorSubject<string> = new BehaviorSubject('');
  private subscription = new Subscription();
  public filterIconStateView: 'HINT' | 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

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

    this.isColumnFilterActive.next(Util.isDefined(this.getColumnValueFilterByAttr()));
    this.filterIconStateView = this.isColumnFilterActive.getValue() ? 'ACTIVE' : 'INACTIVE';
  }

  protected getColumnValueFilterByAttr(): OColumnValueFilter {
    const columnValueFilters = this.table.dataSource.getColumnValueFilters();
    return columnValueFilters.find(item => item.attr === this.column.attr);
  }

  public openColumnFilterDialog(event) {
    this.table.openColumnFilterDialog(this.column, event);
  }

  public getFilterIndicatorNumbered(): string {
    let result = '';

    const columnValueFilters = this.table.dataSource.getColumnValueFilters();
    const columnsValueFilters = columnValueFilters;
    if (columnsValueFilters.length < 2) {
      return result;
    }

    const index = columnsValueFilters.findIndex(x => x.attr === this.column.attr);
    if (index > -1) {
      result += index + 1;
    }

    return result;
  }

  /**
   * Sets the "hint" state such that the icon will be semi-transparently displayed as a hint to the
   * user showing what the active filter by column will become. If set to false, the icon will fade away.
   */
  setFilterIconHintVisible(visible: boolean) {
    // No-op if the sort header is disabled - should not make the hint visible.
    if (this.filterIconStateView === 'ACTIVE') { return; }
    this.filterIconStateView = visible ? 'HINT' : 'INACTIVE';


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
