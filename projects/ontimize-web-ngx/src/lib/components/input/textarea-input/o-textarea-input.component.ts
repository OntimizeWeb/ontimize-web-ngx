import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { NumberInputConverter } from '../../../decorators/input-converter';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OFormComponent } from '../../form/o-form.component';
import { OTextInputComponent } from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_TEXTAREA_INPUT = [
  'columns',
  'rows'
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FlexLayoutModule, MatFormFieldModule, MatInputModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-textarea-input',
  templateUrl: './o-textarea-input.component.html',
  styleUrls: ['./o-textarea-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXTAREA_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OTextareaInputComponent extends OTextInputComponent {

  @NumberInputConverter()
  public rows: number = 5;
  @NumberInputConverter()
  public columns: number = 3;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  public isResizable(): boolean {
    let resizable = true;
    if (!this.enabled || this.isReadOnly) {
      resizable = false;
    }
    return resizable;
  }

}
