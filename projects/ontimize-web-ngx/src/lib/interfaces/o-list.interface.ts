import { OListItemDirective } from '../components/list/list-item/o-list-item.directive';

export interface IList {
  detailMode: string;
  registerListItemDirective(item: OListItemDirective): void;
  getKeys(): string[];
  setSelected(item: any): void;
  isItemSelected(item: any): boolean;
}
