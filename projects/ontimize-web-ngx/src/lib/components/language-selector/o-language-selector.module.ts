import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorComponent } from './o-language-selector.component';

@NgModule({
  declarations: [OLanguageSelectorComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OLanguageSelectorComponent]
})
export class OLanguageSelectorModule {
}
