import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OLanguageSelectorModule } from '../../language-selector/o-language-selector.component';
import { OSharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';

import { OAppSidenavMenuItemComponent } from './o-app-sidenav-menu-item.component';

@NgModule({
  imports: [CommonModule, OLanguageSelectorModule, OSharedModule, RouterModule],
  declarations: [OAppSidenavMenuItemComponent],
  exports: [OAppSidenavMenuItemComponent]
})
export class OAppSidenavMenuItemModule { }
