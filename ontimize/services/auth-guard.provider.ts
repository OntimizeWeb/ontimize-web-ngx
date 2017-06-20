import { Injector } from '@angular/core';
import { AppConfig, Config } from '../config/app-config';
import { AuthGuardService } from './auth-guard.service';

export class AuthGuardServiceFactory {

  protected config: Config;

  constructor(protected injector: Injector) {
    this.config = this.injector.get(AppConfig).getConfiguration();
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

export function authGuardServiceFactory(injector) {
  return new AuthGuardServiceFactory(injector).factory();
}
