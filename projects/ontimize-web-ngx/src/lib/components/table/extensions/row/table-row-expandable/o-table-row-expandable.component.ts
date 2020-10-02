import { Component, ViewEncapsulation, ChangeDetectionStrategy, TemplateRef, ContentChild, EventEmitter, Output } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';

export const DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE = [
  'onExpanded',
  'onCollapsed'
];

export const DEFAULT_INPUTS_O_TABLE_ROW_EXPANDABLE = [
  // icon-expand : Icon name to expand. Default: add
  'iconExpand:icon-expand',
  // icon-collapse : Icon name to expand. Default:remove
  'iconCollapse:icon-collapse',
  // Indicates whether or not to show a expandible column. Default:true
  'expandibleColumnVisible:expandible-column-visible'
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
  inputs: DEFAULT_INPUTS_O_TABLE_ROW_EXPANDABLE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableRowExpandableComponent {

  constructor() { }

  @ContentChild(TemplateRef, { static: false }) templateRef: TemplateRef<any>;
  @Output() onExpanded = new EventEmitter<OTableRowExpandedChange>();
  @Output() onCollapsed = new EventEmitter<OTableRowExpandedChange>();
  private _iconCollapse: string = 'remove';
  private _iconExpand: string = 'add';

  @InputConverter()
  public expandibleColumnVisible: boolean = true;

  set iconCollapse(value: string) {
    this._iconCollapse = value;
  }

  get iconCollapse() {
    return this._iconCollapse;
  }

  set iconExpand(value: string) {
    this._iconExpand = value;
  }

  get iconExpand() {
    return this._iconExpand;
  }

}
