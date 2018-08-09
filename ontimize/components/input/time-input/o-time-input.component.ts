import { Component, Inject, Injector, forwardRef, ElementRef, EventEmitter, Optional, NgModule, ViewEncapsulation, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ValidatorFn } from '@angular/forms';
import moment from 'moment';

import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';

import { ODateInputModule, ODateInputComponent } from '../date-input/o-date-input.component';
import { OHourInputModule, OHourInputComponent } from '../hour-input/o-hour-input.component';

export const DEFAULT_INPUTS_O_TIME_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_TIME_INPUT = [
  'onChange',
  'onFocus',
  'onBlur'
];

@Component({
  selector: 'o-time-input',
  templateUrl: './o-time-input.component.html',
  styleUrls: ['./o-time-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TIME_INPUT,
  outputs: DEFAULT_OUTPUTS_O_TIME_INPUT,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-time-input]': 'true'
  }
})

export class OTimeInputComponent extends OFormDataComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_TIME_INPUT = DEFAULT_INPUTS_O_TIME_INPUT;
  public static DEFAULT_OUTPUTS_O_TIME_INPUT = DEFAULT_OUTPUTS_O_TIME_INPUT;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  protected formGroup: FormGroup = new FormGroup({});

  @ViewChild('dateInput')
  protected dateInput: ODateInputComponent;

  @ViewChild('hourInput')
  protected hourInput: OHourInputComponent;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'DATE';
  }

  ngOnInit() {
    super.ngOnInit();
    const self = this;
    this.formGroup.valueChanges.subscribe(value => {
      self.updateComponentValue();
    });
  }

  protected updateComponentValue() {
    if (!this.value) {
      this.value = new OFormValue();
    }
    let timeValue;
    let values = this.formGroup.getRawValue();
    try {
      const dateVal = moment(values['dateInput']).startOf('day').valueOf();
      const hourVal = this.hourInput.getValueAsTimeStamp() || 0;
      timeValue = dateVal + hourVal;
    } catch (e) {
      //
    }
    if (this._fControl) {
      this._fControl.setValue(timeValue);
      this._fControl.markAsDirty();
    }
    this.ensureOFormValue(timeValue);
    this.onChange.emit(timeValue);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.dateInput && this.dateInput.getFormControl()) {
      this.formGroup.registerControl('dateInput', this.dateInput.getFormControl());
    }
    if (this.hourInput) {
      this.hourInput.placeHolder = undefined;
      if (this.hourInput.getFormControl()) {
        this.formGroup.registerControl('hourInput', this.hourInput.getFormControl());
      }
    }
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  setData(value: any) {
    this.ensureOFormValue(value);
    if (this._fControl) {
      this._fControl.setValue(this.value.value, {
        emitModelToViewChange: false,
        emitEvent: false
      });
      // if (this._fControl.invalid) {
      //   this._fControl.markAsTouched();
      // }
      this.setInnerComponentsData();
    }
  }

  protected setInnerComponentsData() {
    let dateValue;
    let hourValue;
    if (Util.isDefined(this.value.value)) {
      const momentD = moment(this.value.value);
      if (momentD.isValid()) {
        dateValue = momentD.clone().startOf('day').valueOf();
        hourValue = momentD.clone().valueOf() - dateValue;
      }
    }

    if (this.dateInput) {
      this.dateInput.setValue(dateValue, {
        emitModelToViewChange: false,
        emitEvent: false
      });
    }

    if (this.hourInput) {
      this.hourInput.setTimestampValue(hourValue, {
        emitModelToViewChange: false,
        emitEvent: false
      });
    }
  }

  onFocusInnerComp(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  onBlurInnerComp(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onBlur.emit(event);
    }
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    return validators;
  }
}

@NgModule({
  declarations: [OTimeInputComponent],
  imports: [OSharedModule, CommonModule, ODateInputModule, OHourInputModule],
  exports: [OTimeInputComponent]
})
export class OTimeInputModule {
}
