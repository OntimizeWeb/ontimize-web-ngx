import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { InputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import { IFormValueOptions } from '../../form/OFormValue';
import { OFormDataComponent, OValueChangeEvent } from '../../o-form-data-component.class';
import { DEFAULT_INPUTS_O_DATE_INPUT } from '../date-input/o-date-input.component';
import { DEFAULT_OUTPUTS_O_TEXT_INPUT } from '../text-input/o-text-input.component';
import { ODaterangepickerDirective } from './o-daterange-input.directive';
import { DaterangepickerComponent } from './o-daterange-picker.component';



export const DEFAULT_OUTPUTS_O_DATERANGE_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

export const DEFAULT_INPUTS_O_DATERANGE_INPUT = [
  'separator',
  'showWeekNumbers:show-week-numbers',
  'showRanges:show-ranges',
  'olocale:locale',
  ...DEFAULT_INPUTS_O_DATE_INPUT
];


const moment = _moment;
@Component({
  moduleId: module.id,
  selector: 'o-daterange-input',
  templateUrl: './o-daterange-input.component.html',
  styles: ['./o-daterange-input.component.scss'],
  outputs: DEFAULT_OUTPUTS_O_DATERANGE_INPUT,
  inputs: DEFAULT_INPUTS_O_DATERANGE_INPUT
})
export class ODateRangeInputComponent extends OFormDataComponent implements OnDestroy, OnInit {

  @ViewChild(ODaterangepickerDirective) pickerDirective: ODaterangepickerDirective;
  picker: DaterangepickerComponent;


  @InputConverter()
  public showWeekNumbers: boolean = false;

  @InputConverter()
  public oTouchUi: boolean = false;

  @InputConverter()
  public showRanges: boolean = false;

  protected _oMinDate: _moment.Moment;
  protected olocale: string;

  get oMinDate() {
    return this._oMinDate;
  }
  set oMinDate(value) {
    this._oMinDate = value;
  }

  protected _oMaxDate: _moment.Moment;
  get oMaxDate() {
    return this._oMaxDate;
  }
  set oMaxDate(value) {
    this._oMaxDate = value;
  }
  protected oformat: string = 'L';
  private momentSrv: MomentService;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);

  }

  ngOnInit() {
    super.ngOnInit();
    if (this.oMinDate) {
      const momentD = moment(this.oMinDate, this.oformat);
      if (momentD.isValid()) {
        this._oMinDate = momentD;
      }
    }

    if (this.oMaxDate) {
      const momentD = moment(this.oMaxDate, this.oformat);
      if (momentD.isValid()) {
        this._oMaxDate = momentD;
      }
    }
    if (!this.olocale) {
      this.olocale = this.momentSrv.getLocale();
    }
  }

  public openPicker() {
    this.pickerDirective.open();
  }

  rangeClicked(range) {
    // this.setValue(range, {
    //   changeType: OValueChangeEvent.USER_CHANGE,
    //   emitEvent: false,
    //   emitModelToViewChange: false
    // })
    // console.log('[rangeClicked] range is : ', range);
  }

  public onChangeEvent(event: Event): void {
    console.log('evnet');
    //todo validar
  }

  datesUpdated(range) {
    console.log('[datesUpdated] range is : ', range);
    this.pickerDirective.close();
    this.setValue(range,
      {
        changeType: OValueChangeEvent.USER_CHANGE,
        emitEvent: false,
        emitModelToViewChange: false
      });
  }

  setValue(newValue: any, options?: IFormValueOptions) {
    super.setValue(newValue, options);
  }

  public setData(newValue: any): void {
    super.setData(newValue);
    this.pickerDirective.datesUpdated.emit(newValue);
    this.updateElement();
  }

  updateElement() {

    let chosenLabel = this.value.value[this.pickerDirective.startKey].format(this.pickerDirective.locale.format) +
      this.pickerDirective.locale.separator + this.value.value[this.pickerDirective.endKey].format(this.pickerDirective.locale.format);
    this.pickerDirective._el.nativeElement.value = chosenLabel
  }


}

@NgModule({
  declarations: [DaterangepickerComponent, ODateRangeInputComponent, ODaterangepickerDirective],
  imports: [CommonModule, OSharedModule],
  exports: [ODateRangeInputComponent],
  entryComponents: [
    DaterangepickerComponent
  ],
  providers: []
})
export class ODateRangeInputModule { }
