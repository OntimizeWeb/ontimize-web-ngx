import { Component, ElementRef, forwardRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { LuxonService } from '../../../services/luxon.service';
import { O_DATE_ADAPTER_PROVIDERS, parseDateByValueTypeWithAdapter } from '../../../shared/material/date/o-date-adapter.provider';
import { DateCustomClassFunction } from '../../../types/date-custom-class.type';
import { DateFilterFunction } from '../../../types/date-filter-function.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_DATE_INPUT = [
  'valueType: value-type',
  'oformat: format',
  'olocale: locale',
  'oStartView: start-view',
  'oMinDate: min',
  'oMaxDate: max',
  'oTouchUi: touch-ui',
  'oStartAt: start-at',
  'filterDate: filter-date',
  'textInputEnabled: text-input-enabled',
  'dateClass: date-class',
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-date-input',
  templateUrl: './o-date-input.component.html',
  inputs: DEFAULT_INPUTS_O_DATE_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [
    ...O_DATE_ADAPTER_PROVIDERS,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ODateInputComponent), multi: true }
  ]
})
export class ODateInputComponent extends OFormDataComponent implements OnDestroy, OnInit {

  @BooleanInputConverter()
  public textInputEnabled: boolean = true;
  protected _oformat: string;
  protected olocale: string;
  protected updateLocaleOnChange: boolean = false;
  protected oStartView: 'month' | 'year' = 'month';
  set oMinDate(value: string) {
    if (value) {
      const date = this.getValueAsDateObject(value)
      if (Util.isDefined(date)) {
        this.datepickerInput.min = new Date(date.valueOf());
        this.minDateString = this.dateAdapter.format(date, this.oformat);
      }
    }
  }
  set oMaxDate(value: string) {
    if (value) {
      const date = this.getValueAsDateObject(value)
      if (Util.isDefined(date)) {
        this.datepickerInput.max = new Date(date.valueOf());
        this.maxDateString = this.dateAdapter.format(date, this.oformat);
      }
    }
  }
  @BooleanInputConverter()
  protected oTouchUi: boolean;
  protected oStartAt: string;
  protected _filterDate: DateFilterFunction;
  protected _dateClass: DateCustomClassFunction
  protected _valueType: ODateValueType = 'timestamp';

  protected _minDateString: string;
  protected _maxDateString: string;

  protected media: BreakpointObserver;
  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;
  protected dateValue: Date | undefined;

  @ViewChild('picker', { static: true })
  public datepicker: MatDatepicker<Date>;

  @ViewChild(MatDatepickerInput, { static: true })
  public datepickerInput: MatDatepickerInput<Date>;

  @ViewChild('matInputRef', { read: ElementRef, static: true })
  private matInputRef!: ElementRef;

  private luxonSrv: LuxonService;
  private dateAdapter: DateAdapter<any>;

  constructor(
    dateAdapter: DateAdapter<any>,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
    this.dateAdapter = dateAdapter;
    this._defaultSQLTypeKey = 'DATE';
    this.luxonSrv = this.injector.get(LuxonService);
    this.media = this.injector.get(BreakpointObserver);
    // Default format follows the active date engine ('D' for Luxon, 'L' for moment)
    const dateFormats: MatDateFormats | null = this.injector.get(MAT_DATE_FORMATS, null);
    this._oformat = dateFormats?.display?.dateInput ?? 'D';
  }

