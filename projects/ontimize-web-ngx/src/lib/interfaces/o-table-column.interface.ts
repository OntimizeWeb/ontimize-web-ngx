import { ViewContainerRef } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { OTableComponent } from '../components/table/o-table.component';
import { Expression } from '../types/expression.type';
import { ErrorData } from '../types/error-data.type';

export interface OTableColumn {
  attr: string;
  title: string;
  type: string;
  table: OTableComponent;
  editor: any;
  renderer: any;
  multiline: boolean;
  orderable: boolean;
  searchable: boolean;
  groupable: boolean;
  resizable: boolean;
  titleAlign: string;
  contentAlign: string;
  container: ViewContainerRef;
  showPlaceHolder: boolean;
  width: string;
  minWidth: string;
  maxWidth: string;
  originalWidth: string;
  class: string;
  tooltip: boolean;
  tooltipValue: string;
  angularValidatorsFn: ValidatorFn[];
  angularValidatorsFnErrors: ErrorData[];
  angularAsyncValidatorsFn: AsyncValidatorFn[];
  tooltipFunction: (rowData: any) => any;
  filterExpressionFunction: (columnAttr: string, quickFilter?: string) => Expression;
  getSQLType: () => number;
  buildCellEditor: (type: string, container: ViewContainerRef, propsOrigin: any, registerInColumn?: boolean) => any;
  registerEditor: (editor: any) => void;
  registerRenderer: (editor: any) => void;
}
