// import * as $ from 'jquery';
import {
  Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators';
import {
  OTextInputModule,
  OTextInputComponent,
  DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT
} from '../text-input/o-text-input.component';

import {
  OIntegerPipe,
  IIntegerPipeArgument
} from '../../../pipes';

export const DEFAULT_INPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'min',
  'max',
  'step',
  'grouping',
  'thousandSeparator : thousand-separator',
  'olocale : locale'
];

export const DEFAULT_OUTPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-integer-input',
  templateUrl: './o-integer-input.component.html',
  styleUrls: ['./o-integer-input.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_INTEGER_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_INTEGER_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})

export class OIntegerInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_INTEGER_INPUT = DEFAULT_INPUTS_O_INTEGER_INPUT;
  public static DEFAULT_OUTPUTS_O_INTEGER_INPUT = DEFAULT_OUTPUTS_O_INTEGER_INPUT;

  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number;

  @InputConverter()
  protected grouping: boolean = false;
  protected thousandSeparator: string;
  protected olocale: string;

  protected componentPipe: OIntegerPipe;
  protected pipeArguments: IIntegerPipeArgument;
  protected focused: boolean = false;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);

    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OIntegerPipe(this.injector);
  }

  ngOnInit() {
    super.ngOnInit();

    this.pipeArguments = {
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator,
      locale: this.olocale
    };

    if (this.step === undefined) {
      this.step = 1;
    }
  }

  getControl(): FormControl {
    let control: FormControl = super.getControl();
    if (control) {
      control.statusChanges.debounceTime(100)
        .subscribe(values => {
          if (!this.focused) {
            this.setPipeValue();
          }
        });
    }
    return control;
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    if (this.focused) {
      let parsedValue = this.componentPipe.transform(this.value.value, this.pipeArguments);
      this.value.value = parsedValue;
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  innerOnFocus(event: any) {
    event.stopPropagation();
    this.focused = true;
    if (this.isReadOnly) {
      return;
    }
    this.setDOMValue(this.getValue());
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  innerOnBlur(event: any) {
    event.stopPropagation();
    this.focused = false;
    if (this.isReadOnly) {
      return;
    }
    this.setPipeValue();
    let formControl = this.getControl();
    if (formControl) {
      formControl.updateValueAndValidity();
    }
    if (!this.isReadOnly && !this.isDisabled) {
      this.onBlur.emit(event);
    }
  }

  setPipeValue() {
    if (typeof this.pipeArguments !== 'undefined' && !this.isEmpty()) {
      let parsedValue = this.componentPipe.transform(this.getValue(), this.pipeArguments);
      this.setDOMValue(parsedValue);
    }
  }

  isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

  setDOMValue(val: any) {
    var inputElement = undefined;
    if (this.elRef.nativeElement.tagName === 'INPUT') {
      inputElement = this.elRef.nativeElement;
    } else {
      inputElement = this.elRef.nativeElement.getElementsByTagName('INPUT')[0];
    }
    if (typeof inputElement !== 'undefined') {
      if (this.focused) {
        // ($ as any)(inputElement).width(($ as any)(inputElement).outerWidth(true));
      }
      inputElement.type = this.focused ? 'number' : 'text';
      inputElement.value = (val !== undefined) ? val : '';
    }
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    if (typeof (this.min) !== 'undefined') {
      validators.push(this.minValidator.bind(this));
    }
    if (typeof (this.max) !== 'undefined') {
      validators.push(this.maxValidator.bind(this));
    }
    return validators;
  }

  protected minValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (control.value < this.min)) {
      return {
        'min': {
          'requiredMin': this.min
        }
      };
    }
    return {};
  }

  protected maxValidator(control: FormControl) {
    if ((typeof (control.value) === 'number') && (this.max < control.value)) {
      return {
        'max': {
          'requiredMax': this.max
        }
      };
    }
    return {};
  }

}


@NgModule({
  declarations: [OIntegerInputComponent],
  imports: [OSharedModule, CommonModule, OTextInputModule],
  exports: [OIntegerInputComponent, OTextInputModule],
})
export class OIntegerInputModule {
}
