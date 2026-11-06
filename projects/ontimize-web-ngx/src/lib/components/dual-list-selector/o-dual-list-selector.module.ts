import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { ODualListSelectorDateItemComponent } from './dual-list-selector-item/date/o-dual-list-selector-date-item.component';
import { ODualListSelectorComponent } from './o-dual-list-selector.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [ODualListSelectorComponent, ODualListSelectorDateItemComponent],
  exports: [ODualListSelectorComponent, ODualListSelectorDateItemComponent]
})
export class ODualListSelectorModule { }
