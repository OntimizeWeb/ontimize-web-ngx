import { DefaultServiceComponentStateClass } from './o-component-state.class';

export class OTreeComponentStateClass extends DefaultServiceComponentStateClass {
  // quick-filter
  protected 'filter': string;
  // page
  'currentPage': number;
  // selection
  'selection': any[];
}
