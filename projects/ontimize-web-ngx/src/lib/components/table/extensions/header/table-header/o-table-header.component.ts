import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { OColumn } from "../../../column";
import { OTableComponent } from "../../../o-table.component";
import { OMatSortHeader } from "../../sort/o-mat-sort-header";
import { OTableHeaderColumnFilterIconComponent } from "../table-header-column-filter-icon/o-table-header-column-filter-icon.component";

export const DEFAULT_INPUTS_O_TABLE_HEADER = [
  'column'
]
@Component({
  selector: 'o-table-header',
  inputs: DEFAULT_INPUTS_O_TABLE_HEADER,
  templateUrl: './o-table-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-header]': 'true',
    '(mouseenter)': 'setFilterIconHintVisible(true)',
    '(mouseleave)': 'setFilterIconHintVisible(false)'
  }
})
export class OTableHeaderComponent {

  public column: OColumn
  public resizable: boolean;
  protected _columnFilterIcon: OTableHeaderColumnFilterIconComponent;

  @ViewChild('columnFilterIcon', { static: false }) set columnFilterIcon(value: OTableHeaderColumnFilterIconComponent) {
    this._columnFilterIcon = value;
  }

  @ViewChild(OMatSortHeader, { static: false }) matSortHeader: OMatSortHeader;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
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

}