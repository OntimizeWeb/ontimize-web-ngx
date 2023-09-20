import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';

import { OFormComponent } from '../../../components/form/o-form.component';
import { BooleanInputConverter, NumberInputConverter } from '../../../decorators/input-converter';
import { OFormDataComponent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_SLIDER_INPUT = [
  'color',
  'max',
  'min',
  'step',
  'thumbLabel:thumb-label',
  'oDisplayWith:display-with',
  'showTickMarks:show-tick-marks'
];


export type SliderDisplayFunction = (value: number) => string;

@Component({
  selector: 'o-slider',
  host: {
    class: 'o-slider'
  },
  templateUrl: 'o-slider.component.html',
  styleUrls: ['./o-slider.component.scss'],
  inputs: DEFAULT_INPUTS_O_SLIDER_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OSliderComponent extends OFormDataComponent {

  public color: string;

  @BooleanInputConverter()
  public thumbLabel: boolean = false;

  @BooleanInputConverter()
  public showTickMarks: boolean = false;

  @NumberInputConverter()
  min: number;

  @NumberInputConverter()
  max: number;

  @NumberInputConverter()
  step: number = 1;

  oDisplayWith: SliderDisplayFunction = (value: number) => `${value}`;;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }


}
