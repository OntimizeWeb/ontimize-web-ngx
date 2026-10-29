import { NgModule } from '@angular/core';

import { OLanguageSelectorComponent } from './o-language-selector.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OLanguageSelectorComponent],
  exports: [OLanguageSelectorComponent]
})
export class OLanguageSelectorModule {
}
