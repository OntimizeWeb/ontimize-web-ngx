import { OListItemDirective } from '../components/list/list-item/o-list-item.directive';
import { ListItem } from '../components/list/list-item/o-list-item';

export interface IList {
  detailMode: string;
  getKeys(): string[];
  setSelected(item: any): void;
  isItemSelected(item: any): boolean;
  onItemDetailClick(item: OListItemDirective | ListItem): void;
  onItemDetailDoubleClick(item: OListItemDirective | ListItem): void;
}
