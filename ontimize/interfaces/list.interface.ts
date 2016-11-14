import {OListItemDirective} from '../components/list/o-list-item.directive';

export interface IList {

  registerListItem(item: OListItemDirective): void;

  getKeys(): Array<string>;

}


