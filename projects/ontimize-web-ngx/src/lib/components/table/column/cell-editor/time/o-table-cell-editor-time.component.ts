import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Injector, OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateTime } from 'luxon';
import { NgxMaterialTimepickerModule, NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';

import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { OMatErrorDirective } from '../../../../../directives/o-mat-error.directive';
import { OHourTimepickerDirective } from '../../../../input/hour-input/o-hour-input.directive';

import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { LuxonService } from '../../../../../services/luxon.service';
import { O_DATE_ADAPTER_PROVIDERS } from '../../../../../shared/material/date/o-date-adapter.provider';
import { FormValueOptions } from '../../../../../types/form-value-options.type';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
import { takeUntil } from 'rxjs';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME = [
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

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatButtonModule, MatTooltipModule, NgxMaterialTimepickerModule, OHourTimepickerDirective, OTranslatePipe, OMatErrorDirective],
  selector: 'o-table-cell-editor-time',
  templateUrl: './o-table-cell-editor-time.component.html',
  styleUrls: ['./o-table-cell-editor-time.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ...O_DATE_ADAPTER_PROVIDERS
  ],
})

export class OTableCellEditorTimeComponent extends OBaseTableCellEditor implements OnInit, AfterViewChecked {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  @ViewChild('dateInput')
  protected dateInput: ElementRef;

  @ViewChild('hourInput')
  protected hourInput: ElementRef;

  @ViewChild('picker')
  public picker: NgxMaterialTimepickerComponent;

  oStartView: 'month' | 'year' = 'month';

  @ViewChild(MatDatepickerInput)
  public datepickerInput: MatDatepickerInput<Date>;

  formControlHour: FormControl;
  formControlDate: FormControl;

  public oDateFormat: string;
  public oHourMax: string;
  public oHourMin: string;
  @BooleanInputConverter()
  public oDateTouchUi: boolean;
  public oDateStartAt: string;

  private _oDateLocale;
  protected oHourPlaceholder: string;
  protected oDatePlaceholder: string;
  public oHourFormat: number = Codes.TWENTY_FOUR_HOUR_FORMAT;
  protected onKeyboardInputDone = false;
  protected oMinDate: string;
  protected oMaxDate: string;
  protected _minDateString: string;
  protected _maxDateString: string;
  protected datepicker: MatDatepicker<Date>;
  private luxonSrv: LuxonService;

