import { OListItemDirective } from '../components/list/list-item/o-list-item.directive';

export interface IList {

  registerListItemDirective(item: OListItemDirective): void;

  getKeys(): Array<string>;

  setSelected(item: Object);

  isItemSelected(item: Object);
}


