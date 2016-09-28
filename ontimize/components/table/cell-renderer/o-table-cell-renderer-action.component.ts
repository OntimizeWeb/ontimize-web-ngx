import { Component, OnInit, Inject, Injector, forwardRef } from '@angular/core';

import { ITableCellRenderer } from '../../../interfaces';
import { OTableColumnComponent } from '../o-table-column.component';
import { OTranslateService } from '../../../services';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = [

  // action [detail|delete|edit]: action to perform. Default: no value.
  'action',

  // render-type [string|icon|image|button]: type of value to render. Default: 'icon'.
  'renderType: render-type',

  // render-value [string]: value to render. Default: it depends of render-type.
  'renderValue: render-value'

];

@Component({
  selector: 'o-table-cell-renderer-action',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION
  ]
})
export class OTableCellRendererActionComponent implements OnInit, ITableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION;

  public static ACTION_DETAIL = 'detail';
  public static ACTION_DELETE = 'delete';
  public static ACTION_EDIT = 'edit';

  protected static DEFAULT_RENDER_TYPE = 'icon';
  protected static DEFAULT_RENDER_VALUES = {
    'detail' : 'arrow_forward',
    'delete' : 'delete',
    'edit' : 'edit'
  };
  protected static EDIT_SAVE_ICON = 'done';
  protected static EDIT_CANCEL_ICON = 'clear';

  protected tableColumn: OTableColumnComponent;
  protected translateService: OTranslateService;
  protected action: string;
  protected renderType: string;
  protected renderValue: string;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    this.tableColumn = tableColumn;
    this.tableColumn.registerRenderer(this);
    this.translateService = this.injector.get(OTranslateService);
    this.renderType = OTableCellRendererActionComponent.DEFAULT_RENDER_TYPE;
  }

  public ngOnInit() {
    if ((typeof(this.renderValue) === 'undefined') &&
        OTableCellRendererActionComponent.DEFAULT_RENDER_VALUES.hasOwnProperty(this.action)) {
      this.renderValue = OTableCellRendererActionComponent.DEFAULT_RENDER_VALUES[this.action];
    }
  }

  public init(parameters: any) {
    // nothing to initialize here
  }

  public render(cellData: any, rowData: any): string {
    let actionTranslated = (typeof(this.action) !== 'undefined') ? this.translateService.get(this.action.toUpperCase()) : '';
    let result = '<div class="o-table-row-action" title="' + actionTranslated + '">';
    switch (this.renderType) {
      case 'string':
        result += this.translateService.get(this.renderValue);
        break;
      case 'icon':
        result += '<md-icon class="material-icons">' + this.renderValue + '</md-icon>';
        break;
      case 'image':
        result += '<img src="' + this.renderValue + '" />';
        break;
      case 'button':
        result += '<button md-button type="button" md-raised-button>';
        result += '<span class="o-button-text">' + this.translateService.get(this.renderValue) + '</span>';
        result += '</button>';
        break;
    }
    result += '</div>';
    return result;
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    if (typeof(this.action) !== 'undefined') {
      switch (this.action.toLowerCase()) {
        case OTableCellRendererActionComponent.ACTION_DETAIL:
          cellElement.bind('click', (e) => {
            e.stopPropagation();
            this.tableColumn.viewDetail(rowData);
          });
          break;
        case OTableCellRendererActionComponent.ACTION_DELETE:
          cellElement.bind('click', (e) => {
            e.stopPropagation();
            this.tableColumn.remove(rowData);
          });
          break;
        case OTableCellRendererActionComponent.ACTION_EDIT:
          this.handleEditActionClick(cellElement, rowData);
          break;
      }
    }
  }

  protected handleEditActionClick(cellElement: any, rowData: any) {
    cellElement.bind('click', (e) => {
      e.stopPropagation();

      // render editors
      this.tableColumn.renderRowEditors(cellElement);

      // render actions
      cellElement.html(this.renderEditActions());
      cellElement.find('.o-table-row-action-edit-cancel').bind('click', (e) => {
        e.stopPropagation();

        // render renderers
        this.tableColumn.renderRowRenderers(cellElement, rowData);

        // hide edit buttons
        cellElement.html(this.render(undefined, undefined));
        this.handleCreatedCell(cellElement, rowData);
      });
      cellElement.find('.o-table-row-action-edit-save').bind('click', (e) => {
        e.stopPropagation();

        // save
        let av = this.tableColumn.getRowEditorsAttrValues(cellElement);
        if (typeof(av) !== 'undefined') {
          for (let i in av) {
            if (rowData.hasOwnProperty(i)) {
              rowData[i] = av[i];
            }
          }
          this.tableColumn.updateRow(cellElement, av);
        }

        // render renderers
        this.tableColumn.renderRowRenderers(cellElement, rowData);

        // hide edit buttons
        cellElement.html(this.render(undefined, undefined));
        this.handleCreatedCell(cellElement, rowData);
      });
    });
  }

  protected renderEditActions() {
    let html = '<md-icon class="o-table-row-action-edit-cancel material-icons" title="' + this.translateService.get('CANCEL') + '">' +
      OTableCellRendererActionComponent.EDIT_CANCEL_ICON +
      '</md-icon>' +
      '<md-icon class="o-table-row-action-edit-save material-icons" title="' + this.translateService.get('SAVE') + '">' +
      OTableCellRendererActionComponent.EDIT_SAVE_ICON +
      '</md-icon>';
    return html;
  }

}
