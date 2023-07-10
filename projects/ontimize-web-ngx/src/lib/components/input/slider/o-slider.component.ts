import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';

import { OFormComponent } from '../../../components/form/o-form.component';
import { InputConverter } from '../../../decorators/input-converter';
import {
  OFormDataComponent
} from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_SLIDER_INPUT = [
  'color',
  'max',
  'min',
  'step',
  'thumbLabel:thumb-label',
  'oDisplayWith:display-with'
];


export type SliderDisplayFunction = (value: number | null) => string | number;

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

  @InputConverter()
  public thumbLabel: boolean = false;

  @InputConverter()
  min: number;

  @InputConverter()
  max: number;

  @InputConverter()
  step: number = 1;

  oDisplayWith: SliderDisplayFunction;

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
