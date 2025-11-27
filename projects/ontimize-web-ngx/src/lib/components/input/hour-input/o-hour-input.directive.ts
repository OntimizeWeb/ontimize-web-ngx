import { Directive, Input } from '@angular/core';
import { NgxMaterialTimepickerComponent, TimepickerDirective } from 'ngx-material-timepicker';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[oNgxTimepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OHourTimepickerDirective,
      multi: true
    }
  ]
})
export class OHourTimepickerDirective extends TimepickerDirective {

  //register new input oNgxTimepicker instead of ngxTimepicker
  @Input('oNgxTimepicker')
  override set timepicker(picker: NgxMaterialTimepickerComponent) {
    super['registerTimepicker'](picker);
  }

  override updateValue(value: string) {
    // Custom previous formatted
    if (/^\d{3,4}$/.test(value)) {
      let hours = value.slice(0, -2).padStart(2, '0');
      let minutes = value.slice(-2);
      value = `${hours}:${minutes}`;
    }
    //Setting for 12 hour format
    const is12 = this.format === 12;
    if (is12 && !/(AM|PM)$/i.test(value)) {
      value += ' AM';
    }
    super.updateValue(value);
  }
}