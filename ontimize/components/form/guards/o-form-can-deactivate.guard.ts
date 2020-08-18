import { Injectable, Injector } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Codes } from '../../../utils';
import { OFormComponent } from '../o-form.component';
import { LoginService } from '../../../services/login.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateFormGuard implements CanDeactivate<CanComponentDeactivate> {
  oForm: OFormComponent;
  public static CLASSNAME = 'CanDeactivateFormGuard';
  private loginService: LoginService;

  constructor(protected injector: Injector) {
    this.loginService = this.injector.get(LoginService);
  }


  canDeactivate(component: CanComponentDeactivate, curr: ActivatedRouteSnapshot, state: RouterStateSnapshot, future: RouterStateSnapshot) {
    if (!this.loginService.isLoggedIn()) {
      return true;
    }
    const futureQueryParams = future.root.queryParams;
    if (futureQueryParams.hasOwnProperty(Codes.IGNORE_CAN_DEACTIVATE)) {
      return true;
    }
    if (this.oForm) {
      return this.oForm.canDeactivate();
    }
    return true;
  }

  setForm(form: OFormComponent) {
    this.oForm = form;
  }
}

