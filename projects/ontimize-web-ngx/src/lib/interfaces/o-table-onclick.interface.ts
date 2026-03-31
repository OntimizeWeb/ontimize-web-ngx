export interface OnClickTableEvent {
  /** row data */
  row: any;
  /** row index */
  rowIndex: number;
  /** mouseEvent */
  mouseEvent: MouseEvent;
  /** column name   */
  columnName: string;
  /** cell data */
  cell: any;
}
