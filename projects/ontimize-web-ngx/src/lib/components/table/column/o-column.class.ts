import { BehaviorSubject, Observable } from 'rxjs';

import { OTableColumnCalculated } from '../../../interfaces/o-table-column-calculated.interface';
import { OTableColumn } from '../../../interfaces/o-table-column.interface';
import { Expression } from '../../../types/expression.type';
import { OperatorFunction } from '../../../types/operation-function.type';
import { OColumnAggregate } from '../../../types/table/o-column-aggregate.type';
import { OColumnTooltip } from '../../../types/table/o-column-tooltip.type';
import { Codes, Util } from '../../../util';
import { OBaseTableCellRenderer } from './cell-renderer/o-base-table-cell-renderer.class';

export class OColumn {
  attr: string;
  name: string;
  title: string;
  type: string;
  sqlType: number;
  className: string;
  orderable: boolean;
  groupable: boolean;
  _searchable: boolean;
  searching: boolean; // this column is used to filter in quickfilter
  visible: boolean;
  renderer: OBaseTableCellRenderer;
  editor: any;
  protected _editing: boolean = false;
  _width: string;
  minWidth: string;
  maxWidth: string;
  aggregate: OColumnAggregate;
  calculate: string | OperatorFunction;
  definition: OTableColumn;
  tooltip: OColumnTooltip;
  resizable: boolean;
  DOMWidth: number;
  DOMRenderWidth: string;
  filterExpressionFunction: (columnAttr: string, quickFilter?: string) => Expression;

