import { EventEmitter } from '@angular/core';

import { OValueChangeEvent } from '../components/o-value-change-event.class';
import { FormValueOptions } from '../types/form-value-options.type';
import { IFormControlComponent } from './form-control-component.interface';

export interface IFormDataComponent extends IFormControlComponent {
  onChange: EventEmitter<object>;
  onValueChange: EventEmitter<OValueChangeEvent>;
  getSQLType(): number;
  data(value: any): void;
  isAutomaticBinding(): boolean;
  isAutomaticRegistering(): boolean;
  setValue(val: any, options?: FormValueOptions): void;
  clearValue(options?: FormValueOptions): void;
  getValue(): any;
}
