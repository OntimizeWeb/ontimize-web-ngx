import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { NavigationService } from '../../services/navigation.service';
import { OBreadcrumbService } from '../../services/o-breadcrumb.service';
import { OBreadcrumb } from '../../types/o-breadcrumb-item.type';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { OFormBase } from '../form/o-form-base.class';
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
  inputs: DEFAULT_INPUTS_O_BREADCRUMB,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-breadcrumb]': 'true'
  }
})
export class OBreadcrumbComponent implements AfterViewInit, OnDestroy, OnInit {

  public labelColumns: string;
  public separator: string = ' ';
  public breadcrumbs: BehaviorSubject<OBreadcrumb[]> = new BehaviorSubject([]);

  protected router: Router;
  set form(value: OFormBase) {
    this._formRef = value;
  }
  protected _formRef: OFormBase;
  protected labelColsArray: Array<string> = [];
  protected navigationService: NavigationService;
  protected subscription: Subscription = new Subscription();
  protected oBreadcrumService: OBreadcrumbService;

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.oBreadcrumService = this.injector.get(OBreadcrumbService);
  }

  ngOnInit() {
    this.labelColsArray = Util.parseArray(this.labelColumns);

    this.subscription.add(
      this.oBreadcrumService.breadcrumbs$.subscribe(bs => this.breadcrumbs.next(bs))
    );
  }

  ngAfterViewInit() {
    if (this._formRef && this.labelColsArray.length) {
      const self = this;
      this.subscription.add(this._formRef.onDataLoaded.subscribe((value: any) => {
        if (self.breadcrumbs.value.length) {
          const displayText = self.labelColsArray.map(element => value[element]).join(self.separator);
          self.breadcrumbs.value[self.breadcrumbs.value.length - 1].displayText = displayText;
        }
      }));
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isCurrentRoute(route: OBreadcrumb): boolean {
    return route.route === this.router.routerState.snapshot.url.split('?')[0];
  }

  onRouteClick(route: OBreadcrumb) {
    const extras = {};
    if (route.queryParams) {
      extras[Codes.QUERY_PARAMS] = route.queryParams;
    }
    this.router.navigate([route.route], extras);
  }

}
