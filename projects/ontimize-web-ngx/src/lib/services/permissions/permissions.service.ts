import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { AppConfig } from '../../config/app-config';
import { OComponentPermissions } from '../../types/o-component-permissions.type';
import { OFormPermissions } from '../../types/o-form-permissions.type';
import { OPermissionsDefinition } from '../../types/o-permissions-definition.type';
import { OPermissions } from '../../types/o-permissions.type';
import { ORoutePermissions } from '../../types/o-route-permissions.type';
import { OTableMenuPermissions } from '../../types/table/o-table-menu-permissions.type';
import { OTablePermissions } from '../../types/table/o-table-permissions.type';
import { Util } from '../../util/util';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { OComponentPermissionsByRoute } from '../../types/o-component-permissions-by-route.type';

@Injectable()
export class PermissionsService {

  protected permissionsService: any;
  protected ontimizePermissionsConfig: any;

  protected permissions: OPermissionsDefinition;

  constructor(protected injector: Injector) {
    const appConfig = this.injector.get(AppConfig).getConfiguration();

    if (Util.isDefined(appConfig.permissionsConfiguration)) {
      this.ontimizePermissionsConfig = appConfig.permissionsConfiguration;
    }
  }

  protected configureService() {
    const loadingService: any = OntimizePermissionsService;
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

  public queryPermissions(): Observable<any> {
    const self = this;
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      self.permissionsService.loadPermissions().subscribe((res: any) => {
        self.permissions = res;
        innerObserver.next(res);
      }, (err: any) => {
        console.error('[Permissions.queryPermissions]: error', err);
        innerObserver.error(err);
      }, () => {
        innerObserver.complete();
      });
    });
    return dataObservable.pipe(share());
  }

  protected getPermissionIdFromActRoute(actRoute: ActivatedRoute): string {
    if (!Util.isDefined(actRoute)) {
      return undefined;
    }
    let result: string;
    let snapshot: ActivatedRouteSnapshot = actRoute.snapshot;
    result = ((snapshot.data || {})['oPermission'] || {})['permissionId'];
    while (Util.isDefined(snapshot.firstChild) && !Util.isDefined(result)) {
      snapshot = snapshot.firstChild;
      result = ((snapshot.data || {})['oPermission'] || {})['permissionId'];
    }
    return result;
  }

  protected getComponentPermissionsUsingRoute(attr: string, actRoute: ActivatedRoute): OComponentPermissions {
    let result: OComponentPermissions;
    const permissionId = this.getPermissionIdFromActRoute(actRoute);
    if (Util.isDefined(permissionId)) {
      const routePermissions: ORoutePermissions = (this.permissions.routes || []).find(route => route.permissionId === permissionId);
      if (Util.isDefined(routePermissions)) {
        result = (routePermissions.components || []).find(comp => comp.attr === attr);
      }
    }
    return result;
  }

  public getOComponentPermissions(attr: string, actRoute: ActivatedRoute, selector: string): OComponentPermissionsByRoute {
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    let routePermissions: any;
    const genericRoutePerm: OComponentPermissions = this.getComponentPermissionsUsingRoute(attr, actRoute);
    if (genericRoutePerm && genericRoutePerm.selector === selector) {
      routePermissions = genericRoutePerm;
    }
    let compPermissions: any;
    const attrPermissions = (this.permissions.components || []).find(comp => comp.attr === attr);
    if (attrPermissions && attrPermissions.selector === selector) {
      compPermissions = attrPermissions;
    }
    const permissions: OComponentPermissionsByRoute = {
      route: routePermissions,
      component: compPermissions
    };
    return permissions;
  }

  getTablePermissions(attr: string, actRoute: ActivatedRoute): OTablePermissions {
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const perm = this.getOComponentPermissions(attr, actRoute, 'o-table');
    const routePerm: OTablePermissions = <OTablePermissions>perm.route;
    const compPerm: OTablePermissions = <OTablePermissions>perm.component;
    if (!Util.isDefined(routePerm) || !Util.isDefined(compPerm)) {
      return compPerm || routePerm;
    }
    const permissions: OTablePermissions = {
      selector: 'o-table',
      attr: routePerm.attr,
      menu: this.mergeOTableMenuPermissions(compPerm.menu, routePerm.menu),
      columns: this.mergeOPermissionsArrays(compPerm.columns, routePerm.columns),
      actions: this.mergeOPermissionsArrays(compPerm.actions, routePerm.actions),
      contextMenu: this.mergeOPermissionsArrays(compPerm.contextMenu, routePerm.contextMenu)
    };
    return permissions;
  }

  getFormPermissions(attr: string, actRoute: ActivatedRoute): OFormPermissions {
    if (!Util.isDefined(this.permissions)) {
      return undefined;
    }
    const perm = this.getOComponentPermissions(attr, actRoute, 'o-form');
    const routePerm: OFormPermissions = <OFormPermissions>perm.route;
    const compPerm: OFormPermissions = <OFormPermissions>perm.component;
    if (!Util.isDefined(routePerm) || !Util.isDefined(compPerm)) {
      return compPerm || routePerm;
    }
    const permissions: OFormPermissions = {
      selector: 'o-form',
      attr: routePerm.attr,
      components: this.mergeOPermissionsArrays(compPerm.components, routePerm.components),
      actions: this.mergeOPermissionsArrays(compPerm.actions, routePerm.actions)
    };
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

  protected mergeOPermissionsArrays(permissionsA: OPermissions[], permissionsB: OPermissions[]): OPermissions[] {
    if (!Util.isDefined(permissionsA) || !Util.isDefined(permissionsB)) {
      return permissionsA || permissionsB;
    }
    const result = Object.assign([], permissionsA);
    permissionsB.forEach((perm: OPermissions) => {
      const found = result.find(r => r.attr === perm.attr);
      if (found) {
        found.visible = perm.visible;
        found.enabled = perm.enabled;
      } else {
        result.push(perm);
      }
    });
    return result;
  }

  protected mergeOTableMenuPermissions(permissionsA: OTableMenuPermissions, permissionsB: OTableMenuPermissions): OTableMenuPermissions {
    if (!Util.isDefined(permissionsA) || !Util.isDefined(permissionsB)) {
      return permissionsA || permissionsB;
    }
    const result = {
      visible: permissionsB.visible,
      enabled: permissionsB.enabled,
      items: this.mergeOPermissionsArrays(permissionsA.items, permissionsB.items)
    };
    return result;
  }

  isPermissionIdRouteRestricted(permissionId: string): boolean {
    const routeData = (this.permissions.routes || []).find(route => route.permissionId === permissionId);
    return Util.isDefined(routeData) && routeData.enabled === false;
  }
}
