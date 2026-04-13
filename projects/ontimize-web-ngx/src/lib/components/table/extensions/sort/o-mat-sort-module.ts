import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_SORT_HEADER_INTL_PROVIDER } from '@angular/material/sort';

import { OMatSort } from './o-mat-sort';
import { OMatSortHeader } from './o-mat-sort-header';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OMatSort, OMatSortHeader],
  exports: [OMatSort, OMatSortHeader],
  providers: [MAT_SORT_HEADER_INTL_PROVIDER]
})
export class OMatSortModule { }
