import {
  Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { OSharedModule } from '../../../shared';
import { OFormComponent } from '../../form/o-form.component';
import {
  ORealInputModule, ORealInputComponent,
  DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT
} from '../real-input/o-real-input.component';
import { InputConverter } from '../../../decorators';

export const DEFAULT_INPUTS_O_PERCENT_INPUT = [
  ...DEFAULT_INPUTS_O_REAL_INPUT
];

export const DEFAULT_OUTPUTS_O_PERCENT_INPUT = [
  ...DEFAULT_OUTPUTS_O_REAL_INPUT
];

@Component({
  selector: 'o-percent-input',
  template: require('./o-percent-input.component.html'),
  styles: [require('./o-percent-input.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_PERCENT_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_PERCENT_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OPercentInputComponent extends ORealInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_PERCENT_INPUT = DEFAULT_INPUTS_O_PERCENT_INPUT;
  public static DEFAULT_OUTPUTS_O_PERCENT_INPUT = DEFAULT_OUTPUTS_O_PERCENT_INPUT;

  @InputConverter()
  grouping: boolean = true;

  @InputConverter()
  decimalDigits: number = 2;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
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
  imports: [OSharedModule, ORealInputModule],
  exports: [OPercentInputComponent, ORealInputModule],
})
export class OPercentInputModule {
}
