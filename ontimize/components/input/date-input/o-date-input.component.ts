import {
  Component,
  Optional,
  Inject,
  ElementRef,
  Injector,
  forwardRef,
  ViewChild,
  NgModule,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import {
  MdDateFormats,
  DateAdapter,
  MdDatepicker,
  MdDatepickerInput,
  MD_DATE_FORMATS
} from '@angular/material';

import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { InputConverter } from '../../../decorators';
import { MomentService } from '../../../services';

import { MomentDateAdapter } from './adapter/moment.adapter';
import * as moment from 'moment';

import {
  DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT
} from '../text-input/o-text-input.component';

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
  'filterDate: filter-date'
];

export type DateFilterFunction = (date: Date) => boolean;

export let O_DATE_INPUT_DEFAULT_FORMATS: MdDateFormats = {
  parse: { dateInput: 'L' },
  display: { dateInput: 'L', monthYearLabel: 'Y', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM Y' }
};

@Component({
  selector: 'o-date-input',
  templateUrl: './o-date-input.component.html',
  styles: ['./o-date-input.component.scss'],
  outputs: [
    ...DEFAULT_OUTPUTS_O_DATE_INPUT
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_DATE_INPUT
  ],
  providers: [{
    provide: MD_DATE_FORMATS,
    useValue: O_DATE_INPUT_DEFAULT_FORMATS
  }]
})

export class ODateInputComponent extends OFormDataComponent {

  @ViewChild(MdDatepicker)
  datepicker: MdDatepicker<Date>;

  @ViewChild(MdDatepickerInput)
  datepickerInput: MdDatepickerInput<Date>;

  private momentDateAdapter: DateAdapter<MomentDateAdapter>;

  protected _oformat: string = 'L';
  protected olocale: string;
  protected oStartView: 'month' | 'year' = 'month';
  protected oMinDate: string;
  protected oMaxDate: string;
  @InputConverter()
  protected oTouchUi: boolean = false;
  protected oStartAt: string;
  protected _filterDate: DateFilterFunction;

  protected _minDateString: string;
  protected _maxDateString: string;

  private momentSrv: MomentService;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    @Inject(MD_DATE_FORMATS) protected mdDateFormats: MdDateFormats,
    dateAdapter: DateAdapter<MomentDateAdapter>,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.momentDateAdapter = dateAdapter;
    this._defaultSQLTypeKey = 'DATE';
    this.momentSrv = this.injector.get(MomentService);
  }

  ngOnInit() {
    this.initialize();

    if (!this.olocale) {
      this.olocale = this.momentSrv.getLocale();
    }
    this.momentDateAdapter.setLocale(this.olocale);

    if (this.oStartView) {
      this.datepicker.startView = this.oStartView;
    }

    if (this.oTouchUi) {
      this.datepicker.touchUi = this.oTouchUi;
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
  }

  ngAfterViewInit() {
    if (this.oformat) {
      this.mdDateFormats.display.dateInput = this.oformat;
      this.mdDateFormats.parse.dateInput = this.oformat;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    return validators;
  }

  open() {
    if (!this.isReadOnly && !this.isDisabled) {
      this.datepicker.open();
    }
  }

  onModelChange(event: any) {
    this.onChange.emit(event);
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
}

@NgModule({
  declarations: [ODateInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ODateInputComponent]
})

export class ODateInputModule {
}
