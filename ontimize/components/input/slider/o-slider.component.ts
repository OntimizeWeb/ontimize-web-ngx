import { Component, NgModule, Optional, forwardRef, Inject, Injector, ElementRef, ViewEncapsulation } from '@angular/core';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OValueChangeEvent } from '../../o-form-data-component.class';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../../components';
import { InputConverter } from '../../../decorators';
import { OFormValue } from '../../form/OFormValue';
import { MatSliderChange } from '@angular/material/slider';


export const DEFAULT_INPUTS_O_SLIDER_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'color',
  'invert',
  'max',
  'min',
  'step',
  'thumbLabel:thumb-label',
  'tickInterval:tick-interval',
  'vertical',
  'oDisplayWith:displayWith'
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

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

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

  _tickInterval: 'auto' | number = 0;

  set tickInterval(value: any) {
    this._tickInterval = value;
  }
  get tickInterval() {
    return this._tickInterval;
  }

  protected _displayWith: SliderDisplayFunction;

  get oDisplayWith(): SliderDisplayFunction {
    return this._displayWith;
  }

  set oDisplayWith(val: SliderDisplayFunction) {
    this._displayWith = val;
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
