import { Component, NgModule, ViewEncapsulation, OnInit, OnDestroy, Injector, ComponentFactoryResolver, ViewContainerRef, ViewChild, EventEmitter } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, ActivatedRouteSnapshot, Route } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared';
import { Util } from '../../util/util';

import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
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
  'separator',
  'title'
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
  host: {
    '[class.o-form-layout-manager]': 'true'
  }
})

export class OFormLayoutManagerComponent implements OnInit, OnDestroy {

  public static guardClassName = 'CanActivateFormLayoutChildGuard';

  public static DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER;
  public static DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER;

  public static DIALOG_MODE = 'dialog';
  public static TAB_MODE = 'tab';

  mode: string;
  protected labelColumns: string;
  protected separator: string = ' ';
  title: string;

  protected labelColsArray: string[] = [];

  protected oFormLayoutManagerService: OFormLayoutManagerService;

  @ViewChild('tabGroup') oTabGroup: OFormLayoutTabGroupComponent;
  dialogRef: MdDialogRef<OFormLayoutDialogComponent>;

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

  ngOnDestroy() {
    this.destroyAactivateChildGuard();
  }

  getLabelFromUrlParams(urlParams: Object): string {
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
    const newDetailComp: IDetailComponentData = {
      urlParams: childRoute.params,
      queryParams: childRoute.queryParams,
      urlSegments: childRoute.url,
      component: childRoute.routeConfig.component,
      index: -1,
      label: ''
    };
    if (this.isTabMode()) {
      this.oTabGroup.addTab(newDetailComp);
    } else if (this.isDialogMode()) {
      this.openFormLayoutDialog(newDetailComp);
    }
  }

  closeDetail(index?: number) {
    if (this.isTabMode()) {
      this.oTabGroup.onCloseTab(index);
    } else if (this.isDialogMode()) {
      this.dialogRef.close();
    }
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

  openFormLayoutDialog(detailComp: IDetailComponentData) {
    const dialogConfig = {
      panelClass: 'o-form-layout-dialog-overlay',
      disableClose: true,
      data: {
        data: detailComp,
        layoutManagerComponent: this,
        title: this.title
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
      return this.oTabGroup.getFormCacheData(formIndex);
    } else if (this.isDialogMode()) {
      return this.dialogRef.componentInstance.data;
    }
    return undefined;
  }

  getLastTabIndex(): number {
    if (this.isTabMode()) {
      return this.oTabGroup.getLastTabIndex();
    }
    return undefined;
  }

  updateNavigation(index: number, data: any) {
    let label = '';
    if (this.labelColsArray.length !== 0 && data !== undefined) {
      this.labelColsArray.forEach((col, idx) => {
        if (data[col] !== undefined) {
          label += data[col] + ((idx < this.labelColsArray.length - 1) ? this.separator : '');
        }
      });
    }

    if (this.isTabMode()) {
      this.oTabGroup.updateNavigation(index, label);
    } else if (this.isDialogMode()) {
      this.dialogRef.componentInstance.setLabel(label);
    }
  }

  getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.isTabMode()) {
      route = this.oTabGroup.getRouteOfActiveItem();
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
    OFormLayoutTabGroupComponent,
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
