import { Component, Inject, forwardRef, EventEmitter } from '@angular/core';
import { ObservableWrapper } from '../../../util/async';

import { ITableCellEditor } from '../../../interfaces';
import { OTableColumnComponent } from '../o-table-column.component';

@Component({
  selector: 'o-table-cell-editor-string',
  template: ''
})
export class OTableCellEditorStringComponent implements ITableCellEditor {

  public onFocus: EventEmitter<any> = new EventEmitter();
  public onBlur: EventEmitter<any> = new EventEmitter();
  public onSubmit: EventEmitter<any> = new EventEmitter();

  protected tableColumn: OTableColumnComponent;
  protected insertTableInput: any;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent) {
    this.tableColumn = tableColumn;
    this.tableColumn.registerEditor(this);
  }

  public init(parameters: any) {
    // nothing to initialize here
  }

  public getHtml(data: any): string {
    let html = '<input type="text" ';
    if (typeof (data) !== 'undefined') {
      html += 'value="' + data + '" ';
    }
    html += 'onclick="event.stopPropagation();" ondblclick="event.stopPropagation();" />';
    return html;
  }

  public handleCellFocus(cellElement: any, data: any) {
    this.create(cellElement, data);
  }

  public handleCellBlur(cellElement: any) {
    this.performInsertion(cellElement);
  }

  public create(cellElement: any, data: any) {
    let input = cellElement.find('input');
    if (input.length === 0) {
      cellElement.addClass('editing');
      cellElement.html(this.getHtml(data));
      input = cellElement.find('input');
      input.width(input.width() - 24);
      input.bind('keypress', (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
          ObservableWrapper.callEmit(this.onSubmit, { editor: this });
          this.performInsertion(cellElement);
        }
      });
      input.bind('focus', (e) => {
        ObservableWrapper.callEmit(this.onFocus, { editor: this });
      });
      input.bind('focusout', (e) => {
        ObservableWrapper.callEmit(this.onBlur, { editor: this });
        this.performInsertion(cellElement);
      });
      input.focus();
      input.select();
    }
  }

  public destroy(cellElement: any) {
    let input = cellElement.find('input');
    if (input.length > 0) {
      cellElement.removeClass('editing');
      input.remove();
    }
  }

  public performInsertion(cellElement: any) {
    let input = cellElement.find('input');
    if (input.length > 0) {
      let newValue = input.val();
      this.destroy(cellElement);
      this.tableColumn.updateCell(cellElement, newValue);
    }
  }

  public createEditorForInsertTable(cellElement: any, data: any) {
    cellElement.html(this.getHtml(data));
    this.insertTableInput = cellElement.find('input');
    this.insertTableInput.bind('keydown', (e) => {
      let code = e.keyCode || e.which;
      if (code === 13 /*|| code === 9*/) {
        ObservableWrapper.callEmit(this.onSubmit, { insertTable: true, editor: this });
      }
    });
    this.insertTableInput.bind('focus', (e) => {
      ObservableWrapper.callEmit(this.onFocus, { insertTable: true, editor: this });
    });
    this.insertTableInput.bind('focusout', (e) => {
      ObservableWrapper.callEmit(this.onBlur, { insertTable: true, editor: this });
    });
  }

  public getInsertTableValue(): any {
    let value = undefined;
    if (typeof (this.insertTableInput) !== 'undefined') {
      if (this.insertTableInput.val().length > 0) {
        value = this.insertTableInput.val();
      }
    }
    return value;
  }

}
