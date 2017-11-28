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
  AfterViewInit,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { RouterModule, Router, ActivatedRoute, ActivatedRouteSnapshot, Route } from '@angular/router';
import { MdDialog, MdTabGroup, MdDialogRef } from '@angular/material';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../shared';
import { Util } from '../../util/util';

import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';


export interface IDetailComponentData {
  urlParams: any;
  queryParams: any;
  urlSegments: any;
  index: number;
  component: any;
  label: string;
}

export const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
  'mode',
  'labelColumns: label-columns',
  'separator'
];

export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = [
  'onMainTabSelected'
];

@Component({
  selector: 'o-form-layout-manager',
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER,
  outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER,
  templateUrl: './o-form-layout-manager.component.html',
  styleUrls: ['./o-form-layout-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  protected labelColumns: string;
  protected separator: string = ' ';

  protected labelColsArray: string[] = [];

  tabsCache: IDetailComponentData[] = [];
  dialogRef: MdDialogRef<OFormLayoutDialogComponent>;

  protected oFormLayoutManagerService: OFormLayoutManagerService;
  private _ignoreTabsDirectivesChange: boolean = false;
  @ViewChild('tabGroup') tabGroup: MdTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
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
    this.labelColsArray = Util.parseArray(this.labelColumns);
    this.addActivateChildGuard();
  }

  ngAfterViewInit() {
    this.tabsDirectives.changes.subscribe(changes => {
      if (this.tabsDirectives.length && !this._ignoreTabsDirectivesChange) {
        const tabItem = this.tabsDirectives.last;
        const tabData = this.tabsCache[tabItem.index];
        if (tabData) {
          this.createTabComponent(tabData, tabItem);
        }
      } else if (this._ignoreTabsDirectivesChange) {
        this._ignoreTabsDirectivesChange = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroyAactivateChildGuard();
  }

  onTabSelectChange() {
    if (this.tabGroup.selectedIndex === 0) {
      this.onMainTabSelected.emit();
    }
  }

  protected getLabelFromUrlParams(urlParams: Object): string {
    let label = '';
    const keys = Object.keys(urlParams);
    keys.forEach((param, i) => {
      label += urlParams[param] + ((i < keys.length - 1) ? this.separator : '');
    });
    return label;
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
    this.tabsCache.forEach(comp => {
      const currParams = comp.urlParams || {};
      Object.keys(currParams).forEach(key => {
        addNewComp = addNewComp && (currParams[key] !== newCompParams[key]);
      });
    });
    if (addNewComp) {
      if (this.isDialogMode()) {
        this.openFormLayoutDialog(childRoute);
      } else if (this.isTabMode()) {
        const newDetailComp: IDetailComponentData = {
          urlParams: childRoute.params,
          queryParams: childRoute.queryParams,
          urlSegments: childRoute.url,
          component: childRoute.routeConfig.component,
          index: this.tabsCache.length,
          label: this.getLabelFromUrlParams(childRoute.params)
        };
        this.tabsCache.push(newDetailComp);
      }
    } else {
      this.reloadDetailComponent(childRoute);
    }
  }

  reloadDetailComponent(childRoute: ActivatedRouteSnapshot) {
    if (this.isTabMode()) {
      let compIndex = -1;
      const compParams = childRoute.params;
      this.tabsCache.forEach((comp, i) => {
        const currParams = comp.urlParams || {};
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

  closeDetail(index?: number) {
    if (this.isTabMode()) {
      this.onCloseTab(index);
    } else if (this.isDialogMode()) {
      this.dialogRef.close();
    }
  }

  onCloseTab(index: number) {
    this._ignoreTabsDirectivesChange = true;
    this.tabsCache.splice(index, 1);
  }

  createTabComponent(tabData: IDetailComponentData, content: OFormLayoutManagerContentDirective) {
    const component = tabData.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();
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
    const dialogConfig = {
      panelClass: 'o-form-layout-dialog-overlay',
      disableClose: true,
      data: {
        childRoute: childRoute,
        layoutManagerComponent: this
      }
    };
    this.dialogRef = this.dialog.open(OFormLayoutDialogComponent, dialogConfig);
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
        urlSegments: this.dialogRef.componentInstance.urlSegments,
        label: this.getLabelFromUrlParams(this.dialogRef.componentInstance.urlParams),
        index: -1,
        component: undefined
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

  updateNavigation(index: number, data: Object) {
    let label = '';
    if (this.labelColsArray.length === 0 && data !== undefined) {
      this.labelColsArray.forEach((col, idx) => {
        label += data[col] + ((idx < this.labelColsArray.length - 1) ? this.separator : '');
      });
    }
    if (this.isTabMode()) {
      this.tabGroup.selectedIndex = (index + 1);
      if (label.length) {
        this.tabsCache[index].label = label;
      }
    }
  }

  getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.isTabMode() && this.tabsCache.length && this.tabGroup.selectedIndex > 0) {
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
