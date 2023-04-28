import { Directive } from '@angular/core';

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
  selector: 'o-table-column-selectall',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_SELECTALL
})
export class OTableColumnSelectAllComponent {

  public title: string;
  public minWidth: string = '12px';
  public maxWidth: string;
  public width: string;
  public resizable = false;
  constructor() { }

}
