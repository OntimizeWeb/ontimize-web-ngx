import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OAppHeaderModule } from '../../components/app-header/o-app-header.module';
import { OAppSidenavModule } from '../../components/app-sidenav/o-app-sidenav.module';
import { OSharedModule } from '../../shared/shared.module';
import { OAppLayoutHeaderComponent } from './app-layout-header/o-app-layout-header.component';
import { OAppLayoutSidenavComponent } from './app-layout-sidenav/o-app-layout-sidenav.component';
import { OAppLayoutComponent } from './o-app-layout.component';

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule, OAppSidenavModule, OAppHeaderModule],
  declarations: [OAppLayoutComponent, OAppLayoutHeaderComponent, OAppLayoutSidenavComponent],
  exports: [OAppLayoutComponent, OAppLayoutHeaderComponent, OAppLayoutSidenavComponent]
})
export class OAppLayoutModule { }
