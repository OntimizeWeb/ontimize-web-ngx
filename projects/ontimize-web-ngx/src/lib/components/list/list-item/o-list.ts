import { OListItemDirective } from './o-list-item.directive';
import { ListItem } from '../../../interfaces/o-list-item.interface';

export interface IList {
  detailMode: string;
  getKeys(): string[];
  setSelected(item: any): void;
  isItemSelected(item: any): boolean;
  onItemDetailClick(item: OListItemDirective | ListItem): void;
  onItemDetailDoubleClick(item: OListItemDirective | ListItem): void;
}
