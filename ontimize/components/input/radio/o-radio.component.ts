import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioChange } from '@angular/material';

import { Util } from '../../../util/util';
import { OFormValue } from '../../form/OFormValue';
import { OFormComponent } from '../../form/form-components';
import { OSharedModule } from '../../../shared/shared.module';
import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeService } from '../../../services/ontimize.service';
import { OFormServiceComponent } from '../o-form-service-component.class';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { OValueChangeEvent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_RADIO = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'translate',
  'layout',
  'labelPosition: label-position'
];

export const DEFAULT_OUTPUTS_O_RADIO = [
  ...OFormServiceComponent.DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT
];

@Component({
  selector: 'o-radio',
  templateUrl: './o-radio.component.html',
  styleUrls: ['./o-radio.component.scss'],
  inputs: DEFAULT_INPUTS_O_RADIO,
  outputs: DEFAULT_OUTPUTS_O_RADIO,
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-radio]': 'true'
  }
})
export class ORadioComponent extends OFormServiceComponent implements AfterViewInit {

  public static DEFAULT_INPUTS_O_RADIO = DEFAULT_INPUTS_O_RADIO;
  public static DEFAULT_OUTPUTS_O_RADIO = DEFAULT_OUTPUTS_O_RADIO;

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

  innerOnChange(value: any) {
    this.ensureOFormValue(value);
    this.onChange.emit(value);
  }

  onMatRadioGroupChange(e: MatRadioChange): void {
    var newValue = e.value;
    this.setValue(newValue, { changeType: OValueChangeEvent.USER_CHANGE, emitModelToViewChange: false });
  }

  getOptionDescriptionValue(item: any = {}) {
    let descTxt = '';
    if (this.descriptionColArray && this.descriptionColArray.length > 0) {
      var self = this;
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
      let currItem = this.dataArray.find(e => e[this.valueColumn] === this.getValue());
      if (Util.isDefined(currItem)) {
        return this.descriptionColArray.map(col => (this.translate && this.translateService) ? this.translateService.get(currItem[col]) : currItem[col]).join(this.separator);
      }
    }
    return '';
  }

}

@NgModule({
  declarations: [ORadioComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ORadioComponent]
})
export class ORadioModule { }
