import { Component, NgModule, Optional, Inject, ElementRef, Injector, forwardRef, ViewChild, EventEmitter, ViewEncapsulation, HostListener} from '@angular/core';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OSharedModule } from '../../../shared';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OFormComponent, } from '../../form/form-components';
import { DEFAULT_OUTPUTS_O_TEXT_INPUT, DEFAULT_INPUTS_O_TEXT_INPUT } from '../input.components';

import { OFormValue } from '../../form/OFormValue';
import moment from 'moment';
import { ValidatorFn} from '@angular/forms';
import { OValidators } from '../../../validators/o-validators';

export const DEFAULT_OUTPUTS_O_HOUR = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT,
  'onChange'
];

export const DEFAULT_INPUTS_O_HOUR = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-hour-input',
  templateUrl: './o-hour-input.component.html',
  styleUrls: ['./o-hour-input.component.scss'],
  encapsulation:ViewEncapsulation.None,
  outputs: DEFAULT_OUTPUTS_O_HOUR,
  inputs: DEFAULT_INPUTS_O_HOUR,
  host: {
    '[class.o-hour-input]': 'true'
  }
})

export class OHourInputComponent extends OFormDataComponent {
  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);

  }


  @HostListener('click', ['$event']) 
  onClick(e) {
    
      e.preventDefault();
      e.stopPropagation();
    
  }

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('picker')
  private picker: any;

  onMouseDown(event) {
    console.log(this.getAttribute());
    console.log(this.getValueAsTimeStamp());
    if (this.isDisabled || this.isReadOnly) {
      event.preventDefault();
      event.stopPropagation();
    }

  }

  onKeyDown(event){
    console.log(event);
    if (this.isDisabled || this.isReadOnly) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  onOpen($event) {
    if(!this.isReadOnly && !this.isDisabled){
     this.picker.open()
    }
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  isDisabledButton(){
    return this.isReadOnly && this.isDisabled
  }

  getValueAsTimeStamp(){
    return moment('01/01/1970 ' +this.getValue(),'MM/DD/YYYY hh:mm A').unix();
  }
  
  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    //validators.push(OValidators.hourValidator);
    return validators;
    
  }


  
}


@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule.forRoot()],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
