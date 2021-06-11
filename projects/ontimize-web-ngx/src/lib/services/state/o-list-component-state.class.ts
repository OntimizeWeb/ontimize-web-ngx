import { DefaultComponentStateClass } from './o-component-state.class';

export class OListComponentStateClass extends DefaultComponentStateClass {
  protected 'sort-columns': string;
  'quickFilterActiveColumns': string;
  'selectedIndexes': number[];

  get sortColumns(): string {
    return this['sort-columns'];
  }

  set sortColumns(value: string) {
    this['sort-columns'] = value;
  }
}
