import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CKEditorComponent } from './ck-editor.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [CKEditorComponent],
  exports: [
    FormsModule,
    CKEditorComponent
  ]
})
export class CKEditorModule { }
