import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OAppSidenavImageModule } from './image/o-app-sidenav-image.component';
import { OSharedModule } from '../../shared/shared.module';
import { OAppSidenavComponent } from './o-app-sidenav.component';
import { OAppSidenavMenuItemModule } from './menu-item/o-app-sidenav-menu-item.module';
import { OAppSidenavMenuGroupModule } from './menu-group/o-app-sidenav-menu-group.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [CommonModule, OAppSidenavMenuGroupModule, OAppSidenavImageModule, OAppSidenavMenuItemModule, OSharedModule, RouterModule],
    declarations: [OAppSidenavComponent],
    exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }