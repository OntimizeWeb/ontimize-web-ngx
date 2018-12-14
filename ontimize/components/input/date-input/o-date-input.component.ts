import { AfterViewChecked, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import moment from 'moment';

import { OSharedModule, OntimizeMomentDateAdapter } from '../../../shared';
import { MomentService } from '../../../services';
import { OFormValue, IFormValueOptions } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent, OValueChangeEvent } from '../../o-form-data-component.class';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT } from '../text-input/o-text-input.component';
import { Util } from '../../../util/util';

export type ODateValueType = 'string' | 'date' | 'timestamp' | 'iso-8601';

export const DEFAULT_OUTPUTS_O_DATE_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

export const DEFAULT_INPUTS_O_DATE_INPUT = [
  'oformat: format',
  'olocale: locale',
  'oStartView: start-view',
  'oMinDate: min',
  'oMaxDate: max',
  'oTouchUi: touch-ui',
  'oStartAt: start-at',
  'filterDate: filter-date',
  'textInputEnabled: text-input-enabled',
  'valueType: value-type',
  ...DEFAULT_INPUTS_O_TEXT_INPUT
];

export type DateFilterFunction = (date: Date) => boolean;

@Component({
  moduleId: module.id,
  selector: 'o-date-input',
  templateUrl: './o-date-input.component.html',
  styles: ['./o-date-input.component.scss'],
  outputs: DEFAULT_OUTPUTS_O_DATE_INPUT,
  inputs: DEFAULT_INPUTS_O_DATE_INPUT,
  providers: [
    { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class ODateInputComponent extends OFormDataComponent implements AfterViewChecked, OnDestroy, OnInit {

  @ViewChild('matInputRef')
  private matInputRef: ElementRef;

  @ViewChild(MatDatepicker)
  datepicker: MatDatepicker<Date>;

  @ViewChild(MatDatepickerInput)
  datepickerInput: MatDatepickerInput<Date>;

  private momentDateAdapter: DateAdapter<MomentDateAdapter>;

  protected _oformat: string = 'L';
  protected olocale: string;
  protected updateLocaleOnChange: boolean = false;
  protected oStartView: 'month' | 'year' = 'month';
  protected oMinDate: string;
  protected oMaxDate: string;
  @InputConverter()
  protected oTouchUi: boolean;
  protected oStartAt: string;
  protected _filterDate: DateFilterFunction;
  @InputConverter()
  textInputEnabled: boolean = true;
  protected _valueType: ODateValueType = 'timestamp';

  protected _minDateString: string;
  protected _maxDateString: string;

  private momentSrv: MomentService;
  protected media: ObservableMedia;

  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;
  protected dateValue: Date;

  protected _fControlSubscription: Subscription;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    dateAdapter: DateAdapter<OntimizeMomentDateAdapter>,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.momentDateAdapter = dateAdapter;
    this._defaultSQLTypeKey = 'DATE';
    this.momentSrv = this.injector.get(MomentService);
    this.media = this.injector.get(ObservableMedia);
  }

  ngOnInit() {
    this.initialize();

    if (!this.olocale) {
      this.updateLocaleOnChange = true;
      this.olocale = this.momentSrv.getLocale();
    }

    if (this.oformat) {
      (this.momentDateAdapter as any).oFormat = this.oformat;
    }

    this.momentDateAdapter.setLocale(this.olocale);

    if (this.oStartView) {
      this.datepicker.startView = this.oStartView;
    }

    if (this.oStartAt) {
      this.datepicker.startAt = new Date(this.oStartAt);
    }

    if (this.oMinDate) {
      let date = new Date(this.oMinDate);
      let momentD = moment(date);
      if (momentD.isValid()) {
        this.datepickerInput.min = date;
        this.minDateString = momentD.format(this.oformat);
      }
    }

    if (this.oMaxDate) {
      let date = new Date(this.oMaxDate);
      let momentD = moment(date);
      if (momentD.isValid()) {
        this.datepickerInput.max = date;
        this.maxDateString = momentD.format(this.oformat);
      }
    }

    if (this.updateLocaleOnChange) {
      this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
        this.momentDateAdapter.setLocale(this.translateService.getCurrentLang());
        this.setValue(this.getValue());
      });
    }
  }

  ngAfterViewChecked(): void {
    this.mediaSubscription = this.media.subscribe((change: MediaChange) => {
      if (['xs', 'sm'].indexOf(change.mqAlias) !== -1) {
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : true;
      }
      if (['md', 'lg', 'xl'].indexOf(change.mqAlias) !== -1) {
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : false;
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
    if (this.onLanguageChangeSubscription) {
      this.onLanguageChangeSubscription.unsubscribe();
    }
    if (this._fControlSubscription) {
      this._fControlSubscription.unsubscribe();
    }
  }

  getValueAsDate(): any {
    return this.dateValue;
  }

  getValue(): any {
    let timestampValue = super.getValue();
    if (timestampValue && timestampValue instanceof Date) {
      timestampValue = timestampValue.getTime();
    }
    return timestampValue;
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && !this.isDisabled && this.matInputRef.nativeElement.value;
  }

  open() {
    if (!this.isReadOnly && !this.isDisabled) {
      this.datepicker.open();
    }
  }

  getControl(): FormControl {
    const subscribe = !this._fControl;
    let fControl: FormControl = super.getControl();
    if (subscribe) {
      const self = this;
      this._fControlSubscription = fControl.valueChanges.subscribe(value => {
        // equivalente al innerOnChange
        if (!self.value) {
          self.value = new OFormValue();
        }
        self.ensureOFormValue(value);
        self.onChange.emit(value);
      });
    }
    return fControl;
  }

  onChangeEvent(event: MatDatepickerInputEvent<any>) {
    const isValid = event.value && event.value.isValid && event.value.isValid();
    let val = isValid ? event.value.valueOf() : event.value;
    const m = moment(val);
    switch (this.valueType) {
      case 'string':
        val = m.format(this.oformat);
        break;
      case 'date':
        val = new Date(val);
        break;
      case 'iso-8601':
        val = m.toISOString();
        break;
      case 'timestamp':
      default:
        break;
    }
    this.setValue(val, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  innerOnFocus(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  innerOnBlur(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onBlur.emit(event);
    }
  }

  onClickInput(e: Event): void {
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

  protected ensureODateValueType(val: any) {
    if (!Util.isDefined(val)) {
      return val;
    }
    let result = val;
    switch (this.valueType) {
      case 'string':
        if (typeof val === 'string') {
          let m = moment(val, this.oformat);
          if (m.isValid()) {
            this.dateValue = new Date(m.valueOf());
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
          result = undefined;
        } else {
          let m = moment(val);
          if (m.isValid()) {
            this.dateValue = new Date(m.valueOf());
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

  protected setFormValue(val: any, options?: IFormValueOptions, setDirty: boolean = false) {
    let value = val;
    if (val instanceof OFormValue) {
      value = val.value;
    }
    value = this.ensureODateValueType(value);
    super.setFormValue(value, options);
  }

  set valueType(val: any) {
    this._valueType = ODateInputComponent.convertToODateValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  static convertToODateValueType(val: any): ODateValueType {
    let result: ODateValueType = 'timestamp';
    const lowerVal = (val || '').toLowerCase();
    if (lowerVal === 'string' || lowerVal === 'date' || lowerVal === 'timestamp' || lowerVal === 'iso-8601') {
      result = lowerVal;
    }
    return result;
  }
}

@NgModule({
  declarations: [ODateInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ODateInputComponent]
})
export class ODateInputModule { }
