import {MdListItemDirective} from '../directives/MdListItemDirective';

export interface IListItem {
  getModel(): any;

}

export interface IList {

  registerListItem(item: MdListItemDirective): void;

  getKey(): string;
}


