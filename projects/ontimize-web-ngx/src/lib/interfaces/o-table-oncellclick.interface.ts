export interface OnCellClickTableEvent {

  /** cell data */
  cell: any;
  /** column attr   */
  columnId: string;
  /** column index   */
  columnIndex: number;
  /** row data */
  row: any;
  /** row index */
  rowIndex: number;
  /** mouseEvent */
  mouseEvent: MouseEvent;
}
