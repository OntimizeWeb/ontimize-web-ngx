import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OUserInfoComponent } from './o-user-info.component';

@NgModule({
  declarations: [OUserInfoComponent],
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [OUserInfoComponent]
})
export class OUserInfoModule { }
