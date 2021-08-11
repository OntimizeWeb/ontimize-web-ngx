import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OContextMenuModule } from '../../contextmenu/o-context-menu.module';
import { ORadioComponent } from './o-radio.component';

@NgModule({
  declarations: [ORadioComponent],
  imports: [CommonModule, OSharedModule, OContextMenuModule],
  exports: [ORadioComponent]
})
export class ORadioModule { }
