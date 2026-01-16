import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';


export const O_TABLE_CELL_RENDERER_LIST = ['config'];

@Component({
  selector: 'o-table-cell-renderer-list',
  templateUrl: './o-table-cell-renderer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OTableCellRendererListComponent extends OBaseTableCellRenderer {
  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'list';
  }

  initialize() {
    super.initialize();
  }

  /**
     * Returns a display-friendly string for a table cell value.
     *
     * - If `cellvalue` is an array, returns the first element. If the array
     *   has more than one element, appends " (+N)" where N is the number of
     *   additional items (array.length - 1).
     *   Examples:
     *     ['a']           -> 'a'
     *     ['a', 'b', 'c'] -> 'a (+2)'
     *
     * * This is a public method to match the signature in the base class.
     *
     * @public
     * @override
     * @param cellvalue - The cell's value (may be an array or a scalar).

     * @returns A string suitable for display in a single table cell.
     */
  public getCellData(cellvalue: any): string {
    if (cellvalue === null || cellvalue === undefined) {
      return '';
    }
    if (Array.isArray(cellvalue)) {
      if (cellvalue.length === 0) {
        return '';
      }
      return cellvalue[0] + (cellvalue.length > 1 ? ' (+' + (cellvalue.length - 1) + ')' : '');
    } else {
      return cellvalue;
    }
  }

  /**
   * Produces a tooltip string for a cell value.
   *
   * If the provided value is an array, its elements are joined using newline characters and returned.
   * For any non-array value, an empty string is returned.
   *
   * This is a public method to match the signature in the base class.
   *
   * @public
   * @override
   * @param cellValue - The value of the cell to produce a tooltip for. Expected to be an array of items or any other value.
   * @returns A newline-separated string of array elements when `cellValue` is an array; otherwise an empty string.
   */
  public getTooltip(cellValue: any): string {
    return Array.isArray(cellValue) ? cellValue.join('\n') : '';
  }
}


