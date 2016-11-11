import {Component, Inject, Injector, forwardRef, ElementRef,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import { OSharedModule } from '../../../shared.module';
import {OFormComponent} from '../../form/o-form.component';
import {OTextInputModule, OTextInputComponent,
  DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT} from '../text-input/o-text-input.component';

export const DEFAULT_INPUTS_O_TEXTAREA_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'columns',
  'rows'
];

export const DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-textarea-input',
  templateUrl: '/input/textarea-input/o-textarea-input.component.html',
  styleUrls: ['/input/textarea-input/o-textarea-input.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_TEXTAREA_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TEXTAREA_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OTextareaInputComponent extends OTextInputComponent {

  public static DEFAULT_INPUTS_O_TEXTAREA_INPUT = DEFAULT_INPUTS_O_TEXTAREA_INPUT;
  public static DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = DEFAULT_OUTPUTS_O_TEXTAREA_INPUT;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
  }

  isResizable() {
    let resizable = true;
    if (this.isDisabled || this.isReadOnly) {
      resizable = false;
    }
    return resizable;
  }

}

@NgModule({
  declarations: [OTextareaInputComponent],
  imports: [ OSharedModule, OTextInputModule],
  exports: [OTextareaInputComponent, OTextInputModule],
})
export class OTextareaInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTextareaInputModule,
      providers: []
    };
  }
}
