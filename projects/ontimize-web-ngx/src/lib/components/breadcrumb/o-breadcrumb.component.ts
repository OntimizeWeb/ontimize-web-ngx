import { AfterViewInit, Component, Injector, NgModule, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Util } from '../../util/util';
import { Codes } from '../../util/codes';
import { OSharedModule } from '../../shared';
// import { NavigationService, OFormComponent, ONavigationItem, Util } from '../../ontimize-web-ngx.module';
import { NavigationService, ONavigationItem } from '../../services/navigation.service';
import { OFormComponent } from '../form/o-form.component';

export const DEFAULT_INPUTS_O_BREADCRUMB = [
  // form [OFormComponent]: Ontimize Web Form reference.
  '_formRef: form',

  // label-columns [string]: Form values shown on each element. Separated by ';'. Default: no value.
  'labelColumns: label-columns',

  // separator [string]: Form values shown on each element. Separated by ';'. Default: no value.
  'separator'
];

@Component({
  moduleId: module.id,
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
  public breadcrumbs: Array<ONavigationItem>;

  protected router: Router;
  protected _formRef: OFormComponent;
  protected labelColsArray: Array<string> = [];
  protected navigationService: NavigationService;
  protected onDataLoadedSubscription: Subscription;
  protected navigationServiceSubscription: Subscription;

  protected _displayTextloaded: boolean = false;

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.navigationService = this.injector.get(NavigationService);
  }

  ngOnInit() {
    const self = this;

    this.labelColsArray = Util.parseArray(this.labelColumns);

    if (this.navigationService && this.navigationService.navigationEvents$) {
      this.navigationServiceSubscription = this.navigationService.navigationEvents$.subscribe(e => {
        // setting loaded to false if the breadcrumb is inside a form (and later it will find its displayText)
        self.displayTextloaded = !(self._formRef && self.labelColsArray.length);
        self.breadcrumbs = e;
      });
    }
  }

  ngAfterViewInit() {
    if (this._formRef && this.labelColsArray.length) {
      let self = this;
      this.onDataLoadedSubscription = this._formRef.onDataLoaded.subscribe((value: any) => {
        if (self.breadcrumbs.length) {
          let displayText = self.labelColsArray.map(element => value[element]).join(self.separator);
          self.breadcrumbs[self.breadcrumbs.length - 1].displayText = displayText;
          self.displayTextloaded = true;
        }
      });
    }
  }

  showBreadcrumbItem(item: ONavigationItem): boolean {
    return this.displayTextloaded && item.terminal;
  }

  isNotInsideFormLayoutManager(item: ONavigationItem, index: number): boolean {
    const previousItem: ONavigationItem = this.breadcrumbs[index - 1];
    return (previousItem && previousItem.isMainFormLayoutManagerComponent());
  }

  protected isTerminal(route: ActivatedRouteSnapshot) {
    return route.firstChild === null || route.firstChild.routeConfig === null;
  }

  ngOnDestroy() {
    if (this.onDataLoadedSubscription) {
      this.onDataLoadedSubscription.unsubscribe();
    }
    if (this.navigationServiceSubscription) {
      this.navigationServiceSubscription.unsubscribe();
    }
  }

  onRouteClick(route) {
    let extras = {};
    if (route.queryParams) {
      extras[Codes.QUERY_PARAMS] = route.queryParams;
    }
    this.router.navigate([route.url], extras);
  }

  get displayTextloaded(): boolean {
    return this._displayTextloaded;
  }

  set displayTextloaded(arg: boolean) {
    this._displayTextloaded = arg;
  }
}

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [OBreadcrumbComponent],
  declarations: [OBreadcrumbComponent]
})
export class OBreadcrumbModule { }
