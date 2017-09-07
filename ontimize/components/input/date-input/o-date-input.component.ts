import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  ViewChild,
  OnInit,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  MdInput
} from '@angular/material';

import { ValidatorFn } from '@angular/forms/src/directives/validators';

import { OFormComponent } from '../../form/o-form.component';
import {
  OTextInputModule,
  OTextInputComponent,
  DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT
} from '../text-input/o-text-input.component';

import { OFormValue } from '../../form/OFormValue';
import { MomentService } from '../../../services';
import { OSharedModule } from '../../../shared';
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

const CUSTOM_DATEPICKER_HEADER = `
  <div class="ui-datepicker-custom-header">
    <div class="ui-datepicker-custom-title" fxLayout="row">
      <span class="ui-datepicker-custom-year"></span>
    </div>
    <div class="ui-datepicker-custom-text" fxLayout="row">
      <span class="ui-datepicker-custom-day"></span>&nbsp;
      <span class="ui-datepicker-custom-dayNumber"></span>&nbsp;
      <span class="ui-datepicker-custom-month"></span>
    </div>
  </div>
`;

//TODO translate button text
const CUSTOM_DATEPICKER_BUTTONS = `
  <div class="ui-datepicker-custom-buttonpane" fxLayout="row" fxLayoutAlign="end">
    <button class="mat-button mat-primary" data-event="click" data-handler-custom="cancel">CANCELAR</button>
    <button class="mat-button mat-primary" data-event="click" data-handler-custom="accept">ACEPTAR</button>
  </div>
`;

@Component({
  selector: 'o-date-input',
  templateUrl: './o-date-input.component.html',
  styleUrls: ['./o-date-input.component.scss'],
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

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this.momentSrv = this.injector.get(MomentService);
    this._defaultSQLTypeKey = 'DATE';
    this.defaultValue = '';
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
    this.inputHtmlEl = ($(this.elRef.nativeElement) as any).find('input.o-date-input');
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    //  Inject date validator
    //TODO validators.push(OValidators.dateValidator);
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
    let datepickerObj = ($['datepicker'] as any);
    if (!$['datepicker'] || datepickerObj.hasOwnProperty('_generateHTML_old')) {
      return;
    }

    datepickerObj._generateHTML_old = datepickerObj._generateHTML;

    datepickerObj._generateHTML = function (inst) {
      let html = '';
      html += CUSTOM_DATEPICKER_HEADER;

      html += '<div class="ui-datepicker-custom-body-container">';

      html += this._generateHTML_old(inst);

      html += CUSTOM_DATEPICKER_BUTTONS;

      html += '</div>';

      let $html = $(html);

      let datepickerPrev = $html['find']('.ui-datepicker-prev');
      datepickerPrev.attr('fxLayout', 'row').attr('fxLayoutAlign', 'center center').children().remove();
      datepickerPrev.html('<i class="material-icons">keyboard_arrow_left</i>');

      let datepickerNext = $html['find']('.ui-datepicker-next');
      datepickerNext.attr('fxLayout', 'row').attr('fxLayoutAlign', 'center center').children().remove();
      datepickerNext.html('<i class="material-icons">keyboard_arrow_right</i>');

      return $html;
    };
  }

  extendAttachHandlers() {
    let datepickerObj = ($['datepicker'] as any);
    if (!$['datepicker'] || datepickerObj.hasOwnProperty('_attachHandlers_old')) {
      return;
    }

    datepickerObj._attachHandlers_old = datepickerObj._attachHandlers;

    datepickerObj._attachHandlers = function (inst) {
      this._attachHandlers_old(inst);

      inst.dpDiv.find('[data-handler-custom]').map(function () {
        var handler = {
          cancel: function () {
            let onCancelCallback = datepickerObj._get(inst, 'onCustomCancel');
            if (onCancelCallback) {
              onCancelCallback.apply((inst.input ? inst.input[0] : null), [inst]);
            }
            datepickerObj._hideDatepicker();
          },
          accept: function () {
            let onAcceptCallback = datepickerObj._get(inst, 'onCustomAccept');
            if (onAcceptCallback) {
              onAcceptCallback.apply((inst.input ? inst.input[0] : null), [inst]);
            }
            datepickerObj._hideDatepicker();
          }
        };
        ($(this) as any).on(this.getAttribute('data-event'), handler[this.getAttribute('data-handler-custom')]);
      });
    };
  }

  extendUpdateDatepicker() {
    let datepickerObj = ($['datepicker'] as any);
    if (!$['datepicker'] || datepickerObj.hasOwnProperty('_updateDatepicker_old')) {
      return;
    }

    datepickerObj._updateDatepicker_old = datepickerObj._updateDatepicker;

    datepickerObj._updateDatepicker = function (inst) {
      this._updateDatepicker_old(inst);

      let customAfterUpdate = datepickerObj._get(inst, 'customAfterUpdate');
      if (customAfterUpdate) {
        let input = (inst.input ? inst.input[0] : null);
        customAfterUpdate.apply(input, [input, inst]);
      }
    };
  }

  overwriteDoKeyUp() {
    let datepickerObj = ($['datepicker'] as any);
    if (!$['datepicker'] || datepickerObj._doKeyUp_overwrited === true) {
      return;
    }
    datepickerObj._doKeyUp_overwrited = true;

    datepickerObj._doKeyUp = function (event) {
      var date, inst = datepickerObj._getInst(event.target);
      if (inst.input.val() !== inst.lastVal) {
        try {
          let datepickerFormat = datepickerObj._get(inst, 'dateFormat');
          let input = (inst.input ? inst.input.val() : null);
          let formatConfig = datepickerObj._getFormatConfig(inst);
          date = datepickerObj.parseDate(datepickerFormat, input, formatConfig);
          if (date) {
            // only if valid
            datepickerObj._setDateFromField(inst);
            datepickerObj._updateAlternate(inst);
            datepickerObj._updateDatepicker(inst);
          }
        } catch (err) {
          // extended code
          date = undefined;
        }
      }
      let customAfterDoKeyUp = datepickerObj._get(inst, 'customAfterDoKeyUp');
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
    if (!this.inputHtmlEl.datepicker) {
      console.error('datepicker not available');
      return;
    }
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

        self.inputModel.value = momentVal.valueOf().toString();
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
        var parsedMomentArg = parseInt(momentArg);
        var momentVal = isNaN(parsedMomentArg) ? moment() : moment(parsedMomentArg);
        self.updateDatepickerHeader(momentVal, inst.dpDiv);
      }
    });
  }

  onDisplayInputFocus(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
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

      this._fControl.markAsTouched();
      this.onBlur.emit(event);
    }
  }

  onInputClick() {
    if (this.isDisabled) {
      return;
    }
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
    /*
    * Temporary code
    * I do not understand the reason why MdInput is not removing 'mat-empty' clase despite of the fact that
    * the input element of the description is binding value attribute
    */
    let placeHolderLbl = this.elRef.nativeElement.querySelectorAll('label.mat-input-placeholder');
    if (placeHolderLbl.length) {
      // Take only first, nested element does not matter.
      let element = placeHolderLbl[0];
      if (descTxt && descTxt.length > 0) {
        element.classList.remove('mat-empty');
      }
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
    return undefined;
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
  imports: [
    OTextInputModule,
    OSharedModule,
    CommonModule
  ],
  exports: [
    ODateInputComponent,
    OTextInputModule
  ],
})
export class ODateInputModule {
}
