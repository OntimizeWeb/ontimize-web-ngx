import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { OTableComponent } from '../components/table/o-table.component';

export interface OTableColumn {
  attr: string;
  title: string;
  type: string;
  table: OTableComponent;
  editor: any;
  orderable: boolean;
  searchable: boolean;
  titleAlign: string;
  contentAlign: string;
  container: ViewContainerRef;
  showPlaceHolder: boolean;
  width: string;
  originalWidth: string;
  buildCellEditor: (type: string, resolver: ComponentFactoryResolver, container: ViewContainerRef, propsOrigin: any) => any;
  registerEditor: (editor: any) => void;
  registerRenderer: (editor: any) => void;
}
