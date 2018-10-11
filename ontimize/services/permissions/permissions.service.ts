import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../config/app-config';
import { Util } from '../../utils';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';

export type OComponentPermissions = {
  attr: string;
  visible: boolean;
  enabled: boolean;
};

export type OComponentContainerPermissions = {
  attr: string;
  selector: string;
  components: OComponentPermissions[];
};

@Injectable()
export class PermissionsService {

  public static PERMISSIONS_ROUTE_PROPERTY = 'route';
  public static PERMISSIONS_COMPONENTS_PROPERTY = 'components';

  protected permissionsService: any;
  protected ontimizePermissionsConfig: any;

  protected permissions: any;

  constructor(protected injector: Injector) {
    const appConfig = this.injector.get(AppConfig).getConfiguration();

    if (Util.isDefined(appConfig.permissionsConfiguration)) {
      this.ontimizePermissionsConfig = appConfig.permissionsConfiguration;
    }
  }

  configureService() {
    let loadingService: any = OntimizePermissionsService;
    try {
      this.permissionsService = this.injector.get(loadingService);
      if (Util.isPermissionsService(this.permissionsService)) {
        if (this.permissionsService instanceof OntimizePermissionsService) {
          (this.permissionsService as OntimizePermissionsService).configureService(this.ontimizePermissionsConfig);
        } else if (this.permissionsService instanceof OntimizeEEPermissionsService) {
          (this.permissionsService as OntimizeEEPermissionsService).configureService(this.ontimizePermissionsConfig);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  restart() {
    this.permissions = undefined;
  }

  hasPermissions(): boolean {
    return this.permissions !== undefined;
  }

  getUserPermissionsAsPromise(): Promise<boolean> {
    const self = this;
    this.configureService();
    return new Promise((resolve: any, reject: any) => {
      self.queryPermissions().subscribe(() => {
        resolve(true);
      }, error => {
        resolve(true);
      });
    });
  }

  protected queryPermissions(): Observable<any> {
    const self = this;
    this.permissions = {};
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      self.permissionsService.loadPermissions().subscribe((res: any) => {
        self.permissions = res;
        innerObserver.next(res);
      }, (err: any) => {
        console.log('[Permissions.queryPermissions]: error', err);
        innerObserver.error(err);
      }, () => {
        innerObserver.complete();
      });
    });
    return dataObservable.share();
  }

  isRestricted(route: string): any {
    let restricted = false;
    if (Util.isDefined(this.permissions) && Util.isDefined(this.permissions[PermissionsService.PERMISSIONS_ROUTE_PROPERTY])) {
      for (let routePrefix in this.permissions[PermissionsService.PERMISSIONS_ROUTE_PROPERTY]) {
        if (this.permissions[PermissionsService.PERMISSIONS_ROUTE_PROPERTY].hasOwnProperty(routePrefix)) {
          if (route.startsWith(routePrefix) && this.permissions[PermissionsService.PERMISSIONS_ROUTE_PROPERTY][routePrefix] === false) {
            restricted = true;
            break;
          }
        }
      }
    }
    return restricted;
  }

  getPermissions(parentAttr: string, attr: string): OComponentPermissions {
    let permissions = undefined;
    if (Util.isDefined(this.permissions)) {
      const allComponents: OComponentContainerPermissions[] = this.permissions[PermissionsService.PERMISSIONS_COMPONENTS_PROPERTY] || [];
      const parentData: OComponentContainerPermissions = allComponents.find(comp => comp.attr === parentAttr);
      if (Util.isDefined(parentData)) {
        const parentComponents: OComponentPermissions[] = parentData[PermissionsService.PERMISSIONS_COMPONENTS_PROPERTY];
        permissions = parentComponents.find(comp => comp.attr === attr);
      }
    }
    return permissions;
  }
}
