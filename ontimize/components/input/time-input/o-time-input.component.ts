import { Component, Inject, Injector, forwardRef, ElementRef, EventEmitter, Optional, NgModule, ViewEncapsulation, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ValidatorFn, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import moment from 'moment';

import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue, IFormValueOptions } from '../../form/OFormValue';
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
  protected blockGroupValueChanges: boolean;

  public static DEFAULT_INPUTS_O_TIME_INPUT = DEFAULT_INPUTS_O_TIME_INPUT;
  public static DEFAULT_OUTPUTS_O_TIME_INPUT = DEFAULT_OUTPUTS_O_TIME_INPUT;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  protected formGroup: FormGroup = new FormGroup({});
  protected formGroupSubscription: Subscription;
  protected formControlSubscription: Subscription;

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
    this.formGroupSubscription = this.formGroup.valueChanges.subscribe(value => {
      if (!this.blockGroupValueChanges) {
        self.updateComponentValue();
      }
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
      this._fControl.setValue(timeValue, {
        emitModelToViewChange: false,
        emitEvent: true,
        onlySelf: true
      });
      this._fControl.markAsDirty();

      let val = {};
      val[this.getAttribute()] = timeValue;
      this.blockGroupValueChanges = true;
      (this.form.formGroup.valueChanges as EventEmitter<any>).emit(val);
      this.blockGroupValueChanges = false;
    }
    this.ensureOFormValue(timeValue);
    this.onChange.emit(timeValue);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.formGroupSubscription) {
      this.formGroupSubscription.unsubscribe();
    }
    if (this.formControlSubscription) {
      this.formControlSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.modifyFormControls();
    super.ngAfterViewInit();
    this.registerFormControls();
    this.setInnerComponentsData();
  }

  protected modifyFormControls() {
    if (this.dateInput) {
      const self = this;
      this.dateInput.getFormGroup = () => {
        return self.formGroup;
      };
    }

    if (this.hourInput) {
      const self = this;
      this.hourInput.getFormGroup = () => {
        return self.formGroup;
      };
    }

    if (this.form) {
      this.form.formGroup.removeControl('dateInput');
      this.form.formGroup.removeControl('hourInput');
    }
  }

  protected registerFormControls() {
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

  getControl(): FormControl {
    const subscribe = !this._fControl;
    let fControl: FormControl = super.getControl();
    if (subscribe) {
      const self = this;
      this.formControlSubscription = fControl.valueChanges.subscribe(value => {
        if (self.getValue() !== value) {
          // se registra aquí para acciones como el deshacer del formulario, que pone los valosres en los formcontrol
          self.ensureOFormValue(value);
          self.setInnerComponentsData({
            emitModelToViewChange: false,
            emitEvent: false,
            onlySelf: true
          });
        }
      });
    }
    return fControl;
  }

  setData(value: any) {
    this.ensureOFormValue(value);
    if (this._fControl) {
      this._fControl.setValue(this.value.value, {
        emitModelToViewChange: false,
        emitEvent: false
      });
      this.setInnerComponentsData();
    }
  }

  setValue(val: any, options?: IFormValueOptions) {
    super.setValue(val, options);
    this.setInnerComponentsData();
  }

  clearValue(): void {
    this.blockGroupValueChanges = true;
    this.setValue(void 0);
    if (this.dateInput) {
      this.dateInput.clearValue();
    }
    if (this.hourInput) {
      this.hourInput.clearValue();
    }
    this.blockGroupValueChanges = false;
  }

  protected setInnerComponentsData(options?: IFormValueOptions) {
    let dateValue;
    let hourValue;
    if (Util.isDefined(this.value.value)) {
      const momentD = moment(this.value.value);
      if (momentD.isValid()) {
        dateValue = momentD.clone().startOf('day').valueOf();
        hourValue = momentD.clone().valueOf() - dateValue;
      }
    }
    options = options || {
      emitModelToViewChange: false,
      emitEvent: false
    };
    if (this.dateInput) {
      this.dateInput.setValue(dateValue, options);
    }
    if (this.hourInput) {
      this.hourInput.setTimestampValue(hourValue, options);
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
