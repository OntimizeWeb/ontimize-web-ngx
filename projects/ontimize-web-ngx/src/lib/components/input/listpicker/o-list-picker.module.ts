import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OSearchInputModule } from '../search-input/o-search-input.module';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
import { OListPickerComponent } from './o-list-picker.component';

@NgModule({
  declarations: [OListPickerDialogComponent, OListPickerComponent],
  imports: [CommonModule, OSharedModule, OSearchInputModule],
  exports: [OListPickerComponent],
  entryComponents: [OListPickerDialogComponent]
})
export class OListPickerModule { }
