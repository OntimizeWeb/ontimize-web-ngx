import {Component, Inject, Injector, forwardRef, ElementRef, OnInit,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {MdTextareaModule} from '../../material/textarea/textarea';

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
export class OTextareaInputComponent extends OTextInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TEXTAREA_INPUT = DEFAULT_INPUTS_O_TEXTAREA_INPUT;
  public static DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = DEFAULT_OUTPUTS_O_TEXTAREA_INPUT;

  constructor( @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {
    super(form, elRef, ngZone, cd, injector);
  }

  set disabled(value: boolean) {
    var self = this;
    window.setTimeout(() => {
      self._disabled = value;
      //TODO Provisional mientras en la version angular2-material no incluyan el método
      // 'setDisabledState()' en la implementación de ControlValueAccessor
      let input = self.elRef.nativeElement.getElementsByClassName('md-textarea-element');
      if (self._disabled) {
        self.elRef.nativeElement.classList.add('md-disabled');
        if (input && input.lenght > 0) {
          input[0].setAttribute('disabled', self._disabled);
        }
      } else {
        self.elRef.nativeElement.classList.remove('md-disabled');
        if (input && input.lenght > 0) {
          input[0].removeAttribute('disabled');
        }
      }
     }, 0);
  }

}

@NgModule({
  declarations: [OTextareaInputComponent],
  imports: [ OTextInputModule, MdTextareaModule],
  exports: [OTextareaInputComponent, OTextInputModule, MdTextareaModule],
})
export class OTextareaInputModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTextareaInputModule,
      providers: []
    };
  }
}
