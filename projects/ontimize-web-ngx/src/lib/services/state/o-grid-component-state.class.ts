import { DefaultServiceComponentStateClass } from './o-component-state.class';

export class OGridComponentStateClass extends DefaultServiceComponentStateClass {
  protected 'sort-column': string;
  currentPage: number;
  'quickFilterActiveColumns': string;

  get sortColumn(): string {
    return this['sort-column'];
  }

  set sortColumn(value: string) {
    this['sort-column'] = value;
  }
}
