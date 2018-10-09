import { Injector, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig, Config } from '../config/app-config';
import { Codes, Util } from '../utils';
import { OntimizeService } from '../services';
import { LoginService } from './login.service';

export interface IProfileService {
  isRestricted(route: string): boolean;
  getPermissions(route: string, attr: string): any;
}

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
export class ProfileService {

  public static PROFILE_ROUTE_PROPERTY = 'route';
  public static PROFILE_COMPONENTS_PROPERTY = 'components';

  // protected loginService: LoginService;
  protected ontimizeService: any;

  protected httpClient: HttpClient;
  protected config: Config;
  protected service: any;
  protected entity: any;
  protected keyColumn: any;
  protected valueColumn: any;

  protected user: any;
  protected profile: any;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
    // this.loginService = this.injector.get(LoginService);
    this.ontimizeService = this.injector.get(OntimizeService);

    this.config = this.injector.get(AppConfig).getConfiguration();

    if (Util.isDefined(this.config.authGuard)) {
      if (Util.isDefined(this.config.authGuard.entity)) {
        this.entity = this.config.authGuard.entity;
      }
      if (Util.isDefined(this.config.authGuard.keyColumn)) {
        this.keyColumn = this.config.authGuard.keyColumn;
      }
      if (Util.isDefined(this.config.authGuard.valueColumn)) {
        this.valueColumn = this.config.authGuard.valueColumn;
      }
      if (Util.isDefined(this.config.authGuard.service)) {
        this.service = this.config.authGuard.service;
      }
    }
  }

  configureService() {
    if (Util.isDataService(this.ontimizeService)) {
      let serviceCfg: Object = this.ontimizeService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.ontimizeService.configureService(serviceCfg);
    }
  }

  restart() {
    this.profile = undefined;
  }

  hasPermissions(): boolean {
    return this.profile !== undefined;
  }

  getUserPermissionsAsPromise(): Promise<boolean> {
    const self = this;
    return new Promise((resolve: any, reject: any) => {
      self.getUserPermissions().subscribe(() => {
        resolve(true);
      });
    });
  }

  getUserPermissions(): Observable<any> {
    if (Util.isDefined(this.entity) && Util.isDefined(this.keyColumn) && Util.isDefined(this.valueColumn)) {
      // if (!Util.isDefined(this.profile) || (this.user !== this.loginService.user)) {
      // }
      return this.queryPermissions();
    } else {
      return this.queryPermissionsFromLocalFile();
    }
  }

  protected queryPermissionsFromLocalFile(): Observable<any> {
    const self = this;
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      self.httpClient.get('assets/profile.json').subscribe((resp: any) => {
        self.profile = resp;
        innerObserver.next(resp);
      }, error => {
        console.log('profile permissions is not available');
        innerObserver.error(error);
      }, () => innerObserver.complete());
    });
    return dataObservable.share();
  }

  protected queryPermissions(): Observable<any> {
    const self = this;
    const loginService = this.injector.get(LoginService);
    const dataObservable: Observable<any> = new Observable(innerObserver => {
      let filter: Object = {};
      filter[self.keyColumn] = loginService.user;
      this.ontimizeService.query(filter, [self.valueColumn], self.entity).subscribe((res: any) => {
        self.user = loginService.user;
        if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) && Util.isDefined(res.data) && (res.data.length === 1) &&
          Util.isObject(res.data[0])) {
          self.profile = res.data[0].hasOwnProperty(self.valueColumn) ? JSON.parse(res.data[0][self.valueColumn]) : {};
        } else {
          //TODO JEE?
        }
        innerObserver.next();
        innerObserver.complete();
      }, (err: any) => {
        console.log('[ProfileService.queryPermissions]: error', err);
        innerObserver.error(err);
      });
    });
    return dataObservable.share();
  }

  isRestricted(route: string): any {
    let restricted = false;
    if (Util.isDefined(this.profile) && Util.isDefined(this.profile[ProfileService.PROFILE_ROUTE_PROPERTY])) {
      for (let routePrefix in this.profile[ProfileService.PROFILE_ROUTE_PROPERTY]) {
        if (this.profile[ProfileService.PROFILE_ROUTE_PROPERTY].hasOwnProperty(routePrefix)) {
          if (route.startsWith(routePrefix) && this.profile[ProfileService.PROFILE_ROUTE_PROPERTY][routePrefix] === false) {
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
    if (Util.isDefined(this.profile)) {
      const allComponents: OComponentContainerPermissions[] = this.profile[ProfileService.PROFILE_COMPONENTS_PROPERTY] || [];
      const parentData: OComponentContainerPermissions = allComponents.find(comp => comp.attr === parentAttr);
      if (Util.isDefined(parentData)) {
        const parentComponents: OComponentPermissions[] = parentData[ProfileService.PROFILE_COMPONENTS_PROPERTY];
        permissions = parentComponents.find(comp => comp.attr === attr);
      }
    }
    return permissions;
  }
}
