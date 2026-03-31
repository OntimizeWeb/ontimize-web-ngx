
export abstract class AbstractComponentStateClass {
  abstract setData(data: any);
}
export abstract class AbstractServiceComponentStateClass extends AbstractComponentStateClass {
  abstract queryRows: number;
  abstract totalQueryRecordsNumber: number;
  abstract queryRecordOffset: number;
  abstract quickFilterValue: string;

}
export class DefaultComponentStateClass extends AbstractComponentStateClass {
  setData(data: any) {
    Object.assign(this, data);
  }
}

export class DefaultServiceComponentStateClass extends AbstractServiceComponentStateClass {

  // quick-filter
  protected 'filter-case-sensitive': boolean;
  protected filterValue: string;
  // page
  totalQueryRecordsNumber: number;
  queryRecordOffset: number;
  protected 'query-rows': number;

  get filterCaseSensitive(): boolean {
    return this['filter-case-sensitive'];
  }

  set filterCaseSensitive(value: boolean) {
    this['filter-case-sensitive'] = value;
  }

  get quickFilterValue(): string {
    return this['filterValue'];
  }

  set quickFilterValue(value: string) {
    this['filterValue'] = value;
  }

  get queryRows(): number {
    return this['query-rows'];
  }

  set queryRows(value: number) {
    this['query-rows'] = value;
  }

  constructor() {
    super();
  }

  setData(data: any) {
    Object.assign(this, data);
  }


}
