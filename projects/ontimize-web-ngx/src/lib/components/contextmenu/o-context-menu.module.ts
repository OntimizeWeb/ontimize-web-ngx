import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OContextMenuGroupComponent } from './context-menu-group/o-context-menu-group.component';
import { OContextMenuItemComponent } from './context-menu-item/o-context-menu-item.component';
import { OContextMenuSeparatorComponent } from './context-menu-separator/o-context-menu-separator.component';
import { OContextMenuContentComponent } from './context-menu/o-context-menu-content.component';
import { OWrapperContentMenuComponent } from './context-menu/o-wrapper-content-menu/o-wrapper-content-menu.component';
import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuDirective } from './o-context-menu.directive';

@NgModule({
    imports: [CommonModule, OSharedModule],
    exports: [CommonModule, OContextMenuDirective, OContextMenuComponent, OContextMenuItemComponent, OContextMenuGroupComponent, OContextMenuSeparatorComponent],
    declarations: [
        OContextMenuDirective,
        OContextMenuContentComponent,
        OContextMenuComponent,
        OContextMenuItemComponent,
        OContextMenuGroupComponent,
        OWrapperContentMenuComponent,
        OContextMenuSeparatorComponent
    ]
})
export class OContextMenuModule { }
