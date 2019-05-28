import { ChangeDetectionStrategy, Component, ElementRef, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material';
import { FormControl, ValidatorFn } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { Codes } from '../../../../../util/codes';
import { MomentService } from '../../../../../services/moment.service';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
import { Util } from '../../../../../util/util';
import moment from 'moment';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME = [
  ...OBaseTableCellEditor.DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
  'oDateFormat: date-format',
  'oDateLocale: date-locale',
  'oDateStartView: date-start-view',
  'oMinDate: date-min',
  'oMaxDate: date-max',
  'oDateTouchUi: date-touch-ui',
  'oDateStartAt: date-start-at',
  'oHourFormat: hour-format',
  'oHourMin: hour-min',
  'oHourMax: hour-max',
  'oHourPlaceholder: hour-placeholder',
  'oDatePlaceholder: date-placeholder'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TIME = [
  ...OBaseTableCellEditor.DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-editor-time',
  templateUrl: './o-table-cell-editor-time.component.html',
  styleUrls: ['./o-table-cell-editor-time.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TIME,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class OTableCellEditorTimeComponent extends OBaseTableCellEditor implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TIME = DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TIME;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  @ViewChild('dateInput')
  protected dateInput: ElementRef;

  @ViewChild('hourInput')
  protected hourInput: ElementRef;

  @ViewChild('picker')
  private picker: any; // NgxMaterialTimepickerComponent from ngx-material-timepicker

  oStartView: 'month' | 'year' = 'month';

  @ViewChild(MatDatepickerInput)
  public datepickerInput: MatDatepickerInput<Date>;


  formControlHour: FormControl;
  formControlDate: FormControl;

  protected oHourFormat: number = Codes.TWENTY_FOUR_HOUR_FORMAT;
  protected onKeyboardInputDone = false;
  public oDateFormat: string = 'L';
  public oHourMax: string;
  public oHourMin: string;

  private _oDateLocale;
  protected oHourPlaceholder: string;
  protected oDatePlaceholder: string;
  public set oDateLocale(value: string) {
    this._oDateLocale = value;
    if (Util.isDefined(this._oDateLocale)) {
      this.adapter.setLocale(value);
    }
  }

  protected oMinDate: string;
  protected oMaxDate: string;
  protected _minDateString: string;
  protected _maxDateString: string;
  protected datepicker: MatDatepicker<Date>;
  private momentSrv: MomentService;

  constructor(
    protected injector: Injector,
    private adapter: DateAdapter<any>
  ) {
    super(injector);
    this.momentSrv = this.injector.get(MomentService);

  }

  ngOnInit(): void {
    super.ngOnInit();

    this.createInternalFormControl();

    if (!this._oDateLocale) {
      this.oDateLocale = this.momentSrv.getLocale();
    }
    if (this.oMinDate) {
      const date = new Date(this.oMaxDate);
      const momentD = moment(date);
      if (momentD.isValid()) {
        this.datepickerInput.min = date;
        this.minDateString = momentD.format(this.oDateFormat);
      }
    }

    if (this.oMaxDate) {
      const date = new Date(this.oMaxDate);
      const momentD = moment(date);
      if (momentD.isValid()) {
        this.datepickerInput.max = date;
        this.maxDateString = momentD.format(this.oDateFormat);
      }
    }
  }

  public ngAfterViewChecked(): void {
    this.modifyPickerMethods();
  }


  setTime(event) {
    event.preventDefault();
    event.stopPropagation();
    this.picker.setTime();

  }


  createInternalFormControl() {
    if (!this.formControlDate) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: undefined,
        disabled: !this.enabled
      };
      this.formControlDate = new FormControl(cfg, validators);
      this.formGroup.addControl('dateInput', this.formControlDate);
    }

    if (!this.formControlHour) {
      const validators: ValidatorFn[] = this.resolveValidators();
      const cfg = {
        value: undefined,
        disabled: !this.enabled
      };
      this.formControlHour = new FormControl(cfg, validators);
      this.formGroup.addControl('hourInput', this.formControlHour);
    }
  }

  onDateChange(event: MatDatepickerInputEvent<any>) {
    const isValid = event.value && event.value.isValid && event.value.isValid();
    let val = isValid ? event.value.valueOf() :  moment().startOf('day');


    this.formControlDate.setValue(val, {
      emitModelToViewChange: false,
      emitEvent: false
    });
    this.updateComponentValue();
    this.commitEdition();
  }



  onHourChange(event) {
    if (this.formControlHour.invalid) {
      return;
    }
    let value: any;
    if (event instanceof Event) {
      value = moment((event.currentTarget as any).value, this.formatString).valueOf();
    } else {
      value = moment(event, this.formatString).valueOf();
    }

    /** emitModelToViewChange: false  because onChange event is trigger in ngModelChange */
    this.formControlHour.setValue(value, {
      emitEvent: false,
      emitModelToViewChange: false
    });

    this.updateComponentValue()
    this.commitEdition();
  }


  openDatepicker(d: MatDatepicker<Date>) {
    this.datepicker = d;
    d.open();
  }

  getPlaceholderHour() {
    let placeholder = '';
    if (this.oHourPlaceholder) {
      placeholder = this.translateService.get(this.oHourPlaceholder);
    } else {
      placeholder = super.getPlaceholder();
    }
    return placeholder;
  }

  getPlaceholderDate() {
    let placeholder = '';
    if (this.oDatePlaceholder) {
      placeholder = this.translateService.get(this.oDatePlaceholder);
    } else {
      placeholder = super.getPlaceholder();
    }
    return placeholder;
  }

  public open(e?: Event): void {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    if (this.picker) {
      this.picker.open();
    }
  }
  protected setInnerComponentsData(data): void {
    let dateValue: any;
    let hourValue: any;
    if (Util.isDefined(data)) {
      const momentD = moment(data);
      if (momentD.isValid()) {
        dateValue = momentD.clone().startOf('day').valueOf();
        hourValue = momentD.clone().valueOf() - dateValue;
      }
    }
    if (this.dateInput) {
      this.formControlDate.setValue(dateValue);
    }
    if (this.hourInput) {
      this.formControlHour.setValue(hourValue);
    }

  }
  protected handleKeyup(event: KeyboardEvent) {
    const oColumn = this.table.getOColumn(this.tableColumn.attr);
    if (!oColumn) {
      return;
    }
    if (!oColumn.editing && this.datepicker && this.datepicker.opened) {
      this.datepicker.close();
    } else {
      super.handleKeyup(event);
    }
  }

  protected updateComponentValue(): void {

    let timeValue: number;
    const values = this.formGroup.getRawValue();
    const mDate = (values['dateInput'] ? moment(values['dateInput']) : moment()).startOf('day');

    const mHour = moment(values['hourInput']);
    timeValue = mDate.clone()
      .set('hour', mHour.get('hour'))
      .set('minute', mHour.get('minutes'))
      .valueOf();
    if (this.formControl) {
      this.formControl.setValue(timeValue);
      this.formControl.markAsDirty();
    }

  }

  protected modifyPickerMethods(): void {
    if (this.picker) {
      const ngxTimepicker = this.picker.timepickerInput;
      if (ngxTimepicker && ngxTimepicker.onInput) {
        ngxTimepicker.onInput = (value: string) => this.onKeyboardInputDone = true;
      }
    }
  }


  hasErrorDate(error: string): boolean {
    return this.formControlDate && this.formControlDate.touched;
  }

  hasErrorHour(error: string): boolean {
    return this.formControlHour && this.formControlHour.touched && this.hasErrorExclusive(error);
  }


  getCellDataDate(): any {
    let value = super.getCellData();
    if (Util.isDefined(value)) {
      const m = moment(value);
      let result = value;
      if (Util.isDefined(m)) {
        result = m.toDate();
      }
      return result;
    }
    return value;
  }

  getCellDataHour(): any {
    let value = super.getCellData();
    if (Util.isDefined(value)) {
      const m = moment(value);
      let result = value;
      if (Util.isDefined(m)) {
        result = m.format(Codes.formatString(this.oHourFormat));
      }
      return result;
    }
    return value;
  }

  set rowData(arg: any) {
    this._rowData = arg;
    const cellDataDate = this.getCellDataDate();
    this.formControlDate.setValue(cellDataDate);
    //this.formControlDate.markAsTouched();

    const cellDataHour = this.getCellDataHour();
    this.formControlHour.setValue(cellDataHour);
    //this.formControlHour.markAsTouched();
    this.formGroup.markAsTouched();

  }

  get formatString(): string {
    return Codes.formatString(this.oHourFormat);
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

  onClosed() {
    this.dateInput.nativeElement.focus();
  }

  commitEdition() {
    if (!this.formGroup.invalid) {
      super.commitEdition();
    }
  }

  public onKeyDown(e: KeyboardEvent): void {
    if (!this.isInputAllowed(e)) {
      e.preventDefault();
    }
  }
  protected isInputAllowed(e: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].some(n => n === e.keyCode) ||
      (e.key === ':') ||
      // Allow: Ctrl/cmd+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+C
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+X
      (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, up, down
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      return true;
    }
    return !((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105));
  }


}
