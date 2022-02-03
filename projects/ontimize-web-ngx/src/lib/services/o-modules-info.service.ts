import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OModulesInfoService {

  private subject = new ReplaySubject<string>();
  public title: string;
  constructor(
    protected injector: Injector,
    protected router: Router,
  ) {
    this.router = this.injector.get(Router);

    // Set initial route
    this.subject.next(this.title);


  }

  getModuleChangeObservable(staticTitle: boolean): Observable<string> {
    if (staticTitle) {
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
            this.title = title;
            this.subject.next(title);
          }
          else {
            this.title = "";
            this.subject.next("");
          }
        })
    }
    else {
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: NavigationEnd) => this.subject.next(e.url));
    }
    return this.subject.asObservable();
  }
}
