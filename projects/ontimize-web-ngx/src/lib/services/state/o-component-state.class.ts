export abstract class AbstractComponentStateClass {
  abstract setData(data: any);
}

export class DefaultComponentStateClass extends AbstractComponentStateClass {
  constructor() {
    super();
  }
  setData(data: any) {
    Object.assign(this, data);
  }
}
