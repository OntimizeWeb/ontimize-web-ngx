import { Component, NgModule, OnInit, ViewEncapsulation, Optional, Inject, forwardRef, ElementRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { IconRegistryService } from '../../../services';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT, ORealInputComponent, ORealInputModule } from '../real-input/o-real-input.component';

export const DEFAULT_INPUTS_O_PERCENT_INPUT = [
  ...DEFAULT_INPUTS_O_REAL_INPUT
];

export const DEFAULT_OUTPUTS_O_PERCENT_INPUT = [
  ...DEFAULT_OUTPUTS_O_REAL_INPUT
];

@Component({
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

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

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

@NgModule({
  declarations: [OPercentInputComponent],
  imports: [CommonModule, OSharedModule, ORealInputModule],
  exports: [OPercentInputComponent, ORealInputModule]
})
export class OPercentInputModule { }
