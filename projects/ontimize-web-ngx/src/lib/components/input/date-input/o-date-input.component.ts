import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OntimizeMomentDateAdapter } from '../../../shared/material/date/ontimize-moment-date-adapter';
import { DateFilterFunction } from '../../../types/date-filter-function.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT } from '../text-input/o-text-input.component';

export const DEFAULT_OUTPUTS_O_DATE_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

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
  ...DEFAULT_INPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-date-input',
  templateUrl: './o-date-input.component.html',
  styles: ['./o-date-input.component.scss'],
  outputs: DEFAULT_OUTPUTS_O_DATE_INPUT,
  inputs: DEFAULT_INPUTS_O_DATE_INPUT,
  providers: [
    { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class ODateInputComponent extends OFormDataComponent implements OnDestroy, OnInit {

  @InputConverter()
  public textInputEnabled: boolean = true;
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
  protected _valueType: ODateValueType = 'timestamp';

  protected _minDateString: string;
  protected _maxDateString: string;

  protected media: MediaObserver;
  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;
  protected dateValue: Date;

  @ViewChild('picker', { static: true })
  public datepicker: MatDatepicker<Date>;

  @ViewChild(MatDatepickerInput, { static: true })
  public datepickerInput: MatDatepickerInput<Date>;

  @ViewChild('matInputRef', { read: ElementRef, static: true })
  private matInputRef!: ElementRef;

  private momentSrv: MomentService;
  private momentDateAdapter: DateAdapter<MomentDateAdapter>;

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
    this.media = this.injector.get(MediaObserver);
  }

  public ngOnInit(): void {
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
      const date = new Date(this.oMinDate);
      const momentD = moment(date);
      if (momentD.isValid()) {
        this.datepickerInput.min = date;
        this.minDateString = momentD.format(this.oformat);
      }
    }

    if (this.oMaxDate) {
      const date = new Date(this.oMaxDate);
      const momentD = moment(date);
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

    this.subscribeToMediaChanges();
  }

  public subscribeToMediaChanges(): void {
    this.mediaSubscription = this.media.asObservable().subscribe((change: MediaChange[]) => {
      if (['xs', 'sm'].indexOf(change[0].mqAlias) !== -1) {
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : true;
      }
      if (['md', 'lg', 'xl'].indexOf(change[0].mqAlias) !== -1) {
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : false;
      }
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
    let timestampValue = super.getValue();
    if (timestampValue && timestampValue instanceof Date) {
      timestampValue = timestampValue.getTime();
    }
    return timestampValue;
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
  }

  public open(): void {
    if (!this.isReadOnly && this.enabled) {
      this.datepicker.open();
    }
  }

  public onChangeEvent(event: MatDatepickerInputEvent<any>): void {
    const isValid = event.value && event.value.isValid && event.value.isValid();
    let val = isValid ? event.value.valueOf() : event.value;
    const m = moment(val);
    switch (this.valueType) {
      case 'string':
        if (val) {
          val = m.format(this.oformat);
        }
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
      return val;
    }
    let result = val;
    switch (this.valueType) {
      case 'string':
        if (typeof val === 'string') {
          const m = moment(val, this.oformat);
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
          const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            this.dateValue = new Date(val);
          } else {
            result = undefined;
          }
        } else {
          const m = moment(val);
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

}
