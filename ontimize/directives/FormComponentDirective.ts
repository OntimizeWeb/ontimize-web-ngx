import {
  Directive,
  ElementRef,
  forwardRef,
  Inject
} from '@angular/core';

import { IComponent } from '../components/o-component.class';
import { OFormComponent } from '../components';

@Directive({
    selector: '[form-component]'
})
export class FormComponentDirective implements IComponent {
    constructor(@Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
      private _el: ElementRef) {
        if(this._form) {
          this._form.registerFormComponent(this);
        }
    }

    getAttribute() {
      if (this._el && this._el.nativeElement.attributes['attr']) {
        return this._el.nativeElement.attributes['attr'].value;
      }
      return undefined;
    }

}
