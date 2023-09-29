import { Directive } from '@angular/core';
import { BooleanInputConverter } from '../../../../../decorators/input-converter';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_SELECTALL = [
  'width',
  // only in pixels
  'minWidth: min-width',

  // only in pixels
  'maxWidth: max-width',
  'title',
  'resizable'
]
@Directive({
  selector: 'o-table-column-select-all',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_SELECTALL
})
export class OTableColumnSelectAllDirective {

  public title: string;
  public minWidth: string;
  public maxWidth: string;
  public width: string = '18px';
  @BooleanInputConverter()
  public resizable:boolean = false;

}
