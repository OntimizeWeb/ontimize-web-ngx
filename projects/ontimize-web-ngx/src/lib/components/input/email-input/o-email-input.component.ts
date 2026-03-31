import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import {
  OTextInputComponent
} from '../text-input/o-text-input.component';

@Component({
  selector: 'o-email-input',
  templateUrl: './o-email-input.component.html',
  encapsulation: ViewEncapsulation.None
})
export class OEmailInputComponent extends OTextInputComponent implements OnInit {

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    // Inject email validator
    validators.push(OValidators.emailValidator);
    return validators;
  }

}
