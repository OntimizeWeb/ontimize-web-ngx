import { AfterViewChecked, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import moment from 'moment';

import { OSharedModule, OntimizeMomentDateAdapter } from '../../../shared';
import { MomentService } from '../../../services';
import { OFormValue } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent, OValueChangeEvent } from '../../o-form-data-component.class';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT } from '../text-input/o-text-input.component';
import { Util } from '../../../util/util';

export const DEFAULT_OUTPUTS_O_DATE_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

export const DEFAULT_INPUTS_O_DATE_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'oformat: format',
  'olocale: locale',
  'oStartView: start-view',
  'oMinDate: min',
  'oMaxDate: max',
  'oTouchUi: touch-ui',
  'oStartAt: start-at',
  'filterDate: filter-date',
  'textInputEnabled: text-input-enabled'
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

  protected _minDateString: string;
  protected _maxDateString: string;

  private momentSrv: MomentService;
  protected media: ObservableMedia;

  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;

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
        this.setValue(this.getValueAsDate());
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
  }

  set data(value: any) {
    if (value && typeof value.value !== 'undefined') {
      if (typeof value.value === 'number') {
        value.value = new Date(value.value);
      }
    }
    super.setData.call(this, value);
  }

  getValueAsDate(): any {
    let value = this.getValue();
    if (typeof value !== 'undefined') {
      if (typeof value === 'number') {
        let dateObj = new Date(value);
        this.ensureOFormValue(dateObj);
        return dateObj;
      }
    }
    return value;
  }

  getValue(): any {
    let timestampValue: any;
    if (this.value instanceof OFormValue) {
      if (this.value.value) {
        timestampValue = this.value.value;
      }
    }
    if (timestampValue) {
      return timestampValue;
    }
    return undefined;
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && !this.isDisabled && this.matInputRef.nativeElement.value;
  }

  open() {
    if (!this.isReadOnly && !this.isDisabled) {
      this.datepicker.open();
    }
  }

  onModelChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);

    this.onChange.emit(event);
  }

  onChangeEvent(event: MatDatepickerInputEvent<any>) {
    this.setValue(event.value, { changeType: OValueChangeEvent.USER_CHANGE });
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

}

@NgModule({
  declarations: [ODateInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ODateInputComponent]
})
export class ODateInputModule { }
