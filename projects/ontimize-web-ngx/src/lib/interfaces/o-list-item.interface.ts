
export interface IListItem {
  getItemData(): any;
  setItemData(data: any): void;
}

export function instanceOfIListItem(object: any): object is IListItem {
  return 'setItemData' in object;
}
