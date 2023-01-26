import { OTablePaginator } from '../../../../../interfaces/o-table-paginator.interface';
import { Codes, Util } from '../../../../../util';

export class OBaseTablePaginator implements OTablePaginator {

  protected _pageIndex: number = 0;
  protected _pageSize: number = 10;
  protected _pageSizeOptions: number[] = Codes.PAGE_SIZE_OPTIONS;
  showFirstLastButtons: boolean = true;

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

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  set pageSizeOptions(value: number[]) {
    if (typeof value === 'string') {
      const opts = Util.parseArray(value, true);
      value = opts.map(o => parseInt(o, 10)).filter(o => !isNaN(o));
    }
    this._pageSizeOptions = value;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    const parsedValue = parseInt(`${value}`, 10);
    if (isNaN(parsedValue) || parsedValue < 0) {
      this._pageSize = this._pageSizeOptions[0];
    } else {
      this._pageSize = parsedValue;
    }
    const result = this.pageSizeOptions.find(option => option === this._pageSize);
    if (!result) {
      this._pageSizeOptions.push(this._pageSize);
      this._pageSizeOptions.sort((i: number, j: number) => i - j);
    }
  }

  public isShowingAllRows(selectedLength): boolean {
    // return this._pageSizeOptions.indexOf(selectedLength) === (this._pageSizeOptions.length - 1);
    // temporal while not having an option for showing all records in paginated tables
    return false;
  }

}
