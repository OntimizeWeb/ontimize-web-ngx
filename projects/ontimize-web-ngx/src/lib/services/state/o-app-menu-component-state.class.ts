import { DefaultComponentStateClass } from './o-component-state.class';

export class OAppSidenavComponentStateClass extends DefaultComponentStateClass {

  menu: { id: string, opened: boolean }[];
}
