import { Component, ElementRef, forwardRef, Injector, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { NumberInputConverter } from '../../../decorators/input-converter';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OTextInputComponent } from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_TEXTAREA_INPUT = [
  'columns',
  'rows'
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-textarea-input',
  templateUrl: './o-textarea-input.component.html',
  styleUrls: ['./o-textarea-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXTAREA_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OTextareaInputComponent), multi: true }]
})
export class OTextareaInputComponent extends OTextInputComponent {

  @NumberInputConverter()
  public rows: number = 5;
  @NumberInputConverter()
  public columns: number = 3;

  constructor(
    elRef: ElementRef,
    injector: Injector) {
    super(elRef, injector);
  }

  public isResizable(): boolean {
    let resizable = true;
    if (!this.enabled || this.isReadOnly) {
      resizable = false;
    }
    return resizable;
  }

}
