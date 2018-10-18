import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../config/app-config';
import { Util } from '../../utils';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';

export type OPermissionsDefinition = {
  components?: OComponentContainerPermissions[];
  menu?: OPermissions[];
};

export type OPermissions = {
  attr: string;
  visible: boolean;
  enabled: boolean;
};

export type OComponentContainerPermissions = {
  attr: string;
  selector: string;
  components: OPermissions[];
  actions: OPermissions[];
};

@Injectable()
export class PermissionsService {

  public static PERMISSIONS_ACTIONS_FORM = ['refresh', 'insert', 'update', 'delete'];

  protected permissionsService: any;
  protected ontimizePermissionsConfig: any;

  protected permissions: OPermissionsDefinition;

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
    return new Promise((resolve: any, reject: any) => {
      self.permissions = {};
      if (Util.isDefined(self.ontimizePermissionsConfig)) {
        self.configureService();
        self.queryPermissions().subscribe(() => {
          resolve(true);
        }, error => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  protected queryPermissions(): Observable<any> {
    const self = this;
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

  getComponentPermissions(attr: string, parentAttr: string): OPermissions {
    let permissions;
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const allComponents: OComponentContainerPermissions[] = this.permissions.components || [];

    const parentData: OComponentContainerPermissions = allComponents.find(comp => comp.attr === parentAttr);

    if (Util.isDefined(parentData) && Util.isDefined(parentData.components)) {
      permissions = parentData.components.find(comp => comp.attr === attr);
    }
    return permissions;
  }

  getMenuPermissions(attr: string): OPermissions {
    let permissions;
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const allMenu: OPermissions[] = this.permissions.menu || [];

    permissions = allMenu.find(comp => comp.attr === attr);

    return permissions;
  }

  getContainerActionsPermissions(attr: string): OPermissions[] {
    let permissions;
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const allComponents: OComponentContainerPermissions[] = this.permissions.components || [];

    const containerData: OComponentContainerPermissions = allComponents.find(comp => comp.attr === attr);

    if (Util.isDefined(containerData)) {
      permissions = containerData.actions || [];
    }
    return permissions;
  }

  static checkEnabledPermission(permission: OPermissions): boolean {
    if (Util.isDefined(permission) && permission.enabled === false) {
      console.warn('Operation is not allowed due permissions restrictions');
      return false;
    }
    return true;
  }
}
