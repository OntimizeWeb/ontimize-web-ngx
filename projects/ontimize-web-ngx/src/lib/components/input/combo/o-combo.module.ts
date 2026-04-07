import { NgModule } from '@angular/core';

import { O_COMBO_RENDERERS } from './combo-renderer/combo-renderer';
import { OComboSearchComponent } from './combo-search/o-combo-search.component';
import { OComboComponent } from './o-combo.component';

@NgModule({
    imports: [
        OComboComponent,
        OComboSearchComponent,
        ...O_COMBO_RENDERERS
    ],
    exports: [
        OComboComponent,
        OComboSearchComponent,
        ...O_COMBO_RENDERERS
    ]
})
export class OComboModule { }
