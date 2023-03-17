import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_SORT_HEADER_INTL_PROVIDER } from '@angular/material/sort';

import { OMatSort } from './o-mat-sort';
import { OMatSortHeader } from './o-mat-sort-header';

@NgModule({
  imports: [CommonModule],
  exports: [OMatSort, OMatSortHeader],
  declarations: [OMatSort, OMatSortHeader],
  providers: [MAT_SORT_HEADER_INTL_PROVIDER]
})
export class OMatSortModule { }
