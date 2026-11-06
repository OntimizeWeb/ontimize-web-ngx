import { Component, ElementRef, forwardRef, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { BooleanInputConverter } from '../../../decorators/input-converter';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OTextInputComponent } from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_PASSWORD_INPUT = [
  'showPasswordButton : show-password-button'
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-password-input',
  templateUrl: './o-password-input.component.html',
  inputs: DEFAULT_INPUTS_O_PASSWORD_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OPasswordInputComponent), multi: true }]
})
export class OPasswordInputComponent extends OTextInputComponent implements OnInit {
  public hide: boolean = true;
  @BooleanInputConverter()
  public showPasswordButton: boolean = false;
  constructor(
    elRef: ElementRef,
    injector: Injector) {
    super(elRef, injector);
  }

}
