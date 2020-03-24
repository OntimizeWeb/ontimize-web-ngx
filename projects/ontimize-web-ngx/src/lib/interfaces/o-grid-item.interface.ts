import { TemplateRef } from '@angular/core';

export interface IGridItem {
  colspan: number;
  rowspan: number;
  template: TemplateRef<any>;
}
