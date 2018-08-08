import { Component, NgModule, Optional, Inject, ElementRef, Injector, forwardRef, ViewChild, EventEmitter, ViewEncapsulation, HostListener, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
import { OSharedModule } from '../../../shared';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/form-components';
import { OFormValue } from '../../form/OFormValue';

export const DEFAULT_INPUTS_O_HOUR_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_HOUR_INPUT = [
  'onChange',
  'onFocus',
  'onBlur'
];

@Component({
  selector: 'o-hour-input',
  templateUrl: './o-hour-input.component.html',
  styleUrls: ['./o-hour-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  outputs: DEFAULT_OUTPUTS_O_HOUR_INPUT,
  inputs: DEFAULT_INPUTS_O_HOUR_INPUT,
  host: {
    '[class.o-hour-input]': 'true'
  }
})

export class OHourInputComponent extends OFormDataComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_HOUR_INPUT = DEFAULT_INPUTS_O_HOUR_INPUT;
  public static DEFAULT_OUTPUTS_O_HOUR_INPUT = DEFAULT_OUTPUTS_O_HOUR_INPUT;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('picker')
  private picker: any;

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setData(value: any) {
    super.setData(value);
  }

  onMouseDown(event) {
    console.log(this.getAttribute());
    console.log(this.getValueAsTimeStamp());
    if (this.isDisabled || this.isReadOnly) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onKeyDown(event) {
    console.log(event);
    if (this.isDisabled || this.isReadOnly) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onOpen($event) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.picker.open();
    }
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  getValueAsTimeStamp() {
    return moment('01/01/1970 ' + this.getValue(), 'MM/DD/YYYY hh:mm A').unix();
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    validators.push(OValidators.hourValidator);
    return validators;
  }
}

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule.forRoot()],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
