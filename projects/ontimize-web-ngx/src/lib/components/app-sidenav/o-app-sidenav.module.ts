import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.module';
import { OAppSidenavImageComponent } from './image/o-app-sidenav-image.component';
import { OAppSidenavMenuGroupComponent } from './menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavMenuItemComponent } from './menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavComponent } from './o-app-sidenav.component';

@NgModule({
    imports: [CommonModule, OSharedModule, RouterModule, OLanguageSelectorModule],
    declarations: [
        OAppSidenavComponent,
        OAppSidenavMenuGroupComponent,
        OAppSidenavImageComponent,
        OAppSidenavMenuItemComponent
    ],
    exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
