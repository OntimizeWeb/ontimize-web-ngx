import { animate, state, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AnimationDurations } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Subscription } from 'rxjs';

import { OColumnValueFilter } from '../../../../../types/table/o-column-value-filter.type';
import { Util } from '../../../../../util/util';
import type { OColumn } from '../../../column/o-column.class';
import { OTableBase } from '../../../o-table-base.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../../../../services/dialog.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON = [
  'column',
  // columnFilters: Active filters applied to table columns
  'columnFilters: column-filters'
];

export declare type STATEVIEW = 'HINT' | 'ACTIVE' | 'INACTIVE';

@Component({
  standalone: true,
  imports: [AsyncPipe, MatIconModule],
  selector: 'o-table-header-column-filter-icon',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON,
  templateUrl: './o-table-header-column-filter-icon.component.html',
  styleUrls: ['./o-table-header-column-filter-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-column-filter-icon]': 'true'
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

  /**
   * Array of active column filters from the table
   * Updated by parent component when filters change
   */
  set columnFilters(filters: OColumnValueFilter[]) {
    this._columnFilters = filters?.filter(value=>value.values) || [];
    this.updateStateColumnFilter();
  }
  get columnFilters(): OColumnValueFilter[] {
    return this._columnFilters;
  }

  private _columnFilters: OColumnValueFilter[] = [];

  public isColumnFilterActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public filterIconHintVisible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public indicatorNumber: BehaviorSubject<string> = new BehaviorSubject('');
  private subscription = new Subscription();
  public filterIconStateView: BehaviorSubject<STATEVIEW> = new BehaviorSubject<STATEVIEW>('INACTIVE');

  constructor(
    @Inject(forwardRef(() => OTableBase)) public table: OTableBase,
    protected dialog: MatDialog,
    protected dialogService: DialogService,
    protected translateService: OTranslateService,
    protected cd: ChangeDetectorRef
  ) {
    this.subscription.add(
      this.filterIconHintVisible.subscribe((value) => {
        this.setFilterIconHintVisible(value);
      })
    );
  }

  ngOnInit(): void {
    this.updateStateColumnFilter();
  }

  /**
   * Update state colum filter
   */
  public updateStateColumnFilter(): void {
    this.updateFilterIndicatorNumber();

    const isActive = Util.isDefined(this.getColumnValueFilterByAttr()?.values);
    this.isColumnFilterActive.next(isActive);
    this.filterIconStateView.next(isActive ? 'ACTIVE' : 'INACTIVE');
    this.cd.markForCheck();
  }

  /**
   * Update only indicator number about filter icon
   */
  private updateFilterIndicatorNumber(): void {
    this.indicatorNumber.next(this.getFilterIndicatorNumbered());
  }

  /**
   * Get the filter for this column from the array of filters
   */
  protected getColumnValueFilterByAttr(): OColumnValueFilter {
    return this._columnFilters?.find(item => item.attr === this.column.attr);
  }


  public openColumnFilterDialog(event: Event): void {
    const filterByColumnComponent = this.table.oTableColumnsFilterComponent?.getFilterColumnByAttr(this.column.attr);

    if (filterByColumnComponent?.filterLocked) {
      this.dialogService.alert(
        this.translateService.get('TABLE.FILTER_LOCKED'),
        this.translateService.get(filterByColumnComponent.filterLockedMessage)
      );
    } else {
      this.table.openColumnFilterDialog(this.column, event);
    }
  }

  /**
   * Gets the filter indicator number (position in the active filters list)
   */
  public getFilterIndicatorNumbered(): string {
    const filters = this._columnFilters ?? [];
    const index = filters.length > 1
      ? filters.findIndex(f => f.attr === this.column.attr)
      : -1;

    return index >= 0 ? `${index + 1}` : '';
  }

  /**
   * Sets the "hint" state such that the icon will be semi-transparently displayed as a hint to the
   * user showing what the active filter by column will become. If set to false, the icon will fade away.
   */
  setFilterIconHintVisible(visible: boolean): void {
    // No-op if the filter is ACTIVE - should not make the hint visible.
    if (this.filterIconStateView.getValue() === 'ACTIVE') {
      return;
    }
    this.filterIconStateView.next(visible ? 'HINT' : 'INACTIVE');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}