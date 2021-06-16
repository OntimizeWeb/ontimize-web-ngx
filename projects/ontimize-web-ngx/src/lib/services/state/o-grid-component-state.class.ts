import { DefaultComponentStateClass } from './o-component-state.class';

export class OGridComponentStateClass extends DefaultComponentStateClass {
  protected 'sort-column': string;
  currentPage: number;

  get sortColumn(): string {
    return this['sort-column'];
  }

  set sortColumn(value: string) {
    this['sort-column'] = value;
  }
}
