import { Component, Injector, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';


export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = [
  'icon',
  'action'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION = [
  'onClick'
];

@Component({
  selector: 'o-table-cell-renderer-action',
  templateUrl: './o-table-cell-renderer-action.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION
})

export class OTableCellRendererActionComponent extends OBaseTableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION = DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION;

  onClick: EventEmitter<Object> = new EventEmitter<Object>();
  action: string;
  _icon: string;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'action';
    this.tableColumn.orderable = false;
    this.tableColumn.searchable = false;
    this.initialize();
  }

  getCellData(value: any) {
    return value;
  }

  innerOnClick(event, rowData) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.onClick.emit(rowData);
    // if (typeof (this.action) !== 'undefined') {
    //   switch (this.action.toLowerCase()) {
    //     case 'detail':
    //       this.tableColumn.viewDetail(rowData);
    //       break;
    //     case 'edit':
    //       this.tableColumn.editDetail(rowData);
    //       break;
    //     default:
    //       break;
    //   }
    // }
  }

  get icon(): string {
    return this._icon;
  }

  set icon(arg: string) {
    this._icon = arg;
  }
}
