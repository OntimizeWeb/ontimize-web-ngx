import { ChangeDetectionStrategy, Component, EventEmitter, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = [
  ...DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER,
  'icon',
  'svgIcon:svg-icon',
  'action',
  'text',
  'iconPosition: icon-position'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION = [
  'onClick'
];

@Component({
  selector: 'o-table-cell-renderer-action',
  templateUrl: './o-table-cell-renderer-action.component.html',
  styleUrls: ['./o-table-cell-renderer-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION
})
export class OTableCellRendererActionComponent extends OBaseTableCellRenderer implements OnInit {

  onClick: EventEmitter<object> = new EventEmitter<object>();
  action: string;
  _icon: string;
  text: string;
  iconPosition: string;
  public svgIcon: string;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'action';
    this.tableColumn.orderable = false;
    this.tableColumn.searchable = false;
    this.tableColumn.groupable = false;
  }

  initialize() {
    super.initialize();
    if (this.table) {
      const oCol = this.table.getOColumn(this.tableColumn.attr);
      oCol.title = Util.isDefined(this.tableColumn.title) ? this.tableColumn.title : undefined;
    }
    this.iconPosition = Util.parseIconPosition(this.iconPosition);
  }

  getCellData(value: any) {
    return value;
  }

  innerOnClick(event, rowData) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (Util.isDefined(this.action)) {
      switch (this.action.toLowerCase()) {
        case 'detail':
          this.table.viewDetail(rowData);
          break;
        case 'edit':
          this.table.editDetail(rowData);
          break;
        default:
          break;
      }
    } else {
      this.onClick.emit(rowData);
    }
  }

  get icon(): string {
    return this._icon;
  }

  set icon(arg: string) {
    this._icon = arg;
  }

  isIconPositionLeft() {
    return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
  }

  isIconPositionRight() {
    return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
  }

  isSvgIconPositionRight() {
    return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
  }

  isSvgIconPositionLeft() {
    return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
  }
}
