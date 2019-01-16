import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Injector, NgModule, OnInit, OnDestroy, ViewChild, ContentChildren, QueryList, HostListener, Optional, SkipSelf } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CommonModule } from '@angular/common';

import { InputConverter } from '../../decorators';
import { OSharedModule } from '../../shared';
import { Util } from '../../utils';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { ILocalStorageComponent, LocalStorageService } from '../../services/local-storage.service';
import { OTableComponent } from '../../components/table/o-table.component';
import { OListComponent } from '../../components/list/o-list.component';
import { OServiceComponent } from '../../components/o-service-component.class';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';

export interface IDetailComponentData {
  params: any;
  queryParams: any;
  urlSegments: any;
  id: string;
  component: any;
  label: string;
  modified: boolean;
  url: string;
  rendered?: boolean;
}

export const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
  'oattr: attr',
  'mode',
  'labelColumns: label-columns',
  'separator',
  'title',
  'storeState: store-state',
  // attr of the child form from which the data for building the tab title will be obtained
  'titleDataOrigin: title-data-origin'
];

export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = [
  'onMainTabSelected',
  'onCloseTab'
];

@Component({
  moduleId: module.id,
  selector: 'o-form-layout-manager',
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER,
  outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER,
  templateUrl: './o-form-layout-manager.component.html',
  host: {
    '[class.o-form-layout-manager]': 'true'
  }
})
export class OFormLayoutManagerComponent implements AfterViewInit, OnInit, OnDestroy, ILocalStorageComponent {

  public static guardClassName = 'CanActivateFormLayoutChildGuard';

  public static DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER;
  public static DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER;

  public static DIALOG_MODE = 'dialog';
  public static TAB_MODE = 'tab';

  oattr: string;
  mode: string;
  labelColumns: string;
  separator: string = ' ';
  title: string;
  @InputConverter()
  storeState: boolean = true;
  titleDataOrigin: string;

  protected labelColsArray: string[] = [];

  protected translateService: OTranslateService;
  protected oFormLayoutManagerService: OFormLayoutManagerService;
  protected localStorageService: LocalStorageService;
  protected onRouteChangeStorageSubscribe: any;

  @ViewChild('tabGroup') oTabGroup: OFormLayoutTabGroupComponent;
  dialogRef: MatDialogRef<OFormLayoutDialogComponent>;

  onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
  onCloseTab: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(OTableComponent, { descendants: true })
  protected tableComponents: QueryList<OTableComponent>;

  @ContentChildren(OListComponent, { descendants: true })
  protected listComponents: QueryList<OListComponent>;

