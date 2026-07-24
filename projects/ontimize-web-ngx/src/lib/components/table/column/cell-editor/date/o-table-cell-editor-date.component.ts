import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { OMatErrorDirective } from '../../../../../directives/o-mat-error.directive';

import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { LuxonService } from '../../../../../services/luxon.service';
import { O_DATE_ADAPTER_PROVIDERS } from '../../../../../shared/material/date/o-date-adapter.provider';
import { DateFilterFunction } from '../../../../../types/date-filter-function.type';
import { ODateValueType } from '../../../../../types/o-date-value.type';
import { Util } from '../../../../../util/util';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE = [
  'format',
  'locale',
  'oStartView: start-view',
  'min',
  'max',
  'oTouchUi: touch-ui',
  'startAt: start-at',
  'filterDate: filter-date',
  // value-type [timestamp|string]: type must be defined to be able to save its value,
  // e.g. classic ontimize server dates come as timestamps (number), but to be able to save them they have to be send as strings with
  // the format 'YYYY-MM-DD HH:mm:ss'Default: timestamp.
  'dateValueType: date-value-type'
];


@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatTooltipModule, OTranslatePipe, OMatErrorDirective],
  selector: 'o-table-cell-editor-date',
  templateUrl: './o-table-cell-editor-date.component.html',
  styleUrls: ['./o-table-cell-editor-date.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ...O_DATE_ADAPTER_PROVIDERS
  ]
})

export class OTableCellEditorDateComponent extends OBaseTableCellEditor implements OnInit {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  format: string;
  protected locale: string;
  oStartView: 'month' | 'year' = 'month';
  protected min: string;
  protected max: string;
  @BooleanInputConverter()
  oTouchUi: boolean = false;
  protected startAt: string;
  filterDate: DateFilterFunction;
  _dateValueType: ODateValueType = 'timestamp';

  oStartAt: Date;
  oMinDate: Date;
  oMaxDate: Date;

  private luxonSrv: LuxonService;
  minDateString: string;
  maxDateString: string;

  protected datepicker: MatDatepicker<Date>;
  constructor(
    protected injector: Injector,
    protected dateAdapter: DateAdapter<any>
  ) {
    super(injector);
    this.luxonSrv = this.injector.get(LuxonService);
    // Default format follows the active date engine ('D' for Luxon, 'L' for moment)
    const dateFormats: MatDateFormats | null = this.injector.get(MAT_DATE_FORMATS, null);
    this.format = dateFormats?.display?.dateInput ?? 'D';
  }

  initialize(): void {
    super.initialize();
    if (!this.locale) {
      this.locale = this.luxonSrv.getLocale();
    }
    if (this.format) {
      (this.dateAdapter as any).oFormat = this.format;
    }

    this.dateAdapter.setLocale(this.locale);
    if (this.startAt) {
      this.oStartAt = new Date(this.startAt);
    }

    if (this.min) {
      const date = new Date(this.min);
      const d = this.dateAdapter.deserialize(date);
      if (Util.isDefined(d) && this.dateAdapter.isValid(d)) {
        this.oMinDate = date;
        this.minDateString = this.dateAdapter.format(d, this.format);
      }
    }

    if (this.max) {
      const date = new Date(this.max);
      const d = this.dateAdapter.deserialize(date);
      if (Util.isDefined(d) && this.dateAdapter.isValid(d)) {
        this.oMaxDate = date;
        this.maxDateString = this.dateAdapter.format(d, this.format);
      }
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

  startEdition(data: any) {
    super.startEdition(data);
    if (!this.startAt) {
      this.oStartAt = this.getCellData();
    }
  }

  getCellData(): any {
    const value = super.getCellData();
    if (Util.isDefined(value)) {
      let result = value;
      let date: any;
      switch (this.dateValueType) {
        case 'string':
          date = this.dateAdapter.parse(value, this.format);
          break;
        case 'date':
          break;
        case 'iso-8601':
        case 'timestamp':
        default:
          date = this.toDateObject(value);
          break;
      }
      if (Util.isDefined(date)) {
        result = new Date(date.valueOf());
      }
      return result;
    }
    return value;
  }

  commitEdition() {
    // !this.datepicker.opened &&
    if (!this.formControl.invalid) {
      this.oldValue = this._rowData[this.tableColumnAttr];
      this._rowData[this.tableColumnAttr] = this.getValueByValyType();
      if (!this.isSilentControl()) {
        this.endEdition(true);
        this.editionCommitted.emit(this._rowData);
      }
    }
  }

  protected getValueByValyType(): any {
    let result = this.formControl.value;
    const date = this.toDateObject(this.formControl.value);
    switch (this.dateValueType) {
      case 'string':
        result = this.dateAdapter.format(date, this.format);
        break;
      case 'date':
        result = new Date(result);
        break;
      case 'iso-8601':
        // UTC so the output carries the 'Z' suffix, as moment's toISOString() did
        result = new Date(date.valueOf()).toISOString();
        break;
      case 'timestamp':
      default:
        result = date.valueOf();
        break;
    }
    return result;
  }

  onDateChange(event: MatDatepickerInputEvent<any>) {
    const isValid = Util.isDefined(event.value) && this.dateAdapter.isValid(event.value);
    let val = isValid ? event.value.valueOf() : event.value;
    const date = this.toDateObject(val);
    switch (this.dateValueType) {
      case 'string':
        if (val) {
          val = this.dateAdapter.format(date, this.format);
        }
        break;
      case 'date':
        val = new Date(val);
        break;
      case 'iso-8601':
        val = new Date(date.valueOf()).toISOString();
        break;
      case 'timestamp':
      default:
        break;
    }

    this.formControl.setValue(val, {
      emitModelToViewChange: false,
      emitEvent: false
    });
  }

  /** Mirrors moment(value)'s generic dispatch: accepts an adapter date object, Date, epoch millis, or ISO string. */
  private toDateObject(value: any): any {
    if (this.dateAdapter.isDateInstance(value)) {
      return value;
    }
    if (value instanceof Date) {
      return this.dateAdapter.deserialize(value);
    }
    if (typeof value === 'number') {
      return this.dateAdapter.deserialize(new Date(value));
    }
    return this.dateAdapter.deserialize(value);
  }

  openDatepicker(d: MatDatepicker<Date>) {
    this.datepicker = d;
    d.open();
  }

  set dateValueType(val: any) {
    this._dateValueType = Util.convertToODateValueType(val);
  }

  get dateValueType(): any {
    return this._dateValueType;
  }

  onClosed() {
    if (this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }
}
