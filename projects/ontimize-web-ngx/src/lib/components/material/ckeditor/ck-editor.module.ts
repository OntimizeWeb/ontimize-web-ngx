import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CKEditorComponent } from './ck-editor.component';

@NgModule({
  imports: [CKEditorComponent],
  exports: [
    FormsModule,
    CKEditorComponent
  ]
})
export class CKEditorModule { }
