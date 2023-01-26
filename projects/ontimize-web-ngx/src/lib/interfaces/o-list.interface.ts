import { OListItemDirective } from '../components/list/list-item/o-list-item.directive';
import { IListItem } from './o-list-item.interface';

export interface IList {
  detailMode: string;
  getKeys(): string[];
  setSelected(item: any): void;
  isItemSelected(item: any): boolean;
  onItemDetailClick(item: OListItemDirective | IListItem): void;
  onItemDetailDoubleClick(item: OListItemDirective | IListItem): void;
}
