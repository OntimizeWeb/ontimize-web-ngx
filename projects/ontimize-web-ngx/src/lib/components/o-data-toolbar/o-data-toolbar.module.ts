import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { ODataToolbarComponent } from './o-data-toolbar.component';

@NgModule({
  declarations: [
    ODataToolbarComponent
  ],
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [
    ODataToolbarComponent
  ]
})
export class ODataToolbarModule { }
