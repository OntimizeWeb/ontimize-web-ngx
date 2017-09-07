import * as $ from 'jquery';
import { Component, OnInit, Inject, Injector, forwardRef, EventEmitter } from '@angular/core';
import { ObservableWrapper } from '../../../util/async';


import { OTableColumnComponent, ITableCellEditor } from '../o-table-column.component';
import { MomentService } from '../../../services';

import * as moment from 'moment';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE = [

  // date-model-type [timestamp|string]: if a date column is editable, its model type must be defined to be able to save its value,
  // e.g. classic ontimize server dates come as timestamps (number), but to be able to save them they have to be send as strings with
  // the format 'YYYY-MM-DD HH:mm:ss' (especified in the date-model-format attribute). Default: timestamp.
  'dateModelType: date-model-type',

  // date-model-format [string]: if date model type is string, its date model format should be defined. Default: ISO date.
  'dateModelFormat: date-model-format'

];

@Component({
  selector: 'o-table-cell-editor-date',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE
  ]
})
export class OTableCellEditorDateComponent implements OnInit, ITableCellEditor {

  public static DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE = DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE;

  public static DEFAULT_DATE_MODEL_TYPE = 'timestamp';
  public static DEFAULT_DATE_MODEL_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  public static datePicker: any = undefined; // static instance due to jQuery UI Plugin issues...
  public datePickerFormat: string;
  public datePickerLabels: any;

  public onFocus: EventEmitter<any> = new EventEmitter();
  public onBlur: EventEmitter<any> = new EventEmitter();
  public onSubmit: EventEmitter<any> = new EventEmitter();

