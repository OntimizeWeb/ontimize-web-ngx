import { Injector } from '@angular/core';

import { AppConfig } from '../../config/app-config';
import { Config } from '../../types/config.type';
import { Util } from '../../util/util';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './ontimize-permissions.service';

export let OntimizePermissionsServiceProvider = {
  provide: OntimizePermissionsService,
  useFactory: permissionsServiceFactory,
  deps: [Injector]
};

class PermissionsServiceFactory {

  protected config: Config;

  constructor(protected injector: Injector) {
    this.config = this.injector.get(AppConfig).getConfiguration();
  }

  public factory(): any {
    const serviceType = this.config.permissionsServiceType;
    if (!Util.isDefined(serviceType) || 'OntimizePermissions' === serviceType) {
      return new OntimizePermissionsService(this.injector);
    } else if ('OntimizeEEPermissions' === serviceType) {
      return new OntimizeEEPermissionsService(this.injector);
    } else {
      const newInstance = Object.create((serviceType as any).prototype);
      serviceType.apply(newInstance, new Array(this.injector));
      return newInstance;
    }
  }
}

export function permissionsServiceFactory(injector: Injector) {
  return new PermissionsServiceFactory(injector).factory();
}
