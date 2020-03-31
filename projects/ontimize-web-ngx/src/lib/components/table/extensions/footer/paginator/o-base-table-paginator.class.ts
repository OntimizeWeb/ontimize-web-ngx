import { OTablePaginator } from '../../../../../interfaces/o-table-paginator.interface';

export class OBaseTablePaginator implements OTablePaginator {

  protected _pageIndex: number = 0;
  protected _pageSize: number = 10;
  protected _pageSizeOptions: Array<any>;
  showFirstLastButtons: boolean = true;

  constructor() {
    this._pageIndex = 0;
    this._pageSizeOptions = [10, 25, 50, 100];
  }

  get pageLenght(): number {
    return this._pageSize;
  }

  set pageLenght(value: number) {
    this._pageSize = value;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageIndex(value: number) {
    this._pageIndex = value;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    if (value < 0) {
      this._pageSize = this._pageSizeOptions[0];
    } else {
      this._pageSize = value;
    }

    /* Modify === by == because they option and this._pageSize types  can be diferents (number == string) */
    const result: any[] = this.pageSizeOptions.filter(option => option === this._pageSize);
    if (result.length === 0) {
      this._pageSizeOptions.push(value);
      this._pageSizeOptions.sort((i: number, j: number) => i - j);
    }
  }

  get pageSizeOptions(): Array<any> {
    return this._pageSizeOptions;
  }

  set pageSizeOptions(value: Array<any>) {
    this._pageSizeOptions = value;
  }

  public isShowingAllRows(selectedLength): boolean {
    // return this._pageSizeOptions.indexOf(selectedLength) === (this._pageSizeOptions.length - 1);
    // temporal while not having an option for showing all records in paginated tables
    return false;
  }
}
