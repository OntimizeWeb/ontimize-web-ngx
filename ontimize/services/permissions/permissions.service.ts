import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../config/app-config';
import { Util } from '../../utils';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';

export type OPermissions = {
  attr: string;
  visible: boolean;
  enabled: boolean;
};

export type OFormPermissions = {
  attr: string;
  selector: string;
  components: OPermissions[];
  actions: OPermissions[];
};

export type OTableMenuPermissions = {
  visible: boolean;
  enabled: boolean;
  items: OPermissions[];
};

export type OTablePermissions = {
  attr: string;
  selector: string;
  menu: OTableMenuPermissions;
  columns: OPermissions[];
  actions: OPermissions[];
};

export type OComponentPermissions = OFormPermissions | OTablePermissions;

export type OPermissionsDefinition = {
  components?: OComponentPermissions[];
  menu?: OPermissions[];
};

@Injectable()
export class PermissionsService {
  public static PERMISSIONS_ACTIONS_REFRESH_FORM = 'refresh';
  public static PERMISSIONS_ACTIONS_INSERT_FORM = 'insert';
  public static PERMISSIONS_ACTIONS_UPDATE_FORM = 'update';
  public static PERMISSIONS_ACTIONS_DELETE_FORM = 'delete';
  public static MESSAGE_OPERATION_NOT_ALLOWED_PERMISSION = 'Operation is not allowed due to permissions restrictions';

  public static PERMISSIONS_ACTIONS_FORM = [
    PermissionsService.PERMISSIONS_ACTIONS_REFRESH_FORM,
    PermissionsService.PERMISSIONS_ACTIONS_INSERT_FORM,
    PermissionsService.PERMISSIONS_ACTIONS_UPDATE_FORM,
    PermissionsService.PERMISSIONS_ACTIONS_DELETE_FORM
  ];

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
      // resolve(true);
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

  getTablePermissions(attr: string): OTablePermissions {
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    let permissions: OTablePermissions;
    const allComponents = this.permissions.components || [];
    const attrPermissions = allComponents.find(comp => comp.attr === attr);
    if (attrPermissions && attrPermissions.selector === 'o-table') {
      permissions = <OTablePermissions>attrPermissions;
    }
    return permissions;
  }

  getFormDataComponentPermissions(attr: string, formAttr: string): OPermissions {
    let permissions;
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const allComponents = this.permissions.components || [];
    let formPermissions: OFormPermissions;
    const formAttrPermissions = allComponents.find(comp => comp.attr === formAttr);
    if (formAttrPermissions && formAttrPermissions.selector === 'o-form') {
      formPermissions = <OFormPermissions>formAttrPermissions;
    }
    if (Util.isDefined(formPermissions) && Util.isDefined(formPermissions.components)) {
      permissions = formPermissions.components.find(comp => comp.attr === attr);
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
    let permissions: OPermissions[];
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const allComponents = this.permissions.components || [];
    const attrPermissions: OComponentPermissions = allComponents.find(comp => comp.attr === attr);

    if (Util.isDefined(attrPermissions)) {
      permissions = attrPermissions.actions || [];
    }
    return permissions;
  }

  static checkEnabledPermission(permission: OPermissions): boolean {
    if (Util.isDefined(permission) && permission.enabled === false) {
      console.warn(PermissionsService.MESSAGE_OPERATION_NOT_ALLOWED_PERMISSION);
      return false;
    }
    return true;
  }

  static registerDisableChangesInDom(nativeElement: any, callback: Function, checkStringValue: boolean = false): MutationObserver {
    if (!Util.isDefined(nativeElement)) {
      return undefined;
    }

    const mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
      const mutation = mutations[0];
      if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
        const attribute = mutation.target.attributes.getNamedItem('disabled');
        if (attribute === null || (checkStringValue && attribute.value !== 'true')) {
          callback(mutation);
        }
      }
    });

    mutationObserver.observe(nativeElement, {
      attributes: true,
      attributeFilter: ['disabled']
    });

    return mutationObserver;
  }
}
