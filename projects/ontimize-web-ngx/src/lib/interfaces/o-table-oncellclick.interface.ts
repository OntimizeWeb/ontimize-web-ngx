export interface OnCellClickTableEvent {

  /** cell data */
  cell: any;
  /** column name   */
  columnName: string;
  /** row data */
  row: any;
  /** row index */
  rowIndex: number;
  /** mouseEvent */
  mouseEvent: MouseEvent;
}
