import { DefaultComponentStateClass } from './o-component-state.class';

export class OFilterBuilderComponentStateClass extends DefaultComponentStateClass {

  get filters(): any {
    return this['filters'];
  }

  set filters(value: any) {
    this['filters'] = value;
  }
}
