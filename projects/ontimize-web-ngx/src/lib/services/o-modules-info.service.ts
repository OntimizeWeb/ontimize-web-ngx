import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OModulesInfoService {

  private subject = new ReplaySubject<string>();
  constructor(
    protected injector: Injector,
    protected router: Router,
  ) {
    this.router = this.injector.get(Router);

  }

  getModuleChangeObservable(): Observable<string> {

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['oAppHeaderTitle']) {
            routeTitle = route!.snapshot.data['oAppHeaderTitle'];
          }
          return routeTitle;
        }))
      .subscribe((title: string) => {
        if (title) {
          this.subject.next(title);
        }
        else {
          this.subject.next("")
        }
      })

    return this.subject.asObservable();
  }
}
