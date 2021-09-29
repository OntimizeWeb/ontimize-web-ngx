export type TableFilterByColumnData = {
  value: any;
  selected: boolean;
  rowValue: any;
  renderedValue?: any;
  tableIndex?: number;
};

export enum TableFilterByColumnDialogResult {
  ACCEPT,
  CANCEL,
  CLEAR
}
