import { Component, ChangeDetectionStrategy } from "@angular/core";
import { OGroupedDateColumns } from "../../../../types/o-grouped-date-columns.type";
export const DEFAULT_DUAL_LIST_SELECTOR_DATE_ITEM = [
  'item',
  'initialGroupedDateColumns:initial-grouped-date-columns',
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
  public initialGroupedDateColumns: OGroupedDateColumns[];
  public groupedDateColumns: OGroupedDateColumns[];

  ngOnInit() {
    this.groupedDateColumns = this.initialGroupedDateColumns;
  }

  onSelectionChange(event, itemSelected) {
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
    let viewValue = 'DUAL_LIST_SELECTOR.GROUP_BY_YEAR_MONTH_DAY';
    this.dateTypes.forEach(type => {
      if (type.value == value) {
        viewValue = type.viewValue;
      }
    })
    return viewValue;
  }

}