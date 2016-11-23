import {
  Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { OSharedModule } from '../../../shared.module';
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
  templateUrl: '/input/percent-input/o-percent-input.component.html',
  styleUrls: ['/input/percent-input/o-percent-input.component.css'],
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

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OPercentInputModule,
      providers: []
    };
  }
}
