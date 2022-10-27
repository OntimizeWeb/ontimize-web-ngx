import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { ODataToolbarModule } from '../o-data-toolbar/o-data-toolbar.module';
import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';
import { OGridComponent } from './o-grid.component';

@NgModule({
  declarations: [OGridComponent, OGridItemDirective, OGridItemComponent],
  imports: [CommonModule, OSearchInputModule, OSharedModule, RouterModule, ODataToolbarModule],
  exports: [OGridComponent, OGridItemComponent, OGridItemDirective],
  entryComponents: [OGridItemComponent]
})
export class OGridModule { }