  public ngOnInit(): void {
    this.initialize();

    if (!this.olocale) {
      this.updateLocaleOnChange = true;
      this.olocale = this.luxonSrv.getLocale();
    }

    if (this.oformat) {
      (this.dateAdapter as any).oFormat = this.oformat;
    }

    this.dateAdapter.setLocale(this.olocale);

    if (this.oStartView) {
      this.datepicker.startView = this.oStartView;
    }

    if (this.oStartAt) {
      this.datepicker.startAt = new Date(this.oStartAt);
    }

    if (this.updateLocaleOnChange) {
      this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
        this.dateAdapter.setLocale(this.translateService.getCurrentLang());
        this.setValue(this.getValue());
      });
    }

    this.subscribeToMediaChanges();
  }

  public subscribeToMediaChanges(): void {
    this.mediaSubscription = this.media
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        const isMobile = result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small];
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : !!isMobile;
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
    if (this.onLanguageChangeSubscription) {
      this.onLanguageChangeSubscription.unsubscribe();
    }
  }

  public getValueAsDate(): any {
    return this.dateValue;
  }

  public getValue(): any {
    const value = super.getValue();
    if (!Util.isDefined(value)) {
      return value;
    }
    // While typing, the internal control holds the active adapter's date object; from external data it
    // holds a value in the configured value-type. Normalize both and return undefined when not valid.
    const date = this.dateAdapter.isDateInstance(value) ? value : this.getValueAsDateObject(value);
    if (!Util.isDefined(date) || !this.dateAdapter.isValid(date)) {
      return void 0;
    }
    return parseDateByValueTypeWithAdapter(this.dateAdapter, date.valueOf(), this.valueType, this.oformat);
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
  }

  public open(): void {
    if (!this.isReadOnly && this.enabled) {
      this.datepicker.open();
    }
  }

  public clearValue(options?: FormValueOptions, setDirty: boolean = false): void {
    super.clearValue(options, setDirty);
    this.dateValue = void 0;
  }

  public onChangeEvent(event: MatDatepickerInputEvent<any>): void {
    const isValid = Util.isDefined(event.value) && this.dateAdapter.isValid(event.value);
    let val = isValid ? event.value.valueOf() : event.value;
    const parsedVal = parseDateByValueTypeWithAdapter(this.dateAdapter, val, this.valueType, this.oformat);
    this.setValue(parsedVal, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  public onClickInput(e: Event): void {
    if (!this.textInputEnabled) {
      this.open();
    }
  }

  get filterDate(): DateFilterFunction {
    return this._filterDate;
  }

  set filterDate(val: DateFilterFunction) {
    this._filterDate = val;
  }

  get dateClass(): DateCustomClassFunction {
    return this._dateClass;
  }

  set dateClass(val: DateCustomClassFunction) {
    this._dateClass = val;
  }
  get oformat(): string {
    return this._oformat;
  }

  set oformat(val: string) {
    this._oformat = val;
  }

  get minDateString(): string {
    return this._minDateString;
  }

  set minDateString(val: string) {
    this._minDateString = val;
  }

  get maxDateString(): string {
    return this._maxDateString;
  }

  set maxDateString(val: string) {
    this._maxDateString = val;
  }

  get touchUi(): boolean {
    return this.oTouchUi || false;
  }

  set touchUi(val: boolean) {
    this.oTouchUi = val;
    this.datepicker.touchUi = this.touchUi;
  }

  protected ensureODateValueType(val: any): void {
    if (!Util.isDefined(val)) {
      this.dateValue = void 0;
      return val;
    }
    let result = val;
    switch (this.valueType) {
      case 'string':
        if (typeof val === 'string') {
          const date = this.dateAdapter.parse(val, this.oformat);
          if (Util.isDefined(date) && this.dateAdapter.isValid(date)) {
            this.dateValue = new Date(date.valueOf());
          }
        } else {
          result = undefined;
        }
        break;
      case 'date':
        if ((val instanceof Date)) {
          this.dateValue = val;
        } else {
          result = undefined;
        }
        break;
      case 'timestamp':
        if (typeof val === 'number') {
          this.dateValue = new Date(val);
        } else {
          result = undefined;
        }
        break;
      case 'iso-8601':
        if (typeof val !== 'string') {
          const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            this.dateValue = new Date(val);
          } else {
            result = undefined;
          }
        } else {
          const date = this.dateAdapter.deserialize(val);
          if (Util.isDefined(date) && this.dateAdapter.isValid(date)) {
            this.dateValue = new Date(date.valueOf());
          } else {
            result = undefined;
          }
        }
        break;
      default:
        break;
    }
    if (!Util.isDefined(result)) {
      console.warn(`ODateInputComponent value (${val}) is not consistent with value-type (${this.valueType})`);
    }
    return result;
  }

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    let value = val;
    if (val instanceof OFormValue) {
      value = val.value;
    }
    this.ensureODateValueType(value);
    super.setFormValue(value, options, setDirty);
  }

  set valueType(val: any) {
    this._valueType = Util.convertToODateValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  public createFormControl(cfg, validators): OFormControl {
    this._fControl = super.createFormControl(cfg, validators);
    if (!this.isEmpty() && (!this.form || !this.form.isInInsertMode())) {
      this._fControl.markAsTouched();
    }
    return this._fControl;
  }

  /** Normalizes a value in the configured value-type to the active adapter's date object. */
  protected getValueAsDateObject(val: any): any {
    if (!Util.isDefined(val)) {
      return val;
    }
    let result: any;
    switch (true) {
      case this.valueType === 'string' && typeof val === 'string':
        result = this.dateAdapter.parse(val, this.oformat);
        break;
      case this.valueType === 'date' && val instanceof Date:
        result = this.dateAdapter.deserialize(val);
        break;
      case this.valueType === 'timestamp' && typeof val === 'number':
        result = this.dateAdapter.deserialize(new Date(val));
        break;
      case this.valueType === 'iso-8601' && typeof val === 'string':
        result = this.dateAdapter.deserialize(val);
        break;
      case this.valueType === 'iso-8601':
        if (typeof val !== 'string') {
          const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            result = this.dateAdapter.deserialize(new Date(val));
          }
        }
        break;
      default:
        break;
    }
    return Util.isDefined(result) && this.dateAdapter.isValid(result) ? result : undefined
  }

}
