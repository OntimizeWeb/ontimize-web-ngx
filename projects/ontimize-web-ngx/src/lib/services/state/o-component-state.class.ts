export abstract class AbstractComponentStateClass {
  abstract setData(data: any);
  abstract totalQueryRecordsNumber: number;
  abstract queryRecordOffset: number;
  abstract quickFilterValue: string;
}

export class DefaultComponentStateClass extends AbstractComponentStateClass {

  // quick-filter
  protected 'filter-case-sensitive': boolean;
  protected filterValue: string;
  // page
  totalQueryRecordsNumber: number;
  queryRecordOffset: number;

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

  constructor() {
    super();
  }

  setData(data: any) {
    Object.assign(this, data);
  }
}
