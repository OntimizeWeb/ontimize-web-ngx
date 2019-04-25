import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Injector, NgModule, OnDestroy, OnInit, Optional, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, OValueChangeEvent } from '../../o-form-data-component.class';
import { DateFilterFunction, ODateInputComponent, ODateInputModule } from '../date-input/o-date-input.component';
import { IFormValueOptions, OFormValue } from '../../form/OFormValue';
import { OHourInputComponent, OHourInputModule } from '../hour-input/o-hour-input.component';
import { Subscription, merge } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormControl } from '../o-form-control.class';
import { OSharedModule } from '../../../shared';
import { Util } from '../../../utils';
import moment from 'moment';

export const DEFAULT_INPUTS_O_TIME_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'oDateFormat: date-format',
  'oDateLocale: date-locale',
  'oDateStartView: date-start-view',
  'oDateMinDate: date-min',
  'oDateMaxDate: date-max',
  'oDateTouchUi: date-touch-ui',
  'oDateStartAt: date-start-at',
  'oDateFilterDate: date-filter-date',
  'oDateTextInputEnabled: date-text-input-enabled',

  'oHourFormat: hour-format',
  'oHourMin: hour-min',
  'oHourMax: hour-max',
  'oHourTextInputEnabled: hour-text-input-enabled',
  'oHourPlaceholder:hour-placeholder',
  'oDatePlaceholder:date-placeholder'
];

export const DEFAULT_OUTPUTS_O_TIME_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  moduleId: module.id,
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

  /* inputs */
  oDateFormat: string = 'L';
  oDateLocale: any;
  oDateStartView: 'month' | 'year' = 'month';
  oDateMinDate: any;
  oDateMaxDate: any;
  @InputConverter()
  oDateTouchUi: boolean;
  oDateStartAt: any;
  oDateFilterDate: DateFilterFunction;
  @InputConverter()
  oDateTextInputEnabled: boolean = true;

  oHourFormat: number = 24;
  oHourMin: string;
  oHourMax: string;
  @InputConverter()
  oHourTextInputEnabled: boolean = true;
  oHourPlaceholder = '';
  oDatePlaceholder = '';

  protected blockGroupValueChanges: boolean;

  public static DEFAULT_INPUTS_O_TIME_INPUT = DEFAULT_INPUTS_O_TIME_INPUT;
  public static DEFAULT_OUTPUTS_O_TIME_INPUT = DEFAULT_OUTPUTS_O_TIME_INPUT;

  protected formGroup: FormGroup = new FormGroup({});

  @ViewChild('dateInput')
  protected dateInput: ODateInputComponent;

  @ViewChild('hourInput')
  protected hourInput: OHourInputComponent;

  subscription: Subscription = new Subscription();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector,
    protected cd: ChangeDetectorRef) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'DATE';
  }

  ngOnInit() {
    super.ngOnInit();
    const self = this;
    const mergeSubscription = merge(this.dateInput.onValueChange, this.hourInput.onValueChange).subscribe((event: OValueChangeEvent) => {
      if (event.isUserChange()) {
        self.updateComponentValue();
        var newValue = self._fControl.value;
        self.emitOnValueChange(OValueChangeEvent.USER_CHANGE, newValue, self.oldValue);
        self.oldValue = newValue;
      }
    });

    this.subscription.add(mergeSubscription);

  }

  public createFormControl(cfg, validators): OFormControl {

    this._fControl = super.createFormControl(cfg, validators);
    this._fControl.fControlChildren = [this.dateInput, this.hourInput];
    return this._fControl;

  }

  protected updateComponentValue() {
    if (!this.value) {
      this.value = new OFormValue();
    }
    let timeValue;
    let values = this.formGroup.getRawValue();
    try {
      const dateVal = (values['dateInput'] ? moment(values['dateInput']) : moment()).startOf('day').valueOf();
      const hourVal = this.hourInput.getValueAsTimeStamp() || 0;
      timeValue = dateVal + hourVal;
      //timeValue = hourVal;
    } catch (e) {
      //
    }
    if (this._fControl) {
      this._fControl.setValue(timeValue);
      this._fControl.markAsDirty();
     
    }
    this.ensureOFormValue(timeValue);
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
      if (this.hourInput.getFormControl()) {
        this.formGroup.registerControl('hourInput', this.hourInput.getFormControl());
      }
    }
  }

  onFormControlChange(value: any) {
    super.onFormControlChange(value);
    this.setInnerComponentsData();
  }

  setValue(newValue: any, options?: IFormValueOptions) {
    const changed = this.oldValue !== newValue;
    super.setValue(newValue, options);
    if (changed) {
      this.setInnerComponentsData();
    }
  }

  onClickClearValue(): void {
    this.blockGroupValueChanges = true;
    if (this.dateInput) {
      this.dateInput.clearValue();
    }
    if (this.hourInput) {
      this.hourInput.clearValue();
    }
    this.clearValue();
    this.blockGroupValueChanges = false;
  }

  protected setInnerComponentsData() {
    let dateValue;
    let hourValue;
    if (Util.isDefined(this.value) && Util.isDefined(this.value.value)) {
      const momentD = moment(this.value.value);
      if (momentD.isValid()) {
        dateValue = momentD.clone().startOf('day').valueOf();
        hourValue = momentD.clone().valueOf() - dateValue;
      }
    }
    if (this.dateInput) {
      this.dateInput.setValue(dateValue);
    }
    if (this.hourInput) {
      this.hourInput.setValue(hourValue);
    }

    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }
}

@NgModule({
  declarations: [OTimeInputComponent],
  imports: [OSharedModule, CommonModule, ODateInputModule, OHourInputModule],
  exports: [OTimeInputComponent]
})
export class OTimeInputModule {
}
