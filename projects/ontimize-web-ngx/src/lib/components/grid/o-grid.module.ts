import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { ODataToolbarModule } from '../o-data-toolbar/o-data-toolbar.module';
import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';
import { OGridComponent } from './o-grid.component';
import { OGridSkeletonComponent } from './skeketon/o-grid-skeleton/o-grid-skeleton.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
    declarations: [OGridComponent, OGridItemDirective, OGridItemComponent, OGridSkeletonComponent],
    imports: [CommonModule, OSearchInputModule, OSharedModule, RouterModule, ODataToolbarModule, NgxSkeletonLoaderModule],
    exports: [OGridComponent, OGridItemComponent, OGridItemDirective]
})
export class OGridModule { }
