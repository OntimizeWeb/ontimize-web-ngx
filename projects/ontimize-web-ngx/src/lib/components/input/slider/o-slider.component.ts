import { Component, ElementRef, forwardRef, Injector, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';


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
  standalone: true,
  imports: [ReactiveFormsModule, MatSliderModule, MatTooltipModule],
  selector: 'o-slider',
  host: {
    class: 'o-slider'
  },
  templateUrl: 'o-slider.component.html',
  styleUrls: ['./o-slider.component.scss'],
  inputs: DEFAULT_INPUTS_O_SLIDER_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OSliderComponent), multi: true }]
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
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }


}
