export type TableFilterByColumnData = {
  value: any;
  selected: boolean;
  renderedValue?: any;
  tableIndex?: number;
};

export enum TableFilterByColumnDialogResult {
  ACCEPT,
  CANCEL,
  CLEAR
}
