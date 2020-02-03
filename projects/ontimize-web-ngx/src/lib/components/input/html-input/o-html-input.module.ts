import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { CKEditorModule } from '../../material/ckeditor/ck-editor.module';
import { OHTMLInputComponent } from './o-html-input.component';

@NgModule({
  declarations: [OHTMLInputComponent],
  imports: [CKEditorModule, CommonModule, OSharedModule],
  exports: [OHTMLInputComponent]
})
export class OHTMLInputModule { }
