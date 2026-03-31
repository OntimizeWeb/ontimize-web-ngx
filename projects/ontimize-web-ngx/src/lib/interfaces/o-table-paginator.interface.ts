export interface OTablePaginator {
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
  showFirstLastButtons: boolean;

  isShowingAllRows: (arg: any) => boolean;
}
