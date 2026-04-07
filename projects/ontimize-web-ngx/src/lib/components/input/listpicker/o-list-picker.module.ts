import { NgModule } from '@angular/core';

import { O_LISTPICKER_RENDERERS } from './listpicker-renderer/listpicker-renderer';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
import { OListPickerComponent } from './o-list-picker.component';

@NgModule({
    imports: [OListPickerDialogComponent, OListPickerComponent, ...O_LISTPICKER_RENDERERS],
    exports: [OListPickerComponent, ...O_LISTPICKER_RENDERERS]
})
export class OListPickerModule { }
