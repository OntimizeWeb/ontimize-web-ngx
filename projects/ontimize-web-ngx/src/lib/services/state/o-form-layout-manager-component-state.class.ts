import { DefaultComponentStateClass } from './o-component-state.class';

export class OFormLayoutManagerComponentStateClass extends DefaultComponentStateClass {
  // tabgroup
  selectedIndex: number;
  tabsData: any[];

  //splitpane
  queryParams: any;
  url: any;
}
