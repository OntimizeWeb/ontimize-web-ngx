import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { OTranslateService } from '../services';

export interface ModuleInfo {
  name?: string;
  route?: string;
}

@Injectable()
export class OModulesInfoService {
  protected storedInfo: ModuleInfo;
  protected actRoute: ActivatedRoute;
  protected router: Router;
  protected translateService: OTranslateService;

  private subject = new Subject<any>();

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.actRoute = this.injector.get(ActivatedRoute);
    this.translateService = this.injector.get(OTranslateService);

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let translation = this.translateService.get(ev.url);
        if (translation !== ev.url) {
          this.setModuleInfo({
            name: translation
          });
        }
      }
    });
  }

  setModuleInfo(info: ModuleInfo) {
    this.storedInfo = info;
    this.subject.next(info);
  }

  getModuleInfo(): ModuleInfo {
    return this.storedInfo;
  }

  getModuleChangeObservable(): Observable<any> {
    return this.subject.asObservable();
  }

}
