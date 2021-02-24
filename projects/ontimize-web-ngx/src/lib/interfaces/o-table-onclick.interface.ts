export interface OnClickTableEvent {
  /** row data */
  row: any;
  /** row index */
  rowIndex: number;
  /** mouseEvent */
  mouseEvent: MouseEvent;
  /**attr column   */
  columnId: string;
  /** column index in visible columns */
  columnIndex: number;
}
