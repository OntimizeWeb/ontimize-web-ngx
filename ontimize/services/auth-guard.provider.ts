import { Injector } from '@angular/core';
import { APP_CONFIG, Config } from '../config/app-config';
import { AuthGuardService } from './auth-guard.service';

class AuthGuardServiceFactory {

  protected config: Config;

  constructor(protected injector: Injector) {
    this.config = this.injector.get(APP_CONFIG);
  }

  public factory(): any {
    let obj = undefined;
    let type = undefined;
    if (typeof (this.config.authGuard) !== 'undefined' &&
      typeof (this.config.authGuard.type) !== 'undefined') {
      type = this.config.authGuard.type;
    }
    if (typeof (type) === 'undefined') {
      obj = new AuthGuardService(this.injector);
    } else {
      let newInstance = Object.create((type as any).prototype);
      obj = type.apply(newInstance, new Array(this.injector));
      return newInstance;
    }
    return obj;
  }

}

export let authGuardServiceFactory = function (injector: Injector) {
  return new AuthGuardServiceFactory(injector).factory();
};
