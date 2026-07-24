import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { DateTime } from 'luxon';
import { merge, Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { O_DATE_ADAPTER_PROVIDERS, parseDateByValueTypeWithAdapter } from '../../../shared/material/date/o-date-adapter.provider';
import { DateFilterFunction } from '../../../types/date-filter-function.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormDataComponent } from '../../o-form-data-component.class';
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
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatTooltipModule, OTranslatePipe, OMatErrorDirective, ODateInputComponent, OHourInputComponent],
  selector: 'o-time-input',
  templateUrl: './o-time-input.component.html',
  styleUrls: ['./o-time-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TIME_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ...O_DATE_ADAPTER_PROVIDERS,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OTimeInputComponent), multi: true }
  ],
  host: {
    '[class.o-time-input]': 'true'
  }
})
export class OTimeInputComponent extends OFormDataComponent implements OnInit, AfterViewInit, OnDestroy {

  public oDateFormat: string;
  public oDateLocale: any;
  public oDateStartView: 'month' | 'year' = 'month';
  public oDateMinDate: any;
  public oDateMaxDate: any;
  @BooleanInputConverter()
  public oDateTouchUi: boolean;
  public oDateStartAt: any;
  public oDateFilterDate: DateFilterFunction;
  @BooleanInputConverter()
  public oDateTextInputEnabled: boolean = true;
  public oHourFormat: number = 24;
  public oHourMin: string;
  public oHourMax: string;
  @BooleanInputConverter()
  public oHourTextInputEnabled: boolean = true;
  public oHourPlaceholder = '';
  public oDatePlaceholder = '';
  protected oformat: string;
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

  private dateAdapter: DateAdapter<any>;

  constructor(
    elRef: ElementRef,
    injector: Injector,
    protected cd: ChangeDetectorRef) {
    super(elRef, injector);
    this._defaultSQLTypeKey = 'DATE';
    this.dateAdapter = this.injector.get(DateAdapter);
    // Default format follows the active date adapter ('D' for Luxon, 'L' for moment)
    const dateFormats: MatDateFormats | null = this.injector.get(MAT_DATE_FORMATS, null);
    this.oDateFormat = dateFormats?.display?.dateInput ?? 'D';
    this.oformat = this.oDateFormat;
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
      // Normalize whatever value-type is configured to millis through the active adapter
      const millis = parseDateByValueTypeWithAdapter(this.dateAdapter, this.value.value, 'timestamp', this.oformat);
      if (typeof millis === 'number' && !isNaN(millis)) {
        // Internal date/hour arithmetic runs on Luxon regardless of the active adapter
        const dt = DateTime.fromMillis(millis);
        dateValue = dt.startOf('day').toMillis();
        hourValue = dt.toMillis() - dateValue;
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
    // The inner control may hold millis or the active adapter's date object (both expose valueOf() → millis)
    const rawDate = values[this.dateAttr];
    const dateMs = typeof rawDate === 'number' ? rawDate : (rawDate ? rawDate.valueOf() : undefined);
    const dDate = (typeof dateMs === 'number' && !isNaN(dateMs) ? DateTime.fromMillis(dateMs) : DateTime.now()).startOf('day');
    const dHour = DateTime.fromFormat(values[this.hourAttr], this.hourInput.formatString);
    timeValue = dDate
      .set({ hour: dHour.hour, minute: dHour.minute })
      .toMillis();
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
    value = parseDateByValueTypeWithAdapter(this.dateAdapter, value, this.valueType, this.oformat);
    super.ensureOFormValue(value);
  }
}
