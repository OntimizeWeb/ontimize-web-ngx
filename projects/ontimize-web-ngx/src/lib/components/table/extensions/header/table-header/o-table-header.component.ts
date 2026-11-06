import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { OTranslatePipe } from "../../../../../pipes/o-translate.pipe";
import type { OColumn } from "../../../column/o-column.class";
import { OTableBase } from "../../../o-table-base.class";
import { OMatSortHeader } from "../../sort/o-mat-sort-header";
import { OTableHeaderColumnFilterIconComponent } from "../table-header-column-filter-icon/o-table-header-column-filter-icon.component";
import { OTableColumnResizerComponent } from "../table-column-resizer/o-table-column-resizer.component";
import { OColumnValueFilter } from "../../../../../types/table/o-column-value-filter.type";
import { BooleanInputConverter } from "../../../../../decorators/input-converter";

export const DEFAULT_INPUTS_O_TABLE_HEADER = [
  'column',
  // columnFilters: Active filters applied to table columns
  'columnFilters: column-filters',
  // show-header-tooltip [yes|no|true|false]: Inherited from o-table, shows column title as tooltip. Default: false.
  'showHeaderTooltip: show-header-tooltip',
]
@Component({
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, OTranslatePipe, OMatSortHeader, OTableHeaderColumnFilterIconComponent, OTableColumnResizerComponent],
  selector: 'o-table-header',
  inputs: DEFAULT_INPUTS_O_TABLE_HEADER,
  templateUrl: './o-table-header.component.html',
  styleUrls: ['./o-table-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-header]': 'true',
    '(mouseenter)': 'setFilterIconHintVisible(true)',
    '(mouseleave)': 'setFilterIconHintVisible(false)'
  }
})
export class OTableHeaderComponent {

  public column: OColumn;

  public columnFilters: OColumnValueFilter[] = [];

  public resizable: boolean;
  protected _columnFilterIcon: OTableHeaderColumnFilterIconComponent;

  @ViewChild('columnFilterIcon') set columnFilterIcon(value: OTableHeaderColumnFilterIconComponent) {
    this._columnFilterIcon = value;
  }

  @ViewChild(OMatSortHeader) matSortHeader: OMatSortHeader;

  @BooleanInputConverter()
  showHeaderTooltip: boolean = false;

  constructor(
    @Inject(forwardRef(() => OTableBase)) protected table: OTableBase
  ) {
    this.resizable = this.table.resizable;
  }


  isModeColumnFilterable(column: OColumn): boolean {
    return this.table.isColumnFiltersActive && this.table.isColumnFilterable(column);
  }

  setFilterIconHintVisible(visible: boolean) {
    if (this._columnFilterIcon) {
      this._columnFilterIcon.filterIconHintVisible.next(visible);
    }
  }

  ngAfterViewInit(): void {
    this.table.registerTableHeaders(this);
  }

}
