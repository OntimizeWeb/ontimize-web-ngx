import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, NgZone, OnDestroy, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import moment from 'moment';
import { NgxMaterialTimepickerModule, NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OHourTimepickerDirective } from './o-hour-input.directive';

import { BooleanInputConverter, NumberConverter } from '../../../decorators/input-converter';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OValidators } from '../../../validators/o-validators';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFormControl } from '../o-form-control.class';
import { Subject, Subscription, take, takeUntil } from 'rxjs';

export type OHourValueType = 'string' | 'timestamp';

export const DEFAULT_INPUTS_O_HOUR_INPUT = [
  'format',
  'textInputEnabled: text-input-enabled',
  'min',
  'max',
  'valueType: value-type'
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule, FlexLayoutModule, NgxMaterialTimepickerModule, OTranslatePipe, OMatErrorDirective, OHourTimepickerDirective],
  selector: 'o-hour-input',
  templateUrl: './o-hour-input.component.html',
  styleUrls: ['./o-hour-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  inputs: DEFAULT_INPUTS_O_HOUR_INPUT,
  host: {
    '[class.o-hour-input]': 'true'
  }
})
export class OHourInputComponent extends OFormDataComponent implements OnInit, AfterViewInit, OnDestroy {

  @BooleanInputConverter()
  public textInputEnabled: boolean = true;
  public min: string;
  public max: string;
  protected _format: number = Codes.TWENTY_FOUR_HOUR_FORMAT;
  protected onKeyboardInputDone = false;
  protected _valueType: OHourValueType = 'timestamp';

  @ViewChild('picker')
  public picker: NgxMaterialTimepickerComponent;

