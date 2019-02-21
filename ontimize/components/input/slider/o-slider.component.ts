import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { OFormComponent } from '../../../components';
import { InputConverter } from '../../../decorators';
import { OSharedModule } from '../../../shared';
import { OFormValue } from '../../form/OFormValue';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent,
  OValueChangeEvent,
} from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_SLIDER_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'color',
  'invert',
  'max',
  'min',
  'step',
  'thumbLabel:thumb-label',
  'tickInterval:tick-interval',
  'layout'
];

export const DEFAULT_OUTPUTS_O_SLIDER_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

export type SliderDisplayFunction = (value: number | null) => string | number;

@Component({
  moduleId: module.id,
  selector: 'o-slider',
  host: {
    'class': 'o-slider'
  },
  templateUrl: 'o-slider.component.html',
  styleUrls: ['./o-slider.component.scss'],
  inputs: DEFAULT_INPUTS_O_SLIDER_INPUT,
  outputs: DEFAULT_OUTPUTS_O_SLIDER_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OSliderComponent extends OFormDataComponent {
  public static DEFAULT_INPUTS_O_SLIDER_INPUT = DEFAULT_INPUTS_O_SLIDER_INPUT;
  public static DEFAULT_OUTPUTS_O_SLIDER_INPUT = DEFAULT_OUTPUTS_O_SLIDER_INPUT;

  public color: string;
  public layout: 'row' | 'column' = 'row';

  @InputConverter()
  public vertical: boolean = false;

  @InputConverter()
  public invert: boolean = false;

  @InputConverter()
  public thumbLabel: boolean = false;

  @InputConverter()
  min: number;

  @InputConverter()
  max: number;

  @InputConverter()
  step: number = 1;

  set tickInterval(value: any) {
    this._tickInterval = value;
  }
  get tickInterval() {
    return this._tickInterval;
  }
  _tickInterval: 'auto' | number = 0;

  get oDisplayWith(): SliderDisplayFunction {
    return this._displayWith;
  }
  set oDisplayWith(val: SliderDisplayFunction) {
    this._displayWith = val;
  }
  protected _displayWith: SliderDisplayFunction;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }

  onChangeEvent(e: MatSliderChange): void {
    var newValue = e.value;
    this.setValue(newValue, { changeType: OValueChangeEvent.USER_CHANGE, emitModelToViewChange: false });
  }

}

@NgModule({
  declarations: [OSliderComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSliderComponent]
})
export class OSliderModule { }
