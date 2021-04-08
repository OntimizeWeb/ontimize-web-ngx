import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OSearchInputModule } from '../search-input/o-search-input.module';
import { O_LISTPICKER_RENDERERS } from './listpicker-renderer/listpicker-renderer';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
import { OListPickerComponent } from './o-list-picker.component';

@NgModule({
  declarations: [OListPickerDialogComponent, OListPickerComponent, ...O_LISTPICKER_RENDERERS],
  imports: [CommonModule, OSharedModule, OSearchInputModule],
  exports: [OListPickerComponent, ...O_LISTPICKER_RENDERERS],
  entryComponents: [OListPickerDialogComponent, ...O_LISTPICKER_RENDERERS]
})
export class OListPickerModule { }
