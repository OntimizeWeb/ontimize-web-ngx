import { NgModule } from '@angular/core';

import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';
import { OGridComponent } from './o-grid.component';
import { OGridSkeletonComponent } from './skeketon/o-grid-skeleton.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
    imports: [OGridComponent, OGridItemDirective, OGridItemComponent, OGridSkeletonComponent],
    exports: [OGridComponent, OGridItemComponent, OGridItemDirective]
})
export class OGridModule { }
