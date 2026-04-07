import { NgModule } from '@angular/core';
import { OFormLayoutManagerComponentStateService } from '../../services/state/o-form-layout-manager-component-state.service';

import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutDialogOptionsDirective } from './dialog/options/o-form-layout-dialog-options.directive';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutManagerComponent } from './o-form-layout-manager.component';
import { OFormLayoutSplitPaneComponent } from './split-pane/o-form-layout-split-pane.component';
import { OFormLayoutSplitPaneOptionsDirective } from './split-pane/options/o-form-layout-split-pane-options.directive';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
import { OFormLayoutTabGroupOptionsDirective } from './tabgroup/options/o-form-layout-tabgroup-options.directive';
import { OFormLayoutSidenavOptionsDirective } from './sidenav/options/o-form-layout-sidenav-options.directive';
import { OFormLayoutSidenavComponent } from './sidenav/o-form-layout-sidenav.component';

@NgModule({
  imports: [
    OFormLayoutDialogComponent,
    OFormLayoutManagerComponent,
    OFormLayoutTabGroupComponent,
    OFormLayoutManagerContentDirective,
    OFormLayoutTabGroupOptionsDirective,
    OFormLayoutDialogOptionsDirective,
    OFormLayoutSidenavOptionsDirective,
    OFormLayoutSplitPaneComponent,
    OFormLayoutSidenavComponent,
    OFormLayoutSplitPaneOptionsDirective,
  ],
  exports: [
    OFormLayoutManagerComponent,
    OFormLayoutTabGroupOptionsDirective,
    OFormLayoutDialogOptionsDirective,
    OFormLayoutSplitPaneOptionsDirective,
    OFormLayoutSidenavOptionsDirective
  ],
  providers: [{
    provide: CanActivateFormLayoutChildGuard,
    useClass: CanActivateFormLayoutChildGuard
  },
    OFormLayoutManagerComponentStateService
  ]
})
export class OFormLayoutManagerModule { }