  private pickerClosedSub?: Subscription;
  private readonly destroy$ = new Subject<void>();
  private skipNextBlur = false;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'TIMESTAMP';
  }

  initialize(): void {
    super.initialize();
    const formControl = this.getFormControl() as OFormControl;
    if (formControl) {
      const self = this;
      formControl.getValue = function () {
        return self.getValue();
      };
    }
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.modifyPickerMethods();
  }

  ngOnDestroy(): void {
    this.pickerClosedSub?.unsubscribe();
  }

  public onKeyDown(e: KeyboardEvent): void {
    if (!Codes.isHourInputAllowed(e)) {
      e.preventDefault();
    }
  }

  public innerOnBlur(event: any): void {
    // Skip this blur event if it happens right after the picker closes
    if (this.skipNextBlur) {
      this.skipNextBlur = false;
      return;
    }

    if (this.onKeyboardInputDone) {
      this.updateValeOnInputChange(event);
    }
    super.innerOnBlur(event);
  }

  public registerOnFormControlChange(): void {
    // This component does not need this subscription
  }

  get formatString(): string {
    return (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? Codes.HourFormat.TWENTY_FOUR : Codes.HourFormat.TWELVE);
  }

  public open(e?: Event): void {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    if (this.picker) {
      this.picker.open();
    }
  }

  setTime(event) {
    event.preventDefault();
    event.stopPropagation();
    // getting value from super so we can always get a string value
    const value = super.getValue();
    this.picker.updateTime(value);
  }

  public setTimestampValue(value: any, options?: FormValueOptions): void {
    let parsedValue;
    const momentV = Util.isDefined(value) ? moment(value) : value;
    if (momentV && momentV.isValid()) {
      parsedValue = momentV.utcOffset(0).format(this.formatString);
    }
    this.setValue(parsedValue, options);
  }

  public resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT) {
      validators.push(OValidators.twentyFourHourFormatValidator);
    } else {
      validators.push(OValidators.twelveHourFormatValidator);
    }
    return validators;
  }

  set format(val: number) {
    const old = this._format;
    let parsedVal = NumberConverter(val);
    if (parsedVal !== Codes.TWELVE_FOUR_HOUR_FORMAT && parsedVal !== Codes.TWENTY_FOUR_HOUR_FORMAT) {
      parsedVal = Codes.TWENTY_FOUR_HOUR_FORMAT;
    }
    this._format = parsedVal;
    if (parsedVal !== old) {
      this.updateValidators();
    }
  }

  get format(): number {
    return this._format;
  }

  set valueType(val: any) {
    this._valueType = this.convertToOHourValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  public convertToOHourValueType(val: any): OHourValueType {
    const result: OHourValueType = 'string';
    const lowerVal = (val || '').toLowerCase();
    if (lowerVal === 'string' || lowerVal === 'timestamp') {
      return lowerVal;
    }
    return result;
  }

  public onChangeEvent(arg: any): void {
    this.onTimepickerChange(arg.target.value);
  }

  public onTimepickerChange(event: string): void {
    let value: any = event;
    if (Util.isDefined(value) && this.valueType === 'timestamp') {
      const valueTimestamp = moment(value, this.formatString).valueOf();
      if (!isNaN(valueTimestamp)) {
        value = valueTimestamp;
      }
    }
    /** emitModelToViewChange: false  because onChange event is trigger in ngModelChange */
    this.setValue(value, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  protected modifyPickerMethods(): void {
    if (this.picker && this.picker.inputElement) {
      this.picker.inputElement.addEventListener('change', () => {
        this.onKeyboardInputDone = true;
      });
    }

    if (this.picker?.closed) {
      const zone = this.injector.get(NgZone);
      this.pickerClosedSub = this.picker.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // Wait until Angular finishes stabilizing the view
          zone.onStable
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe(() => {
              setTimeout(() => {
                // Prevent the immediate blur event from removing focus
                this.skipNextBlur = true;

                const input: HTMLInputElement = this.elRef.nativeElement.querySelector('input');

                // Focus the input only if it is available, not readonly, and enabled
                if (input && !this.isReadOnly && this.enabled !== false) {
                  input.focus();
                }
              }, 50); // small delay to ensure overlay is fully closed
            });
        });
    }
  }

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    let stringValue = val;
    if (Util.isDefined(val) && this.valueType === 'timestamp') {
      // because of the ngx-material-timepicker especification, its stored value must be always a string
      let value = val instanceof OFormValue ? val.value : val;
      stringValue = this.getValueAsString(value);
    }

    this.ensureOFormValue(val);
    if (!this._fControl) {
      // ensuring _fControl creation
      this._fControl = this.getControl();
    }
    if (this._fControl) {
      this.updateOFormControlValue(stringValue, options, setDirty);
    }
    this.oldValue = this.value.value;
  }

  protected updateValeOnInputChange(blurEvent: any): void {
    if (this.onKeyboardInputDone) {
      // ngx-material-timepicker does not allow writing characters on input, so we add 'AM/PM' in order to make validation work properly
      const value = this.parseHour(blurEvent.currentTarget.value);
      this.setValue(value);
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

    if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.format) {
      if (hour) {
        hour = parseInt(hour, 10);
        const period = hour <= 12 ? ' AM' : ' PM';
        if (hour > 12) {
          hour = hour - 12;
        }
        strArray[0] = hour;
        value = strArray.join(':') + period;
      }
    } else if (Codes.TWENTY_FOUR_HOUR_FORMAT === this.format) {
      // do nothing
    }
    return value;
  }

  protected emitOnValueChange(type, newValue, oldValue): void {
    this.onChange.emit(newValue);
    super.emitOnValueChange(type, newValue, oldValue);
  }

  protected getValueAsString(val: any): string {
    let value;
    if (typeof val === 'number') {
      value = moment(val).format(this.formatString);
    } else {
      value = this.convertToFormatString(val);
    }
    return value;
  }

  protected convertToFormatString(value): string {
    if (value === '00:00' || !Util.isDefined(value)) {
      return value;
    }
    const formatStr = this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
    let result;
    if (typeof value === 'number') {
      result = moment(value).format(formatStr);
    } else {
      result = value ? moment(value, 'h:mm A').format(formatStr) : value;
    }
    return result;
  }
}
