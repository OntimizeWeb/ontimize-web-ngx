import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { ODualListSelectorComponent } from './o-dual-list-selector.component';

@NgModule({
  imports: [CommonModule, OSharedModule, DragDropModule],
  declarations: [ODualListSelectorComponent],
  exports: [ODualListSelectorComponent]
})
export class ODualListSelectorModule { }
