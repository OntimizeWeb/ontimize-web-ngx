import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';
import { merge, Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators/input-converter';
import { DateFilterFunction } from '../../../types/date-filter-function.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import {
  OFormDataComponent
} from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { ODateInputComponent } from '../date-input/o-date-input.component';
import { OHourInputComponent } from '../hour-input/o-hour-input.component';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_TIME_INPUT = [
  'valueType: value-type',
  'oformat: value-format',
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
  'oHourPlaceholder: hour-placeholder',
  'oDatePlaceholder: date-placeholder'
];

@Component({
  selector: 'o-time-input',
  templateUrl: './o-time-input.component.html',
  styleUrls: ['./o-time-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TIME_INPUT,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-time-input]': 'true'
  }
})
export class OTimeInputComponent extends OFormDataComponent implements OnInit, AfterViewInit, OnDestroy {

  public oDateFormat: string = 'L';
  public oDateLocale: any;
  public oDateStartView: 'month' | 'year' = 'month';
  public oDateMinDate: any;
  public oDateMaxDate: any;
  @InputConverter()
  public oDateTouchUi: boolean;
  public oDateStartAt: any;
  public oDateFilterDate: DateFilterFunction;
  @InputConverter()
  public oDateTextInputEnabled: boolean = true;
  public oHourFormat: number = 24;
  public oHourMin: string;
  public oHourMax: string;
  @InputConverter()
  public oHourTextInputEnabled: boolean = true;
  public oHourPlaceholder = '';
  public oDatePlaceholder = '';
  protected oformat: string = 'L';
  protected _valueType: ODateValueType = 'timestamp';

  protected blockGroupValueChanges: boolean;
  protected formGroup: FormGroup = new FormGroup({});

  @ViewChild('dateInput', { static: true })
  protected dateInput: ODateInputComponent;

  @ViewChild('hourInput', { static: true })
  protected hourInput: OHourInputComponent;

  protected subscription: Subscription = new Subscription();

  public dateAttr = 'dateInput';
  public hourAttr = 'hourInput';

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector,
    protected cd: ChangeDetectorRef) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'DATE';
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.dateAttr += '_' + this.oattr;
    this.hourAttr += '_' + this.oattr;

    this.subscription.add(
      merge(this.dateInput.onValueChange, this.hourInput.onValueChange).subscribe((event: OValueChangeEvent) => {
        if (event.isUserChange()) {
          this.updateComponentValue();
          const newValue = this._fControl.value;
          this.emitOnValueChange(OValueChangeEvent.USER_CHANGE, newValue, this.oldValue);
          this.oldValue = newValue;
        }
      })
    );
  }

  public ngAfterViewInit(): void {
    this.modifyFormControls();
    super.ngAfterViewInit();
    this.registerFormControls();
    this.setInnerComponentsData();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public createFormControl(cfg, validators): OFormControl {
    this._fControl = super.createFormControl(cfg, validators);
    this._fControl.fControlChildren = [this.dateInput, this.hourInput];
    return this._fControl;
  }

  public onFormControlChange(value: any): void {
    super.onFormControlChange(value);
    this.setInnerComponentsData();
  }

  public setValue(newValue: any, options?: FormValueOptions): void {
    const changed = this.oldValue !== newValue;
    super.setValue(newValue, options);
    if (changed) {
      this.setInnerComponentsData();
    }
  }

  public onClickClearValue(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.blockGroupValueChanges = true;
    this.clearValue();
    this.blockGroupValueChanges = false;
  }

  protected setInnerComponentsData(): void {
    let dateValue: any;
    let hourValue: any;
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
      this.hourInput.setTimestampValue(hourValue);
    }
    this.cd.detectChanges();
  }

  protected updateComponentValue(): void {
    if (!this.value) {
      this.value = new OFormValue();
    }
    let timeValue: number;
    const values = this.formGroup.getRawValue();
    const mDate = (values[this.dateAttr] ? moment(values[this.dateAttr]) : moment()).startOf('day');
    const mHour = moment(values[this.hourAttr], this.hourInput.formatString);
    timeValue = mDate.clone()
      .set('hour', mHour.get('hour'))
      .set('minute', mHour.get('minutes'))
      .valueOf();
    this.setFormValue(timeValue);
  }

  protected modifyFormControls(): void {
    if (this.dateInput) {
      this.dateInput.getFormGroup = () => {
        return this.formGroup;
      };
    }

    if (this.hourInput) {
      this.hourInput.getFormGroup = () => {
        return this.formGroup;
      };
    }

    if (this.form) {
      this.form.formGroup.removeControl(this.dateAttr);
      this.form.formGroup.removeControl(this.hourAttr);
    }
  }

  protected registerFormControls(): void {
    if (this.dateInput && this.dateInput.getFormControl()) {
      this.formGroup.registerControl(this.dateAttr, this.dateInput.getFormControl());
    }
    if (this.hourInput) {
      if (this.hourInput.getFormControl()) {
        this.formGroup.registerControl(this.hourAttr, this.hourInput.getFormControl());
      }
    }
  }

  set valueType(val: any) {
    this._valueType = Util.convertToODateValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  public ensureOFormValue(arg: any): void {
    let value = arg;
    if (arg instanceof OFormValue) {
      value = arg.value;
    }
    value = Util.parseByValueType(value, this.valueType, this.oformat);
    super.ensureOFormValue(value);
  }
}
