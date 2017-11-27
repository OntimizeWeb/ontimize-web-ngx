import {
  Component,
  NgModule,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  Injector,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { RouterModule, Router, ActivatedRoute, ActivatedRouteSnapshot, Route } from '@angular/router';
import { MdDialog, MdTabGroup, MdDialogRef } from '@angular/material';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../shared';

import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';

import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';

export interface IDetailComponentData {
  urlParams: any;
  queryParams: any;
  index: number;
}

export const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
  'mode'
];
export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER: any[] = [];

@Component({
  selector: 'o-form-layout-manager',
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER,
  outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER,
  templateUrl: './o-form-layout-manager.component.html',
  styleUrls: ['./o-form-layout-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-manager]': 'true'
  }
})

export class OFormLayoutManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  public static guardClassName = 'CanActivateFormLayoutChildGuard';

  public static DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER;
  public static DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER;

  public static DIALOG_MODE = 'dialog';
  public static TAB_MODE = 'tab';

  mode: string;
  detailComponentsData: any[] = [];
  tabsCache: IDetailComponentData[] = [];

  dialogRef: MdDialogRef<OFormLayoutDialogComponent>;

  protected oFormLayoutManagerService: OFormLayoutManagerService;

  @ViewChild('tabGroup') tabGroup: MdTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected actRoute: ActivatedRoute,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected location: ViewContainerRef,
    protected dialog: MdDialog
  ) {
    this.oFormLayoutManagerService = this.injector.get(OFormLayoutManagerService);
    this.oFormLayoutManagerService.setFormLayoutManager(this);
  }

  ngOnInit() {
    const availableModeValues = [OFormLayoutManagerComponent.DIALOG_MODE, OFormLayoutManagerComponent.TAB_MODE];
    this.mode = (this.mode || '').toLowerCase();
    if (availableModeValues.indexOf(this.mode) === -1) {
      this.mode = OFormLayoutManagerComponent.DIALOG_MODE;
    }
    this.addActivateChildGuard();
  }

  ngAfterViewInit() {
    this.tabsDirectives.changes.subscribe(changes => {
      const tabItem = this.tabsDirectives.last;
      const tabData = this.detailComponentsData[this.detailComponentsData.length - 1];
      if (tabData) {
        this.createTabComponent(tabData.childRoute, tabItem);
      }
    });
  }

  ngOnDestroy() {
    this.destroyAactivateChildGuard();
  }

  addActivateChildGuard() {
    let routeConfig = this.getParentActRouteRoute();

    let canActivateChildArray = (routeConfig.canActivateChild || []);
    let previouslyAdded = false;
    for (let i = 0, len = canActivateChildArray.length; i < len; i++) {
      previouslyAdded = (canActivateChildArray[i].name === OFormLayoutManagerComponent.guardClassName);
      if (previouslyAdded) {
        break;
      }
    }
    if (!previouslyAdded) {
      canActivateChildArray.push(CanActivateFormLayoutChildGuard);
      routeConfig.canActivateChild = canActivateChildArray;
      this.router.resetConfig(this.router.config);
    }
  }

  destroyAactivateChildGuard() {
    let routeConfig = this.getParentActRouteRoute();
    // this.activateChildGuard.setFormLayoutManager(undefined);
    for (let i = (routeConfig.canActivateChild || []).length - 1; i >= 0; i--) {
      if (routeConfig.canActivateChild[i].name === OFormLayoutManagerComponent.guardClassName) {
        routeConfig.canActivateChild.splice(i, 1);
        break;
      }
    }
    this.router.resetConfig(this.router.config);
  }

  isDialogMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.DIALOG_MODE;
  }

  isTabMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.TAB_MODE;
  }

  addDetailComponent(childRoute: ActivatedRouteSnapshot) {
    let addNewComp = true;
    const newCompParams = childRoute.params;
    this.detailComponentsData.forEach(comp => {
      const currParams = comp.childRoute.params || {};
      Object.keys(currParams).forEach(key => {
        addNewComp = addNewComp && (currParams[key] !== newCompParams[key]);
      });
    });
    if (addNewComp) {
      if (this.isDialogMode()) {
        this.openFormLayoutDialog(childRoute);
      } else if (this.isTabMode()) {
        this.detailComponentsData.push({
          childRoute: childRoute
        });
      }
    } else {
      this.reloadDetailComponent(childRoute);
    }
  }

  reloadDetailComponent(childRoute: ActivatedRouteSnapshot) {
    if (this.isTabMode()) {
      let compIndex = -1;
      const compParams = childRoute.params;
      this.detailComponentsData.forEach((comp, i) => {
        const currParams = comp.childRoute.params || {};
        let sameParams = true;
        Object.keys(currParams).forEach(key => {
          sameParams = sameParams && (currParams[key] === compParams[key]);
        });
        if (sameParams) {
          compIndex = i;
        }
      });

      if (compIndex >= 0) {
        this.tabGroup.selectedIndex = (compIndex + 1);
      }
    }
  }

  onCloseTab(index: number) {
    this.detailComponentsData.splice(index, 1);
  }

  createTabComponent(activatedRouteSnapshot: ActivatedRouteSnapshot, content: OFormLayoutManagerContentDirective) {
    const component = activatedRouteSnapshot.routeConfig.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    let viewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();

    const newDetailComp: IDetailComponentData = {
      urlParams: activatedRouteSnapshot.params,
      queryParams: activatedRouteSnapshot.queryParams,
      index: content.index
    };
    this.tabsCache.push(newDetailComp);
    // this.tabGroup.selectedIndex = (tabItem.index + 1);
    viewContainerRef.createComponent(componentFactory);
  }

  private getParentActRouteRoute(): Route {
    let actRoute = this.actRoute;
    while (actRoute.parent !== undefined && actRoute.parent !== null) {
      if (actRoute.routeConfig.children || actRoute.routeConfig.loadChildren) {
        break;
      }
      actRoute = actRoute.parent;
    }
    return actRoute.routeConfig;
  }

  openFormLayoutDialog(childRoute: ActivatedRouteSnapshot) {
    this.dialogRef = this.dialog.open(OFormLayoutDialogComponent, {
      data: {
        childRoute: childRoute,
        layoutManagerComponent: this
      },
      disableClose: true
    });
    // const self = this;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO
      }
    });
  }

  getFormCacheData(formIndex: number): IDetailComponentData {
    if (this.isTabMode()) {
      return this.tabsCache.filter(cacheItem => cacheItem.index === formIndex)[0];
    } else if (this.isDialogMode()) {
      return {
        urlParams: this.dialogRef.componentInstance.urlParams,
        queryParams: this.dialogRef.componentInstance.queryParams,
        index: -1
      };
    }
    return undefined;
  }

  getLastTabIndex(): number {
    if (this.isTabMode()) {
      return this.tabsCache.length > 0 ? this.tabsCache[this.tabsCache.length - 1].index : undefined;
    }
    return undefined;
  }

  updateNavigation(index: number) {
    if (this.isTabMode()) {
      this.tabGroup.selectedIndex = (index + 1);
    }
  }

  getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.isTabMode()) {
      const urlParams = this.tabsCache[this.tabGroup.selectedIndex].urlParams || [];
      Object.keys(urlParams).forEach(key => {
        route.push(urlParams[key]);
      });
    }
    return route;
  }

}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    RouterModule
  ],
  declarations: [
    OFormLayoutManagerComponent,
    OFormLayoutDialogComponent,
    OFormLayoutManagerContentDirective
  ],
  exports: [OFormLayoutManagerComponent],
  entryComponents: [OFormLayoutDialogComponent],
  providers: [{
    provide: CanActivateFormLayoutChildGuard,
    useClass: CanActivateFormLayoutChildGuard
  }]
})
export class OFormLayoutManagerModule { }
