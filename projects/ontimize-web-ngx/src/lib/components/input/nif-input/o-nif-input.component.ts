import { Component, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import {
  OTextInputComponent
} from '../text-input/o-text-input.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FlexLayoutModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-nif-input',
  templateUrl: './o-nif-input.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ONIFInputComponent extends OTextInputComponent implements OnInit {

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    // Inject NIF validator
    validators.push(OValidators.nifValidator);
    return validators;
  }

}