  // only true when hour input is focused
  public enabledCommitOnTabPress: boolean = false;
  protected activeKeys: object = {};
  cd: ChangeDetectorRef;

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    this.handleKeydown(event);
  }

  constructor(
    protected injector: Injector,
    private adapter: DateAdapter<any>
  ) {
    super(injector);
    this.cd = this.injector.get(ChangeDetectorRef);
    this.luxonSrv = this.injector.get(LuxonService);
    // Default format follows the active date adapter ('D' for Luxon, 'L' for moment)
    const dateFormats: MatDateFormats | null = this.injector.get(MAT_DATE_FORMATS, null);
    this.oDateFormat = dateFormats?.display?.dateInput ?? 'D';
  }

  initialize(): void {
    super.initialize();
    this.createInternalFormControl();
    if (!this._oDateLocale) {
      this.oDateLocale = this.luxonSrv.getLocale();
    }

    if (this.oMinDate) {
      const date = new Date(this.oMinDate);
      const d = this.adapter.deserialize(date);
      if (Util.isDefined(d) && this.adapter.isValid(d)) {
        this.minDateString = this.adapter.format(d, this.oDateFormat);
      }
    }

    if (this.oMaxDate) {
      const date = new Date(this.oMaxDate);
      const d = this.adapter.deserialize(date);
      if (Util.isDefined(d) && this.adapter.isValid(d)) {
        this.maxDateString = this.adapter.format(d, this.oDateFormat);
      }
    }
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

  public ngAfterViewChecked(): void {
    this.modifyPickerMethods();
  }

  setTime(event: string) {
    this.picker.updateTime(this.formControlHour.value);
  }

  onDateChange(event: MatDatepickerInputEvent<any>) {
    const isValid = Util.isDefined(event.value) && this.adapter.isValid(event.value);
    const val = isValid ? event.value.valueOf() : new Date().setHours(0, 0, 0, 0);

    this.formControlDate.setValue(val, {
      emitModelToViewChange: false,
      emitEvent: false
    });
    this.updateComponentValue();
  }

  protected updateValeOnInputChange(blurEvent: any): void {
    if (this.onKeyboardInputDone) {
      let value: string = blurEvent.currentTarget.value;
      // ngx-material-timepicker does not allow writing characters on input, so we add 'AM/PM' in order to make validation work properly
      value = this.parseHour(value);
      this.formControlHour.setValue(value);
    }
    this.onKeyboardInputDone = false;
  }

  /**
   * Receives an hour input introduced by the user and returns the hour formated acording current format
   * @param value
   */
  protected parseHour(value: string): string {
    const strArray = value.split(':');
    let hour: any = strArray[0];

    if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.oHourFormat) {
      if (hour) {
        hour = parseInt(hour, 10);
        const period = hour <= 12 ? ' AM' : ' PM';
        if (hour > 12) {
          hour = hour - 12;
        }
        strArray[0] = hour;
        value = strArray.join(':') + period;
      }
    }
    return value;
  }

  public onHourChange(event) {
    let value;
    if (event instanceof Event) {
      this.updateValeOnInputChange(event);
    } else {
      value = this.convertToFormatString(event);
      /** emitModelToViewChange: false  because onChange event is trigger in ngModelChange */
      this.formControlHour.setValue(value, {
        emitEvent: false,
        emitModelToViewChange: false
      });
    }
    this.updateComponentValue();
  }

  public setTimestampValue(value: any, options?: FormValueOptions): void {
    let parsedValue;
    const dt = Util.isDefined(value) ? DateTime.fromMillis(value, { zone: 'utc' }) : value;
    if (dt && dt.isValid) {
      parsedValue = dt.toFormat(this.formatString);
    }
    this.formControlHour.setValue(parsedValue, options);
  }

  protected convertToFormatString(value): string {
    if (value === '00:00' || !Util.isDefined(value)) {
      return value;
    }
    const formatStr = this.oHourFormat === Codes.TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
    let result;
    if (typeof value === 'number') {
      result = DateTime.fromMillis(value).toFormat(formatStr);
    } else {
      result = value ? DateTime.fromFormat(value, 'h:mm a').toFormat(formatStr) : value;
    }
    return result;
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
    if (this.picker) {
      this.picker.open();
    }
  }

  protected handleKeydown(e: KeyboardEvent) {
    this.activeKeys[(e.key || e.keyCode)] = true;
  }

  protected handleKeyup(e: KeyboardEvent) {
    this.activeKeys[(e.key || e.keyCode)] = false;
    const oColumn = this.table.getOColumn(this.tableColumn.attr);
    if (!oColumn) {
      return;
    }

    if (this.checkKey(e, "Tab", 9) && (this.activeKeys[16] || this.activeKeys["Shift"] || !this.enabledCommitOnTabPress)) {
      // tab + shift or tab pressed with focus in the date component
      return;
    }
    if (!oColumn.editing && this.datepicker && this.datepicker.opened) {
      this.datepicker.close();
    } else {
      super.handleKeyup(e);
    }
  }

  protected updateComponentValue(): void {

    let timeValue: number;
    const values = this.formGroup.getRawValue();
    const dDate = (values['dateInput'] ? this.toDateTime(values['dateInput']) : DateTime.now()).startOf('day');

    const dHour = DateTime.fromFormat(values['hourInput'], this.formatString);
    timeValue = dDate
      .set({ hour: dHour.hour, minute: dHour.minute })
      .toMillis();

    if (this.formControl) {
      this.formControl.setValue(timeValue);
      this.formControl.markAsDirty();
    }
  }

  protected modifyPickerMethods(): void {
    if (this.picker && this.picker.inputElement) {
      this.picker.inputElement.addEventListener('change', () => {
        this.onKeyboardInputDone = true;
      });


      this.picker.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.cd.detectChanges();

          // Another solution was to add a 200ms delay, but the following is a better solution as it doesn't add any delays.
          setTimeout(() => {
            queueMicrotask(() => {
              const input: HTMLInputElement | null =
                this.hourInput?.nativeElement?.querySelector?.('input') ||
                this.hourInput?.nativeElement;

              if (input && !input.disabled) {
                input.focus({ preventScroll: true });
              }
            });
          }, 0);
        });
    }
  }

  hasErrorDate(error: string): boolean {
    return this.formControlDate && this.formControlDate.touched && this.hasErrorExclusive(error);
  }

  hasErrorExclusive(error: string): boolean {
    let hasError = false;
    const errorsOrder = ['matDatepickerMax', 'matDatepickerMin', 'matDatepickerFilter', 'matDatepickerParse', 'required'];
    const errors = this.formControlDate.errors;
    if (Util.isDefined(errors)) {
      if (Object.keys(errors).length === 1) {
        return errors.hasOwnProperty(error);
      } else {
        for (let i = 0, len = errorsOrder.length; i < len; i++) {
          hasError = errors.hasOwnProperty(errorsOrder[i]);
          if (hasError) {
            hasError = (errorsOrder[i] === error);
            break;
          }
        }
      }
    }
    return hasError;
  }
  hasErrorHour(error: string): boolean {
    return this.formControlHour && this.formControlHour.touched;
  }

  getCellDataDate(): any {
    const value = super.getCellData();
    if (Util.isDefined(value)) {
      const dt = this.toDateTime(value);
      let result = value;
      if (Util.isDefined(dt)) {
        result = dt.toJSDate();
      }
      return result;
    }
    return value;
  }

  getCellDataHour(): any {
    const value = super.getCellData();
    if (Util.isDefined(value)) {
      const dt = this.toDateTime(value);
      let result = value;
      if (Util.isDefined(dt)) {
        result = dt.toFormat(Codes.formatString(this.oHourFormat));
      }
      return result;
    }
    return value;
  }

  /**
   * Internal hour/date arithmetic runs on Luxon regardless of the active adapter (millis in,
   * formatted string out). Accepts a DateTime, the active adapter's date object (e.g. a Moment),
   * a Date, epoch millis, or an ISO string.
   */
  private toDateTime(value: any): DateTime {
    if (DateTime.isDateTime(value)) {
      return value;
    }
    if (this.adapter.isDateInstance(value)) {
      return DateTime.fromMillis(value.valueOf());
    }
    if (value instanceof Date) {
      return DateTime.fromJSDate(value);
    }
    if (typeof value === 'number') {
      return DateTime.fromMillis(value);
    }
    return DateTime.fromISO(value);
  }

  startEdition(data: any) {
    super.startEdition(data);
    const cellDataDate = this.getCellDataDate();
    this.formControlDate.setValue(cellDataDate);

    const cellDataHour = this.getCellDataHour();
    this.formControlHour.setValue(cellDataHour);
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

  public set oDateLocale(value: string) {
    this._oDateLocale = value;
    if (Util.isDefined(this._oDateLocale)) {
      this.adapter.setLocale(value);
    }
  }

  get minDate(): Date {
    return new Date(this.oMinDate);
  }

  get maxDate(): Date {
    return new Date(this.oMaxDate);
  }

  onDatepickerClosed() {
    this.dateInput?.nativeElement.focus();
  }


  commitEdition() {
    if (!this.formGroup.invalid) {
      super.commitEdition();
    }
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!Codes.isHourInputAllowed(e)) {
      e.preventDefault();
    }
  }

}
