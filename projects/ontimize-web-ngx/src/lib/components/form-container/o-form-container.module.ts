import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OFormContainerComponent } from './o-form-container.component';

@NgModule({
    declarations: [OFormContainerComponent],
    imports: [OSharedModule, CommonModule],
    exports: [OFormContainerComponent]
})
export class OFormContainerModule {
}
