import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { OTableComponent } from '../components/table/o-table.component';
import { Expression } from '../types/expression.type';

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
  tooltipFunction: (rowData: any) => any;
  filterExpressionFunction: (columnAttr: string, quickFilter?: string) => Expression;
  getSQLType: () => number;
  buildCellEditor: (type: string, resolver: ComponentFactoryResolver, container: ViewContainerRef, propsOrigin: any, registerInColumn?:boolean) => any;
  registerEditor: (editor: any) => void;
  registerRenderer: (editor: any) => void;
}
