import {
  Directive, OnInit,
  Optional, Host, SkipSelf,
  Input, ElementRef
} from '@angular/core';

import { AbstractControl, FormControl, ControlContainer, FormGroup } from '@angular/forms';

import {
  MdInput,
  MdCheckbox
} from '@angular/material';



@Directive({
  selector: '[formControlName][o-disabled]'
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
    // if (this.elRef && this.ctrl) {
    //   let input = this.elRef.nativeElement.getElementsByClassName('md-input-element');
    //   if (input && input.length > 0) {
    //     if (this.ctrl.disabled) {
    //       this.elRef.nativeElement.classList.add('md-disabled');
    //       input[0].setAttribute('disabled', true);
    //     } else {
    //       this.elRef.nativeElement.classList.remove('md-disabled');
    //       input[0].removeAttribute('disabled');
    //     }
    //   }
    // }
    if (this.isAllowedComponent()
      && this.ctrl && this.ctrl.disabled) {
      this.component.disabled = this.ctrl.disabled;
    }
  }

  isAllowedComponent() {
    let allowed = false;
    if (this.component instanceof MdInput) {
      allowed = true;
    } else if (this.component instanceof MdCheckbox) {
      allowed = true;
    }
    return allowed;
  }

}
