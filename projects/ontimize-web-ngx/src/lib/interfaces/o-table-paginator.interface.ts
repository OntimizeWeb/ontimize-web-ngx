export interface OTablePaginator {
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: any[];
  showFirstLastButtons: boolean;

  isShowingAllRows: (arg: any) => boolean;
}
