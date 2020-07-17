import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MatRadioChange } from '@angular/material';

import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT, OFormServiceComponent } from '../o-form-service-component.class';

export const DEFAULT_INPUTS_O_RADIO = [
  ...DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'translate',
  'layout',
  'labelPosition: label-position'
];

export const DEFAULT_OUTPUTS_O_RADIO = [
  ...DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT
];

@Component({
  selector: 'o-radio',
  templateUrl: './o-radio.component.html',
  styleUrls: ['./o-radio.component.scss'],
  inputs: DEFAULT_INPUTS_O_RADIO,
  outputs: DEFAULT_OUTPUTS_O_RADIO,
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
  @InputConverter()
  public translate: boolean = false;
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

  getOptionDescriptionValue(item: any = {}) {
    let descTxt = '';
    if (this.descriptionColArray && this.descriptionColArray.length > 0) {
      const self = this;
      this.descriptionColArray.forEach((col, index) => {
        let txt = item[col];
        if (txt) {
          if (self.translate && self.translateService) {
            txt = self.translateService.get(txt);
          }
          descTxt += txt;
        }
        if (index < self.descriptionColArray.length - 1) {
          descTxt += self.separator;
        }
      });
    }
    return descTxt;
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
