import { AfterViewInit, Component, Injector, NgModule, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../shared';
import { NavigationService, OFormComponent, Util } from '../../../index';

export class OBreadcrumb {
  displayText: string;
  terminal: boolean;
  url: string;
  // urlQueryParams: Object;
}

export const DEFAULT_INPUTS_O_BREADCRUMB = [
  // form [OFormComponent]: Ontimize Web Form reference.
  '_formRef: form',

  // label-columns [string]: Form values shown on each element. Separated by ';'. Default: no value.
  'labelColumns: label-columns',

  // separator [string]: Form values shown on each element. Separated by ';'. Default: no value.
  'separator'
];

@Component({
  selector: 'o-breadcrumb',
  templateUrl: 'o-breadcrumb.component.html',
  styleUrls: ['o-breadcrumb.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_BREADCRUMB
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-breadcrumb]': 'true'
  }
})
export class OBreadcrumbComponent implements AfterViewInit, OnDestroy, OnInit {

  public labelColumns: string;
  public separator: string = ' ';
  public breadcrumbs: OBreadcrumb[];

  protected router: Router;
  protected _formRef: OFormComponent;
  protected labelColsArray: Array<string> = [];
  protected navigationService: NavigationService;
  protected navigationServiceSubscription: Subscription;

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.navigationService = this.injector.get(NavigationService);
  }

  ngOnInit() {
    let self = this;

    this.labelColsArray = Util.parseArray(this.labelColumns);

    if (this.navigationService && this.navigationService.navigationEvents$) {
      this.navigationServiceSubscription = this.navigationService.navigationEvents$
        .subscribe(e => {
          let route = self.router.routerState.root.snapshot;
          let url = '';
          // let urlQueryParams = {};
          self.breadcrumbs = [];
          while (route.firstChild !== null) {
            route = route.firstChild;
            if (route.routeConfig === null) { continue; }
            if (!route.routeConfig.path) { continue; }
            let displayText = '';
            url += `/${route.url.map((s, i) => {
              // urlQueryParams = route.queryParams;
              return i === 0 ? displayText = s.path : null;
            }).join('/')}`;
            self.breadcrumbs.push({
              displayText: displayText,
              terminal: self.isTerminal(route),
              url: url,
              // urlQueryParams: urlQueryParams
            });
          }
        });
    }
  }

  ngAfterViewInit() {
    if (this._formRef) {
      this._formRef.formGroup.valueChanges.subscribe(
        (value: any) => {
          console.log(value);
        }
      );
    }
  }

  protected isTerminal(route: ActivatedRouteSnapshot) {
    return route.firstChild === null || route.firstChild.routeConfig === null;
  }

  ngOnDestroy() {
    if (this.navigationServiceSubscription) {
      this.navigationServiceSubscription.unsubscribe();
    }
  }

  protected onBreadcrumbChange(crumbs: OBreadcrumb[]) {
    this.breadcrumbs = crumbs;
  }

}

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [OBreadcrumbComponent],
  declarations: [OBreadcrumbComponent]
})
export class OBreadcrumbModule { }
