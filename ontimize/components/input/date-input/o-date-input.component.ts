import {Component, Inject, Injector, forwardRef, ElementRef, ViewChild, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {MdInput} from '@angular/material';

import {ValidatorFn } from '@angular/forms/src/directives/validators';

import {OFormComponent} from '../../form/o-form.component';
import {OTextInputModule, OTextInputComponent, DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT} from '../text-input/o-text-input.component';

import {OFormValue} from '../../form/OFormValue';
import {SQLTypes} from '../../../util/sqltypes';
import {MomentService} from '../../../services';
import * as moment from 'moment';

import './o-date-input.loader';

export const DEFAULT_INPUTS_O_DATE_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'oformat: format',
  'olocale: locale'
];

export const DEFAULT_OUTPUTS_O_DATE_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];


@Component({
  selector: 'o-date-input',
  templateUrl: '/input/date-input/o-date-input.component.html',
  styleUrls: ['/input/date-input/o-date-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_DATE_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_DATE_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})

export class ODateInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_DATE_INPUT = DEFAULT_INPUTS_O_DATE_INPUT;
  public static DEFAULT_OUTPUTS_O_DATE_INPUT = DEFAULT_OUTPUTS_O_DATE_INPUT;

  oformat: string;
  olocale: string;
  opickerattr: string;

  @ViewChild('inputModel')
  protected inputModel: MdInput;

  @ViewChild('displayInputModel')
  protected displayInputModel: MdInput;

  protected inputHtmlEl: any;
  protected datepicker: any;
  protected datepickerLabels: any;

  private momentSrv: MomentService;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
    this.momentSrv = this.injector.get(MomentService);
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.olocale) {
      this.olocale = this.momentSrv.getLocale();
    }

    if (!this.oformat && typeof this.olocale === 'string') {
      this.oformat = moment.localeData(this.olocale)['_longDateFormat']['L'];
    }

    this.datepickerLabels = this.getDatePickerNames();
    this.extendGenerateHTML();
    this.extendAttachHandlers();
    this.extendUpdateDatepicker();
    this.overwriteDoKeyUp();

    this.opickerattr = this.oattr + '_datepicker_input';
  }

  ngAfterViewInit() {
    this.inputHtmlEl = ($(this.elRef.nativeElement) as any).find('.md-input input');
  }

  getSQLType(): number {
    let sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : 'DATE';
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    //  Inject date validator
    //validators.push(OValidators.dateValidator);
    return validators;
  }

  getDatePickerNames() {
    var localeData = moment.localeData(this.olocale);
    return {
      days: localeData['_weekdays'],
      daysShort: localeData['_weekdaysShort'],
      daysMin: localeData['_weekdaysShort'].map(function (d) {
        return d.substr(0, 1);
      }),
      months: localeData['_months'],
      monthsMin: localeData['_months'].map(function (m) {
        return m.substr(0, 3);
      })
    };
  }

  extendGenerateHTML() {
    if ($['datepicker']._generateHTML_old !== undefined) {
      return;
    }

    $['datepicker']._generateHTML_old = $['datepicker']._generateHTML;

    $['datepicker']._generateHTML = function (inst) {
      let html = '';
      html += '<div class="ui-datepicker-custom-header">';
      html += '<div class="ui-datepicker-custom-title" layout="row">';
      html += '<span class="ui-datepicker-custom-year"></span>';
      html += '</div>';
      html += '<div class="ui-datepicker-custom-text" layout="row">';
      html += '<span class="ui-datepicker-custom-day"></span>&nbsp;';
      html += '<span class="ui-datepicker-custom-dayNumber"></span>&nbsp;';
      html += '<span class="ui-datepicker-custom-month"></span>';
      html += '</div>';
      html += '</div>';

      html += this._generateHTML_old(inst);

      html += '<div class="ui-datepicker-custom-buttonpane" layout="row" layout-align="end">';
      html += '<button md-button class="md-primary" data-event="click" data-handler-custom="cancel">CANCELAR</button>';//TODO translate button text
      html += '<button md-button class="md-primary" data-event="click" data-handler-custom="accept">ACEPTAR</button>';
      html += '</div>';

      let $html = $(html);

      let datepickerPrev = $html['find']('.ui-datepicker-prev');
      datepickerPrev.attr('layout', 'row').attr('layout-align', 'center center').children().remove();
      datepickerPrev.html('<i class="material-icons">keyboard_arrow_left</i>');

      let datepickerNext = $html['find']('.ui-datepicker-next');
      datepickerNext.attr('layout', 'row').attr('layout-align', 'center center').children().remove();
      datepickerNext.html('<i class="material-icons">keyboard_arrow_right</i>');

      return $html;
    };
  }

  extendAttachHandlers() {
    if ($['datepicker']._attachHandlers_old !== undefined) {
      return;
    }

    $['datepicker']._attachHandlers_old = $['datepicker']._attachHandlers;

    $['datepicker']._attachHandlers = function (inst) {
      this._attachHandlers_old(inst);

      inst.dpDiv.find('[data-handler-custom]').map(function () {
        var handler = {
          cancel: function () {
            let onCancelCallback = $['datepicker']._get(inst, 'onCustomCancel');
            if (onCancelCallback) {
              onCancelCallback.apply((inst.input ? inst.input[0] : null), [inst]);
            }
            $['datepicker']._hideDatepicker();
          },
          accept: function () {
            let onAcceptCallback = $['datepicker']._get(inst, 'onCustomAccept');
            if (onAcceptCallback) {
              onAcceptCallback.apply((inst.input ? inst.input[0] : null), [inst]);
            }
            $['datepicker']._hideDatepicker();
          }
        };
        ($(this) as any).on(this.getAttribute('data-event'), handler[this.getAttribute('data-handler-custom')]);
      });
    };
  }

  extendUpdateDatepicker() {
    if ($['datepicker']._updateDatepicker_old !== undefined) {
      return;
    }

    $['datepicker']._updateDatepicker_old = $['datepicker']._updateDatepicker;

    $['datepicker']._updateDatepicker = function (inst) {
      this._updateDatepicker_old(inst);

      let customAfterUpdate = $['datepicker']._get(inst, 'customAfterUpdate');
      if (customAfterUpdate) {
        let input = (inst.input ? inst.input[0] : null);
        customAfterUpdate.apply(input, [input, inst]);
      }
    };
  }

  overwriteDoKeyUp() {
    if ($['datepicker']._doKeyUp_overwrited === true) {
      return;
    }
    $['datepicker']._doKeyUp_overwrited = true;

    $['datepicker']._doKeyUp = function (event) {
      var date, inst = $['datepicker']._getInst(event.target);
      if (inst.input.val() !== inst.lastVal) {
        try {
          let datepickerFormat = $['datepicker']._get(inst, 'dateFormat');
          let input = (inst.input ? inst.input.val() : null);
          let formatConfig = $['datepicker']._getFormatConfig(inst);
          date = $['datepicker'].parseDate(datepickerFormat, input, formatConfig);
          if (date) {
            // only if valid
            $['datepicker']._setDateFromField(inst);
            $['datepicker']._updateAlternate(inst);
            $['datepicker']._updateDatepicker(inst);
          }
        } catch (err) {
          // extended code
          date = undefined;
        }
      }
      let customAfterDoKeyUp = $['datepicker']._get(inst, 'customAfterDoKeyUp');
      if (customAfterDoKeyUp) {
        let input = (inst.input ? inst.input[0] : null);
        customAfterDoKeyUp.apply(input, [input, inst, date]);
      }
      return true;
    };
  }

  updateDatepickerHeader(dateMoment: any, datepickerContainer: any) {
    var yearText = ' ';
    var dayText = ' ';
    var dayNumberText = ' ';
    var monthText = ' ';
    if (dateMoment && dateMoment.isValid()) {
      yearText = dateMoment.year();
      dayText = this.datepickerLabels.daysShort[dateMoment.day()] + ', ';
      dayNumberText = dateMoment.date();
      monthText = this.datepickerLabels.monthsMin[dateMoment.month()] + '.';
    }
    datepickerContainer.find('.ui-datepicker-custom-year').text(yearText);
    datepickerContainer.find('.ui-datepicker-custom-day').text(dayText);
    datepickerContainer.find('.ui-datepicker-custom-dayNumber').text(dayNumberText);
    datepickerContainer.find('.ui-datepicker-custom-month').text(monthText);
  }

  initializeDatepicker() {
    var self = this;

    this.inputHtmlEl.removeClass('hasDatepicker');

    this.datepicker = this.inputHtmlEl.datepicker({
      dateFormat: this.oformat.toLowerCase().replace(/yyyy/g, 'yy'),
      showAnim: 'slideDown',
      dayNames: this.datepickerLabels.days,
      dayNamesMin: this.datepickerLabels.daysMin,
      dayNamesShort: this.datepickerLabels.daysShort,
      monthNames: this.datepickerLabels.months,
      monthNamesShort: this.datepickerLabels.monthsMin,
      firstDay: 1,
      showOtherMonths: true,
      selectOtherMonths: true,
      showButtonPanel: true,
      autoClose: false,

      // onCustomAccept: function(inst) {
      // },
      // onCustomCancel: function(inst) {
      // },
      // beforeShow: function(input, inst) {
      // },

      onSelect: function (dateText, inst) {
        ($(this) as any).data('datepicker').inline = true;

        var momentVal = moment(dateText, self.oformat);
        self.updateDatepickerHeader(momentVal, inst.dpDiv);

        self.inputModel.value = momentVal.valueOf();
        var control = self.form.formGroup.controls[self.oattr];
        if (control) {
          control.markAsDirty();
        }
      },

      onClose: function (dateText, inst) {
        ($(this) as any).data('datepicker').inline = false;
      },

      customAfterDoKeyUp: function (input, inst, date) {
        let datepickerTimestamp = date ? date.getTime() : undefined;
        if (datepickerTimestamp && !isNaN(datepickerTimestamp)) {
          var momentVal = moment(datepickerTimestamp);
          self.updateDatepickerHeader(momentVal, inst.dpDiv);
        }
      },

      customAfterUpdate: function (input, inst) {
        var momentArg = undefined;
        if (self.inputModel.value) {
          momentArg = self.inputModel.value;
        } else {
          let datepickerDate = inst.input.datepicker('getDate');
          let datepickerTimestamp = datepickerDate ? datepickerDate.getTime() : undefined;
          if (!isNaN(datepickerTimestamp)) {
            momentArg = datepickerTimestamp;
          }
        }
        var momentVal = moment(momentArg);
        self.updateDatepickerHeader(momentVal, inst.dpDiv);
      }
    });
  }

  onDisplayInputBlur() {
    if (!this.isReadOnly && !this.isDisabled) {
      let datepickerDate = this.inputHtmlEl.datepicker('getDate');
      let newTimestamp = undefined;
      let newDisplayValue = undefined;
      let datepickerTimestamp = datepickerDate ? datepickerDate.getTime() : undefined;
      if (datepickerTimestamp && !isNaN(datepickerTimestamp)) {
        newTimestamp = datepickerTimestamp;
        newDisplayValue = this.parseTimestamp(datepickerTimestamp);
      }
      this.setValue(newTimestamp);
      this.displayInputModel.value = newDisplayValue;
    }
  }

  onInputClick() {
    let isDatepickerInitialized = ($.hasOwnProperty('datepicker') && this.inputHtmlEl.hasClass('hasDatepicker'));
    if (!this.isReadOnly && !this.isDisabled && !isDatepickerInitialized) {
      this.initializeDatepicker();
    }
    this.inputHtmlEl.focus();
  }

  onClickIcon(e: Event): void {
    e.stopPropagation();
    this.onInputClick();
  }

  getDescriptionValue(): any {
    let descTxt = '';
    let timestampValue: any;
    if (this.value instanceof OFormValue) {
      if (this.value.value) {
        timestampValue = this.value.value;
      }
    }
    if (timestampValue) {
      descTxt = this.parseTimestamp(timestampValue);
    }
    return descTxt;
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
    return '';
  }

  setValue(val: any) {
    var self = this;
    window.setTimeout(() => {
      self.inputModel.value = val;
      self.ensureOFormValue(val);
    }, 0);
  }

  parseTimestamp(val: any) {
    var m: any;
    if (typeof val === 'string' && val.toLowerCase() === 'now') {
      m = moment();
    } else if (!isNaN(parseFloat(val))) {
      m = moment(parseInt(val));
    } else {
      m = moment(val, this.oformat);
    }
    return m.format(this.oformat);
  }
}

@NgModule({
  declarations: [ODateInputComponent],
  imports: [OTextInputModule],
  exports: [ODateInputComponent, OTextInputModule],
})
export class ODateInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ODateInputModule,
      providers: []
    };
  }
}
