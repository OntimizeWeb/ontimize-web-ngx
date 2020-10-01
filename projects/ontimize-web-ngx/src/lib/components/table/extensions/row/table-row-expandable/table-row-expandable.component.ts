import { Component, ViewEncapsulation, ChangeDetectionStrategy, TemplateRef, ContentChild, EventEmitter, Output } from '@angular/core';

export const DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE = [
  'onExpanded',
  'onCollapsed'
];

export const DEFAULT_INPUTS_O_TABLE_ROW_EXPANDABLE = [
  'iconExpanded:icon-expanded',
  'iconCollapsed:icon-collapsed'
];

/** Change event object emitted by OTableRowExpanded. */
export class OTableRowExpandedChange {
  /** The data for row expandable. */
  data: any;
  /** row index for row expandable */
  rowIndex: number;
}


@Component({
  selector: 'o-table-row-expandable',
  template: ' ',
  outputs: DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableRowExpandableComponent {

  constructor() { }

  @ContentChild(TemplateRef, { static: false }) templateRef: TemplateRef<any>;
  @Output() onExpanded = new EventEmitter<OTableRowExpandedChange>();
  @Output() onCollapsed = new EventEmitter<OTableRowExpandedChange>();

}
