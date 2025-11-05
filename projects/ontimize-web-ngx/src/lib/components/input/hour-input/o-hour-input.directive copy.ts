import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { NgxMaterialTimepickerComponent, TimepickerDirective } from 'ngx-material-timepicker';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[oNgxTimepicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OHourTimepickerDirective,
      multi: true
    }
  ],
  // host: {
  //   '[disabled]': 'disabled',
  //   '(change)': 'updateValue($event.target.value)',
  //   '(blur)': 'onTouched()',
  // }
})
export class OHourTimepickerDirective extends TimepickerDirective {
  translateService: OTranslateService;
  // redefinimos el input para usar nuestro propio selector
  @Input('oNgxTimepicker')
  override set timepicker(picker: NgxMaterialTimepickerComponent) {
    super['registerTimepicker'](picker); // llamamos al método privado de la clase base
  }
  // // Reexponemos los inputs del padre para que Angular los detecte correctamente
  // @Input()
  // override set format(value: number) {
  //   // forzamos siempre 24h, pero respetamos si alguien la pasa por input
  //   super.format = value;

  // }

  // override get format(): number {
  //   return super.format;
  // }

  // @Input()
  // set value(value: string) {
  //   super.value = value;
  // }

  // get value(): string {
  //   return super.value;
  // }
  // @Input() override min!: string | DateTime;
  // @Input() override max!: string | DateTime;
  // @Input() override value!: string;

  // constructor(
  //   elementRef: ElementRef
  // ) {
  //   // llamamos al constructor de la clase base
  //   super(elementRef, 'en-US');
  // }

  // 👇 ejemplo: podrías validar o formatear diferente
  override updateValue(value: string) {
    // Formateo previo
    if (/^\d{3,4}$/.test(value)) {
      let hours = value.slice(0, -2).padStart(2, '0');
      let minutes = value.slice(-2);
      value = `${hours}:${minutes}`;
    }
    console.log('o-hour-input-directive antes', value)
    super.updateValue(value);
    console.log('o-hour-input-directive despues', value)
  }
}