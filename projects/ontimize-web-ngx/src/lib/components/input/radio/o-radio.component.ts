import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

import { OntimizeServiceProvider } from '../../../services/factories';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import {
  OFormServiceComponent
} from '../o-form-service-component.class';

export const DEFAULT_INPUTS_O_RADIO = [
  'layout',
  'labelPosition: label-position'
];


@Component({
  selector: 'o-radio',
  templateUrl: './o-radio.component.html',
  styleUrls: ['./o-radio.component.scss'],
  inputs: DEFAULT_INPUTS_O_RADIO,
  providers: [
    OntimizeServiceProvider
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-radio]': 'true'
  }
})
export class ORadioComponent extends OFormServiceComponent implements AfterViewInit {

  /* Inputs */
  public layout: 'row' | 'column' = 'column';
  public labelPosition: 'before' | 'after' = 'after';
  /* End inputs*/

  value: OFormValue;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.queryOnInit) {
      this.queryData();
    }
  }

  onMatRadioGroupChange(e: MatRadioChange): void {
    const newValue = e.value;
    this.setValue(newValue, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  getValueColumn(item: any) {
    if (item && item.hasOwnProperty(this.valueColumn)) {
      let option = item[this.valueColumn];
      if (option === 'undefined') {
        option = null;
      }
      return option;
    }
    return void 0;
  }

  getDescriptionValue() {
    if (Util.isDefined(this.descriptionColArray) && this.descriptionColArray.length) {
      const currItem = this.dataArray.find(e => e[this.valueColumn] === this.getValue());
      if (Util.isDefined(currItem)) {
        return this.descriptionColArray.map(col => (this.translate && this.translateService) ? this.translateService.get(currItem[col]) : currItem[col]).join(this.separator);
      }
    }
    return '';
  }

}
