import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { OGroupedColumnTypes } from "../../../../types/o-grouped-column-types.type";
export const DEFAULT_DUAL_LIST_SELECTOR_DATE_ITEM = [
  'item',
  'groupedDateColumns: grouped-date-columns',
];
@Component({
  selector: 'o-dual-list-selector-date-item',
  templateUrl: './o-dual-list-selector-date-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_DUAL_LIST_SELECTOR_DATE_ITEM
})
export class ODualListSelectorDateItemComponent {
  public dateTypes = [
    { value: 'MONTH', viewValue: 'DUAL_LIST_SELECTOR.GROUP_BY_MONTH' },
    { value: 'YEAR_MONTH', viewValue: 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR_MONTH' },
    { value: 'YEAR', viewValue: 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR' },
    { value: 'YEAR_MONTH_DAY', viewValue: 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR_MONTH_DAY' }
  ];
  public item: string = "";
  public groupedDateColumns: OGroupedColumnTypes[];


  onSelectionChange(event: MatSelectChange, itemSelected: any) {
    let value = event.value;
    let attr = itemSelected;
    let index = this.groupedDateColumns.findIndex(column => column.attr == attr);
    if (index != -1) {
      this.groupedDateColumns.splice(index, 1);
    }
    this.groupedDateColumns.push({ "attr": attr, "type": value })
  }

  getSelectValue(): string {
    let index = this.groupedDateColumns.findIndex(column => column.attr == this.item);
    return index != -1 ? this.groupedDateColumns[index].type : 'YEAR_MONTH_DAY'
  }

  getViewValue(): string {
    let value = this.getSelectValue();
    const indexFindValue = this.dateTypes.findIndex(type => type.value == value);
    return indexFindValue > -1 ? this.dateTypes[indexFindValue].viewValue : 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR_MONTH_DAY';
  }

}