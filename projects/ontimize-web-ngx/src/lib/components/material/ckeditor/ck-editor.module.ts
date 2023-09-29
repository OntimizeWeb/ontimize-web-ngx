import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CKEditorComponent } from './ck-editor.component';

@NgModule({
  exports: [
    FormsModule,
    CKEditorComponent
  ],
  declarations: [CKEditorComponent]
})
export class CKEditorModule { }
