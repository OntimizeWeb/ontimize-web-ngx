import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../decorators/input-converter';
import {
  DEFAULT_INPUTS_O_REAL_INPUT,
  DEFAULT_OUTPUTS_O_REAL_INPUT,
  ORealInputComponent,
} from '../real-input/o-real-input.component';

export const DEFAULT_INPUTS_O_PERCENT_INPUT = [
  ...DEFAULT_INPUTS_O_REAL_INPUT
];

export const DEFAULT_OUTPUTS_O_PERCENT_INPUT = [
  ...DEFAULT_OUTPUTS_O_REAL_INPUT
];

@Component({
  moduleId: module.id,
  selector: 'o-percent-input',
  templateUrl: './o-percent-input.component.html',
  styleUrls: ['./o-percent-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_PERCENT_INPUT,
  outputs: DEFAULT_OUTPUTS_O_PERCENT_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OPercentInputComponent extends ORealInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_PERCENT_INPUT = DEFAULT_INPUTS_O_PERCENT_INPUT;
  public static DEFAULT_OUTPUTS_O_PERCENT_INPUT = DEFAULT_OUTPUTS_O_PERCENT_INPUT;

  @InputConverter()
  grouping: boolean = true;

  public ngOnInit() {
    if (typeof (this.min) === 'undefined') {
      this.min = 0;
    }
    if (typeof (this.max) === 'undefined') {
      this.max = 100;
    }
    super.ngOnInit();
  }
}
