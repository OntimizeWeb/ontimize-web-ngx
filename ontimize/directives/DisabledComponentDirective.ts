import {
  Directive, OnInit,
  Optional, Host, SkipSelf,
  Input, ElementRef
} from '@angular/core';

import { AbstractControl, FormControl, ControlContainer, FormGroup } from '@angular/forms';

import {
  MdInputContainer
} from '@angular/material';


@Directive({
  selector: '[formControlName][o-disabled], input[o-disabled]'
})
export class DisabledComponentDirective implements OnInit {

  @Input() formControlName: string;
  @Input('o-disabled') component: any;

  private ctrl: AbstractControl;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    if (this.parent && this.parent['form']) {
      this.ctrl = (<FormGroup>this.parent['form']).get(this.formControlName);
      var self = this;
      if (this.ctrl instanceof FormControl) {
        (<FormControl>this.ctrl).registerOnDisabledChange(isDisabled => {
          self.renderDOM();
        });
      }
    }
  }

  ngAfterViewInit() {
    this.renderDOM();
  }

  renderDOM() {
    if (this.component instanceof MdInputContainer) {
      let _disabled = false;
      if (this.ctrl && this.ctrl.disabled) {
        _disabled = this.ctrl.disabled;
      } else if (this.ctrl === null) {
        // case of fake display components (e.g. datepicker, listpicker, ...)
        let element = this.elRef.nativeElement;
        if (element && element.attributes['ng-reflect-disabled']) {
          element.disabled = true;
          _disabled = true;
        }
      }
      // Angular/material bug ???
      // It is necessary to force disabled on _mdInputChild for painting md-underline ok
      if (_disabled) {
        let inputContainer: MdInputContainer = <MdInputContainer>this.component;
        if (inputContainer._mdInputChild) {
          inputContainer._mdInputChild.disabled = true;
        }
      }
    }
  }

  isAllowedComponent() {
    let allowed = false;
    if (this.component instanceof MdInputContainer) {
      allowed = true;
    }
    return allowed;
  }

}
