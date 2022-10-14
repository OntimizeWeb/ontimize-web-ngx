import { Component, ChangeDetectionStrategy } from "@angular/core";
import { OGroupedDateColumns } from "../../../../types/o-grouped-date-columns.type";
export const DEFAULT_DUAL_LIST_SELECTOR_DATE_ITEM = [
  'item',
  'groupedDateColumns:grouped-date-columns',
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
    { value: 'day-month-year', viewValue: 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR_MONTH_DAY' }
  ];
  public item: string = "";
  public groupedDateColumns: OGroupedDateColumns[] = [];

  onSelectionChange(event, itemSelected) {
    let value = event.value;
    let attr = itemSelected.attr;
    let index = this.findInGroupedDateColumns(attr);
    if (index != null) {
      this.groupedDateColumns.splice(index, 1);
    }
    this.groupedDateColumns.push({ "attr": attr, "type": value })
  }
  getSelectValue(itemSelected): string {
    let index = this.findInGroupedDateColumns(itemSelected.attr);
    return index != null ? this.groupedDateColumns[index].type : 'day-month-year'
  }
  getViewValue(itemSelected): string {
    let value = this.getSelectValue(itemSelected);
    let viewValue = 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR_MONTH_DAY';
    this.dateTypes.forEach(type => {
      if (type.value == value) {
        viewValue = type.viewValue;
      }
    })
    return viewValue;
  }
  findInGroupedDateColumns(attr): number {
    let index = null;
    if (this.groupedDateColumns.length != 0) {
      if (this.groupedDateColumns.find(column => column.attr == attr)) {
        index = this.groupedDateColumns.findIndex(column => column.attr == attr)
      }
    }
    return index;

  }
}