  protected addingGuard: boolean = false;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected actRoute: ActivatedRoute,
    protected dialog: MatDialog,
    protected elRef: ElementRef,
    @SkipSelf() @Optional()
    public parentFormLayoutManager: OFormLayoutManagerComponent
  ) {
    this.oFormLayoutManagerService = this.injector.get(OFormLayoutManagerService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    const availableModeValues = [OFormLayoutManagerComponent.DIALOG_MODE, OFormLayoutManagerComponent.TAB_MODE];
    this.mode = (this.mode || '').toLowerCase();
    if (availableModeValues.indexOf(this.mode) === -1) {
      this.mode = OFormLayoutManagerComponent.DIALOG_MODE;
    }
    this.labelColsArray = Util.parseArray(this.labelColumns);
    this.addActivateChildGuard();
    if (!Util.isDefined(this.oattr)) {
      this.oattr = this.title + this.mode;
      console.warn('o-form-layout-manager must have an unique attr');
    }
    this.oFormLayoutManagerService.registerFormLayoutManager(this);
  }

  ngAfterViewInit(): void {
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }
    if (this.storeState && this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      var state = this.localStorageService.getComponentStorage(this, false);
      this.oTabGroup.initializeComponentState(state);
    }
  }

  ngOnDestroy() {
    this.updateStateStorage();
    this.oFormLayoutManagerService.removeFormLayoutManager(this);
    this.destroyAactivateChildGuard();
  }

  getAttribute() {
    return this.oattr;
  }

  getComponentKey(): string {
    return 'OFormLayoutManagerComponent_' + this.oattr;
  }

  getDataToStore(): Object {
    // only storing in tab mode
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      return this.oTabGroup.getDataToStore();
    }
    return {};
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.updateStateStorage();
  }

  protected updateStateStorage() {
    if (this.localStorageService && this.isTabMode() && this.storeState) {
      this.localStorageService.updateComponentStorage(this, false);
    }
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
    if (Util.isDefined(routeConfig)) {
      let canActivateChildArray = (routeConfig.canActivateChild || []);
      let previouslyAdded = false;
      for (let i = 0, len = canActivateChildArray.length; i < len; i++) {
        previouslyAdded = (canActivateChildArray[i].name === OFormLayoutManagerComponent.guardClassName);
        if (previouslyAdded) {
          break;
        }
      }
      if (!previouslyAdded) {
        this.addingGuard = true;
        canActivateChildArray.push(CanActivateFormLayoutChildGuard);
        routeConfig.canActivateChild = canActivateChildArray;
      }
    }
  }

  destroyAactivateChildGuard() {
    if (!this.addingGuard) {
      return;
    }
    let routeConfig = this.getParentActRouteRoute();
    if (Util.isDefined(routeConfig)) {
      for (let i = (routeConfig.canActivateChild || []).length - 1; i >= 0; i--) {
        if (routeConfig.canActivateChild[i].name === OFormLayoutManagerComponent.guardClassName) {
          routeConfig.canActivateChild.splice(i, 1);
          break;
        }
      }
    }
  }

  isDialogMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.DIALOG_MODE;
  }

  isTabMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.TAB_MODE;
  }

  addDetailComponent(childRoute: ActivatedRouteSnapshot, url: string) {
    const newDetailComp: IDetailComponentData = {
      params: childRoute.params,
      queryParams: childRoute.queryParams,
      urlSegments: childRoute.url,
      component: childRoute.routeConfig.component,
      url: url,
      id: Math.random().toString(36),
      label: '',
      modified: false
    };
    if (this.isTabMode()) {
      this.oTabGroup.addTab(newDetailComp);
    } else if (this.isDialogMode()) {
      this.openFormLayoutDialog(newDetailComp);
    }
  }

  closeDetail(id?: string) {
    if (this.isTabMode()) {
      this.oTabGroup.onCloseTab(id);
    } else if (this.isDialogMode()) {
      this.dialogRef.close();
      this.reloadMainComponents();
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
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO
      }
    });
  }

  getFormCacheData(formId: string): IDetailComponentData {
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      return this.oTabGroup.getFormCacheData(formId);
    } else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
      return this.dialogRef.componentInstance.data;
    }
    return undefined;
  }

  getLastTabId(): string {
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      return this.oTabGroup.getLastTabId();
    }
    return undefined;
  }

  setModifiedState(modified: boolean, id: string) {
    if (this.isTabMode()) {
      this.oTabGroup.setModifiedState(modified, id);
    }
  }

  getLabelFromData(data: any): string {
    // data === undefined means that inner form is in insertion mode
    let label = '';
    if (!Util.isDefined(data)) {
      label = this.translateService.get('LAYOUT_MANANGER.INSERTION_MODE_TITLE');
    } else if (this.labelColsArray.length !== 0) {
      this.labelColsArray.forEach((col, idx) => {
        if (data[col] !== undefined) {
          label += data[col] + ((idx < this.labelColsArray.length - 1) ? this.separator : '');
        }
      });
    }
    return label;
  }

  updateNavigation(data: any, id: string) {
    if (this.isTabMode()) {
      this.oTabGroup.updateNavigation(data, id);
    } else if (this.isDialogMode()) {
      this.dialogRef.componentInstance.updateNavigation(data, id);
    }
  }

  getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.isTabMode()) {
      route = this.oTabGroup.getRouteOfActiveItem();
    } else if (this.isDialogMode()) {
      route = this.dialogRef.componentInstance.getRouteOfActiveItem();
    }
    return route;
  }

  isMainComponent(comp: OServiceComponent): boolean {
    const table = this.tableComponents.find((tableComp) => tableComp === comp);
    if (Util.isDefined(table)) {
      return true;
    }
    const list = this.listComponents.find((listComp) => listComp === comp);
    if (Util.isDefined(list)) {
      return true;
    }
    return false;
  }

  getRouteForComponent(comp: OServiceComponent): any[] {
    let result = [];
    if (this.parentFormLayoutManager) {
      var parentRoute = this.parentFormLayoutManager.getRouteForComponent(comp);
      if (parentRoute && parentRoute.length > 0) {
        result.push(...parentRoute);
      }
    }
    if (!this.isMainComponent(comp)) {
      var activeRoute = this.getRouteOfActiveItem();
      if (activeRoute && activeRoute.length > 0) {
        result.push(...activeRoute);
      }
    }
    return result;
  }

  setAsActiveFormLayoutManager() {
    this.oFormLayoutManagerService.activeFormLayoutManager = this;
  }

  reloadMainComponents() {
    this.tableComponents.forEach((tableComp: OTableComponent) => {
      tableComp.reloadData();
    });
    this.listComponents.forEach((listComp: OListComponent) => {
      listComp.reloadData();
    });
  }

  allowToUpdateNavigation(formAttr: string): boolean {
    return (this.isTabMode() && Util.isDefined(this.titleDataOrigin)) ?
      this.titleDataOrigin === formAttr :
      true;
  }
}

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule],
  declarations: [
    OFormLayoutDialogComponent,
    OFormLayoutManagerComponent,
    OFormLayoutTabGroupComponent,
    OFormLayoutManagerContentDirective
  ],
  exports: [OFormLayoutManagerComponent],
  entryComponents: [OFormLayoutDialogComponent],
  providers: [{
    provide: CanActivateFormLayoutChildGuard,
    useClass: CanActivateFormLayoutChildGuard
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OFormLayoutManagerModule { }