  protected tableColumn: OTableColumnComponent;
  protected insertTableInput: any;
  protected momentService: MomentService;
  protected dateModelType: string;
  protected dateModelFormat: string;
  protected previousValue: any;
  protected rendererFormat: string;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    this.tableColumn = tableColumn;
    this.momentService = this.injector.get(MomentService);
    this.tableColumn.registerEditor(this);
    if (typeof (OTableCellEditorDateComponent.datePicker) !== 'undefined') {
      OTableCellEditorDateComponent.datePicker.datepicker('hide');
    }
    OTableCellEditorDateComponent.datePicker = undefined;
    this.datePickerFormat = moment.localeData(this.momentService.getLocale())['_longDateFormat']['L'];
    this.datePickerFormat = this.datePickerFormat.toLowerCase().replace(/yyyy/g, 'yy');
    this.datePickerLabels = this.getDatePickerLabels();
    this.extendDatePickerHTML();
    this.previousValue = undefined;
    this.rendererFormat = undefined;
  }

  public ngOnInit() {
    if (typeof (this.dateModelType) === 'undefined') {
      this.dateModelType = OTableCellEditorDateComponent.DEFAULT_DATE_MODEL_TYPE;
    }
    if (typeof (this.dateModelFormat) === 'undefined') {
      this.dateModelFormat = OTableCellEditorDateComponent.DEFAULT_DATE_MODEL_FORMAT;
    }
  }

  public init(parameters: any) {
    if (typeof (parameters) !== 'undefined') {
      if (typeof (parameters.dateModelType) !== 'undefined') {
        this.dateModelType = parameters.dateModelType;
      }
      if (typeof (parameters.dateModelFormat) !== 'undefined') {
        this.dateModelFormat = parameters.dateModelFormat;
      }
      if (typeof (parameters.rendererFormat) !== 'undefined') {
        this.rendererFormat = parameters.rendererFormat;
      }
    }
  }

  public getHtml(data: any): string {
    let html = '<input type="text" onclick="event.stopPropagation();" ondblclick="event.stopPropagation();" />';
    return html;
  }

  public handleCellFocus(cellElement: any, data: any) {
    this.previousValue = data;
    this.create(cellElement, data);
  }

  public handleCellBlur(cellElement: any) {
    // nothing to do here
  }

  public create(cellElement: any, data: any) {
    let input = cellElement.find('input');
    if (input.length === 0) {
      cellElement.addClass('editing');
      cellElement.html(this.getHtml(data));
      input = cellElement.find('input');
      input.width(input.width() - 24);
      OTableCellEditorDateComponent.datePicker = input.datepicker({
        dateFormat: this.datePickerFormat,
        showAnim: 'slideDown',
        dayNames: this.datePickerLabels.days,
        dayNamesMin: this.datePickerLabels.daysMin,
        dayNamesShort: this.datePickerLabels.daysShort,
        monthNames: this.datePickerLabels.months,
        monthNamesShort: this.datePickerLabels.monthsMin,
        firstDay: 1,
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: true,
        autoClose: true,
        onSelect: (dateText, inst) => {
          ObservableWrapper.callEmit(this.onSubmit, { editor: this });
          this.performInsertion(cellElement);
        },
        onClose: (dateText, inst) => {
          let input = cellElement.find('input');
          if (input.length > 0) {
            ObservableWrapper.callEmit(this.onBlur, { editor: this });
            cellElement.removeClass('editing');
            if (typeof (inst) !== 'undefined') {
              this.setFormattedDate(cellElement, (new Date(inst.currentYear, inst.currentMonth, inst.currentDay)).getTime());
            } else {
              input.remove();
            }
          }
        }
      });
      input.datepicker('setDate', new Date(data));
      input.bind('focus', (e) => {
        ObservableWrapper.callEmit(this.onFocus, { editor: this });
      });
      input.bind('keydown', (e) => {
        let code = e.keyCode || e.which;
        if (code === 13) {
          ObservableWrapper.callEmit(this.onSubmit, { editor: this });
          this.performInsertion(cellElement);
        }
      });
      input.focus();
      input.select();
    }
  }

  public destroy(cellElement: any) {
    let input = cellElement.find('input');
    if (input.length > 0) {
      cellElement.removeClass('editing');
      input.remove();
    }
  }

  public performInsertion(cellElement: any) {
    let input = cellElement.find('input');
    if (input.length > 0) {
      let newValue = undefined;
      let datePickerDate = input.datepicker('getDate');
      OTableCellEditorDateComponent.datePicker.datepicker('hide');
      OTableCellEditorDateComponent.datePicker = undefined;
      this.destroy(cellElement);
      if (datePickerDate) {
        switch (this.dateModelType) {
          case 'timestamp':
            newValue = datePickerDate.getTime();
            break;
          case 'string':
            if (typeof (this.dateModelFormat) !== 'undefined') {
              newValue = moment(datePickerDate).format(this.dateModelFormat);
            } else {
              newValue = datePickerDate.toISOString();
            }
            break;
        }
        // previous check due to different input/output formats
        if (datePickerDate.getTime() !== this.previousValue) {
          this.tableColumn.updateCell(cellElement, newValue);
        } else if (typeof (this.previousValue) !== 'undefined') {
          // removing input element
          this.setFormattedDate(cellElement, this.previousValue);
        }
      } else if (typeof (this.previousValue) !== 'undefined') {
        // removing input element
        this.setFormattedDate(cellElement, this.previousValue);
      }
      this.previousValue = undefined;
    }
  }

  public createEditorForInsertTable(cellElement: any, data: any) {
    cellElement.html(this.getHtml(data));
    this.insertTableInput = cellElement.find('input');
    OTableCellEditorDateComponent.datePicker = this.insertTableInput.datepicker({
      dateFormat: this.datePickerFormat,
      showAnim: 'slideDown',
      dayNames: this.datePickerLabels.days,
      dayNamesMin: this.datePickerLabels.daysMin,
      dayNamesShort: this.datePickerLabels.daysShort,
      monthNames: this.datePickerLabels.months,
      monthNamesShort: this.datePickerLabels.monthsMin,
      firstDay: 1,
      showOtherMonths: true,
      selectOtherMonths: true,
      showButtonPanel: true,
      autoClose: true,
      onSelect: (dateText, inst) => {
        ObservableWrapper.callEmit(this.onSubmit, { insertTable: true, editor: this });
        this.insertTableInput.datepicker('hide');
      },
      onClose: (dateText, inst) => {
        ObservableWrapper.callEmit(this.onBlur, { insertTable: true, editor: this });
      }
    });
    if (typeof (data) !== 'undefined') {
      this.insertTableInput.datepicker('setDate', new Date(data));
    }
    this.insertTableInput.bind('keydown', (e) => {
      let code = e.keyCode || e.which;
      if (code === 13 /*|| code === 9*/) {
        ObservableWrapper.callEmit(this.onSubmit, { insertTable: true, editor: this });
      }
    });
    this.insertTableInput.bind('focus', (e) => {
      ObservableWrapper.callEmit(this.onFocus, { insertTable: true, editor: this });
    });
    this.insertTableInput.bind('focusout', (e) => {
      ObservableWrapper.callEmit(this.onBlur, { insertTable: true, editor: this });
    });
  }

  public getInsertTableValue(): any {
    let value = undefined;
    if (typeof (this.insertTableInput) !== 'undefined') {
      let datePickerDate = this.insertTableInput.datepicker('getDate');
      if (datePickerDate) {
        switch (this.dateModelType) {
          case 'timestamp':
            value = datePickerDate.getTime();
            break;
          case 'string':
            if (typeof (this.dateModelFormat) !== 'undefined') {
              value = moment(datePickerDate).format(this.dateModelFormat);
            } else {
              value = datePickerDate.toISOString();
            }
            break;
        }
      }
    }
    return value;
  }

  protected setFormattedDate(cellElement, value) {
    if (typeof (this.rendererFormat) !== 'undefined') {
      cellElement.html(this.momentService.parseDate(value, this.rendererFormat));
    } else {
      cellElement.html(value);
    }
  }

  protected getDatePickerLabels() {
    let localeData = moment.localeData(this.momentService.getLocale());
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

  protected extendDatePickerHTML() {
    let datepickerObj = ($['datepicker'] as any);
    if (typeof (datepickerObj._generateHTML_old) === 'undefined') {
      datepickerObj._generateHTML_old = datepickerObj._generateHTML;
      datepickerObj._generateHTML = function (inst) {
        let $html = $(this._generateHTML_old(inst));
        let datepickerPrev = $html['find']('.ui-datepicker-prev');
        datepickerPrev.attr('fxLayout', 'row').attr('fxLayoutAlign', 'center center').children().remove();
        datepickerPrev.html('<i class="material-icons">keyboard_arrow_left</i>');
        let datepickerNext = $html['find']('.ui-datepicker-next');
        datepickerNext.attr('fxLayout', 'row').attr('fxLayoutAlign', 'center center').children().remove();
        datepickerNext.html('<i class="material-icons">keyboard_arrow_right</i>');
        return $html;
      };
    }
  }

}

