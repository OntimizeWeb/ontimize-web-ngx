import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OFormComponent } from '../o-form.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateFormGuard implements CanDeactivate<CanComponentDeactivate> {
  oForm: OFormComponent;

  canDeactivate(component: CanComponentDeactivate) {
    if (this.oForm) {
      return this.oForm.canDeactivate();
    }
    return true;
  }

  setForm(form: OFormComponent) {
    this.oForm = form;
  }
}