  private multilineSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.multiline);
  public isMultiline: Observable<boolean> = this.multilineSubject.asObservable();
  private _multiline: boolean;

  get editing(): boolean {
    return this._editing;
  }

  set editing(val: boolean) {
    if (this.type === 'boolean' && this.editor && this.editor.autoCommit) {
      this._editing = false;
    }
    this._editing = this.editor != null && val;
  }

  setDefaultProperties(args: any) {
    this.type = 'string';
    this.className = 'o-column-' + (this.type) + ' ';
    this.orderable = args.orderable;
    this.resizable = args.resizable;
    this.groupable = args.groupable;
    this.searchable = true;
    this.searching = true;
    // column without 'attr' should contain only renderers that do not depend on cell data, but row data (e.g. actions)
    this.name = this.attr;
    this.title = this.attr;
    this.multiline = false;
  }

  setColumnProperties(column: OTableColumn & OTableColumnCalculated) {
    this.title = Util.isDefined(column.title) ? column.title : column.attr;
    this.definition = column;
    this.multiline = column.multiline;

    if (Util.isDefined(column.minWidth)) {
      this.minWidth = column.minWidth;
    }
    if (Util.isDefined(column.maxWidth)) {
      this.maxWidth = column.maxWidth;
    }
    if (Util.isDefined(column.orderable)) {
      this.orderable = column.orderable;
    }
    if (Util.isDefined(column.resizable)) {
      this.resizable = column.resizable;
    }
    if (Util.isDefined(column.searchable)) {
      this.searchable = column.searchable;
    }
    if (Util.isDefined(column.groupable)) {
      this.groupable = column.groupable;
    }
    if (Util.isDefined(column.renderer)) {
      this.renderer = column.renderer;
    }
    if (Util.isDefined(column.editor)) {
      this.editor = column.editor;
    }
    if (Util.isDefined(column.type)) {
      this.type = column.type;
      this.className = 'o-column-' + (this.type) + ' ';
    }
    if (Util.isDefined(column.getSQLType)) {
      this.sqlType = column.getSQLType();
    }
    if (Util.isDefined(column.class)) {
      this.className = Util.isDefined(this.className) ? (this.className + ' ' + column.class) : column.class;
    }
    // if (column instanceof OTableColumnCalculatedComponent) {
    if (Util.isDefined(column.operation) || Util.isDefined(column.functionOperation)) {
      this.calculate = column.operation ? column.operation : column.functionOperation;
    }
    // }
    if (Util.isDefined(column.tooltip) && column.tooltip) {
      this.tooltip = {
        value: column.tooltipValue,
        function: column.tooltipFunction
      };
    }
    if (Util.isDefined(column.filterExpressionFunction)) {
      this.filterExpressionFunction = column.filterExpressionFunction;
    }
  }

  set searchable(val: boolean) {
    this._searchable = val;
    this.searching = val;
  }

  get searchable(): boolean {
    return this._searchable;
  }

  set multiline(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._multiline = val;
    this.multilineSubject.next(this._multiline);
  }

  get multiline(): boolean {
    return this._multiline;
  }

  hasTooltip(): boolean {
    return Util.isDefined(this.tooltip);
  }

  getTooltip(rowData: any): any {
    if (!this.hasTooltip()) {
      return undefined;
    }
    let tooltip;
    if (Util.isDefined(this.tooltip.value)) {
      tooltip = this.tooltip.value;
    } else if (Util.isDefined(this.tooltip.function)) {
      try {
        tooltip = this.tooltip.function(rowData);
      } catch (e) {
        console.warn('o-table-column tooltip-function didnt worked');
      }
    } else {
      tooltip = Util.isDefined(this.renderer) ? this.renderer.getTooltip(rowData[this.name], rowData) : rowData[this.name];
    }
    return tooltip;
  }

  getMinWidth() {
    if (Util.isDefined(this.width)) {
      return this.width;
    }
    return this.minWidth;
  }

  getMinWidthValue() {
    return Util.extractPixelsValue(this.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH);
  }

  getMaxWidthValue() {
    const value = Util.extractPixelsValue(this.maxWidth);
    return value ? value : undefined;
  }

  setDOMRenderWidth(horizontalScrolled: boolean, clientWidth: number) {
    if (Util.isDefined(this.width)) {
      this.DOMRenderWidth = this.width;
      return;
    }
    const minValue = Util.extractPixelsValue(this.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH);
    if (Util.isDefined(minValue) && clientWidth > 0 && clientWidth < minValue) {
      this.DOMWidth = minValue;
    }

    if (Util.isDefined(this.maxWidth)) {
      const maxValue = Util.extractPixelsValue(this.maxWidth);
      if (Util.isDefined(maxValue) && clientWidth > maxValue) {
        this.DOMWidth = maxValue;
      }
    }

    const defaultWidth = (horizontalScrolled) ? undefined : 'auto';
    this.DOMRenderWidth = Util.isDefined(this.DOMWidth) ? (this.DOMWidth + 'px') : defaultWidth;
  }

  set width(val: string) {
    let widthVal = val;
    const pxVal = Util.extractPixelsValue(val);
    if (Util.isDefined(pxVal)) {
      this.DOMWidth = pxVal;
      widthVal = undefined;
    }
    this.DOMRenderWidth = widthVal;
    this._width = widthVal;
  }

  get width(): string {
    return this._width;
  }


  getWidthToStore(): any {
    return this._width || this.DOMWidth;
  }

  setWidth(val: number) {
    this.width = val + 'px';
    this.DOMRenderWidth = val + 'px';
    this.DOMWidth = val;
  }

  getTitleAlignClass() {
    if (Util.isDefined(this.definition)) {
      return this.definition.titleAlign || Codes.COLUMN_TITLE_ALIGN_CENTER;
    }
    // default title align
    return Codes.COLUMN_TITLE_ALIGN_CENTER;
  }

  getFilterValue(cellValue: any, rowValue?: any): any[] {
    if (this.renderer) {
      return this.renderer.getFilter(cellValue, rowValue);
    } else {
      return [cellValue];
    }
  }

  useCustomFilterFunction(): boolean {
    return this.searching && this.visible && this.renderer != null && this.renderer.filterFunction != null;
  }

  useQuickfilterFunction(): boolean {
    return this.searching && this.visible && !(this.renderer != null && this.renderer.filterFunction != null);
  }

}
