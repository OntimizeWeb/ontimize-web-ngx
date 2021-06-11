import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResizableModule } from 'angular-resizable-element';
import { OFormLayoutManagerComponentStateService } from '../../services/state/o-form-layout-manager-component-state.service';

import { OSharedModule } from '../../shared/shared.module';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutDialogOptionsDirective } from './dialog/options/o-form-layout-dialog-options.directive';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutManagerComponent } from './o-form-layout-manager.component';
import { OFormLayoutSplitPaneComponent } from './split-pane/o-form-layout-split-pane.component';
import { OFormLayoutSplitPaneOptionsDirective } from './split-pane/options/o-form-layout-split-pane-options.directive';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
import { OFormLayoutTabGroupOptionsDirective } from './tabgroup/options/o-form-layout-tabgroup-options.directive';

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule, ResizableModule],
  declarations: [
    OFormLayoutDialogComponent,
    OFormLayoutManagerComponent,
    OFormLayoutTabGroupComponent,
    OFormLayoutManagerContentDirective,
    OFormLayoutTabGroupOptionsDirective,
    OFormLayoutDialogOptionsDirective,
    OFormLayoutSplitPaneComponent,
    OFormLayoutSplitPaneOptionsDirective
  ],
  exports: [
    OFormLayoutManagerComponent,
    OFormLayoutTabGroupOptionsDirective,
    OFormLayoutDialogOptionsDirective,
    OFormLayoutSplitPaneOptionsDirective
  ],
  entryComponents: [OFormLayoutDialogComponent],
  providers: [{
    provide: CanActivateFormLayoutChildGuard,
    useClass: CanActivateFormLayoutChildGuard
  },
    OFormLayoutManagerComponentStateService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OFormLayoutManagerModule { }
