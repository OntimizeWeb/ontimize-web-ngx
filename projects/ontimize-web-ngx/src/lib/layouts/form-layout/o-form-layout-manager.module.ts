import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutDialogOptionsComponent } from './dialog/options/o-form-layout-dialog-options.component';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutManagerComponent } from './o-form-layout-manager.component';
import { OFormLayoutSplitPaneComponent } from './split-pane/o-form-layout-split-pane.component';
import { OFormLayoutSplitPaneOptionsComponent } from './split-pane/options/o-form-layout-split-pane-options.component';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
import { OFormLayoutTabGroupOptionsComponent } from './tabgroup/options/o-form-layout-tabgroup-options.component';

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule],
  declarations: [
    OFormLayoutDialogComponent,
    OFormLayoutManagerComponent,
    OFormLayoutTabGroupComponent,
    OFormLayoutManagerContentDirective,
    OFormLayoutDialogOptionsComponent,
    OFormLayoutTabGroupOptionsComponent,
    OFormLayoutSplitPaneComponent,
    OFormLayoutSplitPaneOptionsComponent
  ],
  exports: [
    OFormLayoutManagerComponent,
    OFormLayoutDialogOptionsComponent,
    OFormLayoutTabGroupOptionsComponent,
    OFormLayoutSplitPaneOptionsComponent
  ],
  entryComponents: [OFormLayoutDialogComponent],
  providers: [{
    provide: CanActivateFormLayoutChildGuard,
    useClass: CanActivateFormLayoutChildGuard
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OFormLayoutManagerModule { }
