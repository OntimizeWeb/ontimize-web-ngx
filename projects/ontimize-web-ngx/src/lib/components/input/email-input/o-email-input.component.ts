import { Component, ElementRef, forwardRef, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';


import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OValidators } from '../../../validators/o-validators';
import {
  OTextInputComponent
} from '../text-input/o-text-input.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-email-input',
  templateUrl: './o-email-input.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OEmailInputComponent), multi: true }]
})
export class OEmailInputComponent extends OTextInputComponent implements OnInit {

  constructor(
    elRef: ElementRef,
    injector: Injector) {
    super(elRef, injector);
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    // Inject email validator
    validators.push(OValidators.emailValidator);
    return validators;
  }

}
