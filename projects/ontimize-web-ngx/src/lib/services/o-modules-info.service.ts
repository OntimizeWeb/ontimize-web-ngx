import { Injectable, Injector } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OModulesInfoService {

  private subject = new ReplaySubject<string>();

  constructor(
    protected injector: Injector
  ) {
    const router = this.injector.get(Router);

    // Set initial route
    this.subject.next(router.url);

    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.subject.next(e.url));
  }

  getModuleChangeObservable(): Observable<string> {
    return this.subject.asObservable();
  }

}
