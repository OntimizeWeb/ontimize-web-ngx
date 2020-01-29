import { Component, Injector, OnInit, Optional, Inject, forwardRef, NgModule } from '@angular/core';
import { OValidatorComponent } from './o-validator.component';

export const DEFAULT_INPUTS_O_ERROR = [
  'name',
  'text'
];

@Component({
  moduleId: module.id,
  selector: 'o-error',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_ERROR
})
export class OErrorComponent implements OnInit {

  public static DEFAULT_INPUTS_O_ERROR = DEFAULT_INPUTS_O_ERROR;

  name: string;
  text: string;

  constructor(
    @Optional() @Inject(forwardRef(() => OValidatorComponent)) protected oValidator: OValidatorComponent,
    protected injector: Injector
  ) {
  }

  ngOnInit() {
    this.registerValidatorError();
  }

  registerValidatorError() {
    if (this.oValidator) {
      this.oValidator.registerError(this);
    }
  }

  getName(): string {
    return this.name;
  }

  getText(): string {
    return this.text;
  }

}
