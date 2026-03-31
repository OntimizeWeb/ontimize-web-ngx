import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.module';
import { OUserInfoModule } from '../user-info/o-user-info.module';
import { OAppHeaderComponent } from './o-app-header.component';

@NgModule({
  imports: [CommonModule, OLanguageSelectorModule, OUserInfoModule, OSharedModule],
  declarations: [OAppHeaderComponent],
  exports: [OAppHeaderComponent]
})
export class OAppHeaderModule { }
