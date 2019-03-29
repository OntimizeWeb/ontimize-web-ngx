import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  NgModule,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SkipSelf,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router, RouterModule } from '@angular/router';

import { OListComponent } from '../../components/list/o-list.component';
import { OServiceComponent } from '../../components/o-service-component.class';
import { OTableComponent } from '../../components/table/o-table.component';
import { InputConverter } from '../../decorators';
import { ILocalStorageComponent, LocalStorageService } from '../../services/local-storage.service';
import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { OSharedModule } from '../../shared';
import { Util } from '../../utils';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
import { NavigationService } from '../../services/navigation.service';

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
  insertionMode?: boolean;
}

export const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
  'oattr: attr',
  'mode',
  'labelColumns: label-columns',
  'separator',
  'title',
  'storeState: store-state',
  // attr of the child form from which the data for building the tab title will be obtained
  'titleDataOrigin: title-data-origin',
  'dialogWidth: dialog-width',
  'dialogMinWidth: dialog-min-width',
  'dialogMaxWidth: dialog-max-width',
  'dialogHeight: dialog-height',
  'dialogMinHeight: dialog-min-height',
  'dialogMaxHeight dialog-max-height',
  'dialogClass: dialog-class'
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

  public oattr: string;
  public mode: string;
  public labelColumns: string;
  public separator: string = ' ';
  public title: string;
  @InputConverter()
  public storeState: boolean = true;
  public titleDataOrigin: string;
  public dialogWidth: string;
  public dialogMinWidth: string;
  public dialogMaxWidth: string;
  public dialogHeight: string;
  public dialogMinHeight: string;
  public dialogMaxHeight: string;
  public dialogClass: string = '';

  @ViewChild('tabGroup')
  public oTabGroup: OFormLayoutTabGroupComponent;
  public dialogRef: MatDialogRef<OFormLayoutDialogComponent>;

  public onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
  public onCloseTab: EventEmitter<any> = new EventEmitter<any>();

  protected labelColsArray: string[] = [];

  protected translateService: OTranslateService;
  protected oFormLayoutManagerService: OFormLayoutManagerService;
  protected localStorageService: LocalStorageService;
  protected onRouteChangeStorageSubscribe: any;

  @ContentChildren(OTableComponent, { descendants: true })
  protected tableComponents: QueryList<OTableComponent>;

  @ContentChildren(OListComponent, { descendants: true })
  protected listComponents: QueryList<OListComponent>;

  protected addingGuard: boolean = false;

  public navigationService: NavigationService;

  public markForUpdate: boolean = false;
  public onTriggerUpdate: EventEmitter<any> = new EventEmitter<any>();

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
    this.navigationService = this.injector.get(NavigationService);
  }

  public ngOnInit(): void {
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

  public ngAfterViewInit(): void {
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }
    if (this.storeState && this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      const state = this.localStorageService.getComponentStorage(this, false);
      this.oTabGroup.initializeComponentState(state);
    }
  }

  public ngOnDestroy(): void {
    this.updateStateStorage();
    this.oFormLayoutManagerService.removeFormLayoutManager(this);
    this.destroyAactivateChildGuard();
  }

  public getAttribute(): string {
    return this.oattr;
  }

  public getComponentKey(): string {
    return 'OFormLayoutManagerComponent_' + this.oattr;
  }

  public getDataToStore(): Object {
    // only storing in tab mode
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      return this.oTabGroup.getDataToStore();
    }
    return {};
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler(event): void {
    this.updateStateStorage();
  }

  public getLabelFromUrlParams(urlParams: Object): string {
    let label = '';
    const keys = Object.keys(urlParams);
    keys.forEach((param, i) => {
      label += urlParams[param] + ((i < keys.length - 1) ? this.separator : '');
    });
    return label;
  }

  public addActivateChildGuard(): void {
    const routeConfig = this.getParentActRouteRoute();
    if (Util.isDefined(routeConfig)) {
      const canActivateChildArray = (routeConfig.canActivateChild || []);
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

  public destroyAactivateChildGuard(): void {
    if (!this.addingGuard) {
      return;
    }
    const routeConfig = this.getParentActRouteRoute();
    if (Util.isDefined(routeConfig)) {
      for (let i = (routeConfig.canActivateChild || []).length - 1; i >= 0; i--) {
        if (routeConfig.canActivateChild[i].name === OFormLayoutManagerComponent.guardClassName) {
          routeConfig.canActivateChild.splice(i, 1);
          break;
        }
      }
    }
  }

  public isDialogMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.DIALOG_MODE;
  }

  public isTabMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.TAB_MODE;
  }

  public addDetailComponent(childRoute: ActivatedRouteSnapshot, url: string): void {
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

  public closeDetail(id?: string): void {
    if (this.isTabMode()) {
      this.oTabGroup.onCloseTab(id);
    } else if (this.isDialogMode()) {
      this.dialogRef.close();
      this.reloadMainComponents();
    }
  }

  public openFormLayoutDialog(detailComp: IDetailComponentData): void {
    const cssclass = ['o-form-layout-dialog-overlay'];
    if (this.dialogClass) {
      cssclass.push(this.dialogClass);
    }
    const dialogConfig: MatDialogConfig = {
      panelClass: cssclass,
      disableClose: true,
      data: {
        data: detailComp,
        layoutManagerComponent: this,
        title: this.title
      }
    };
    if (this.dialogWidth) {
      dialogConfig.width = this.dialogWidth;
    }
    if (this.dialogMinWidth) {
      dialogConfig.minWidth = this.dialogMinWidth;
    }
    if (this.dialogMaxWidth) {
      dialogConfig.maxWidth = this.dialogMaxWidth;
    }
    if (this.dialogHeight) {
      dialogConfig.height = this.dialogHeight;
    }
    if (this.dialogMinHeight) {
      dialogConfig.minHeight = this.dialogMinHeight;
    }
    if (this.dialogMaxHeight) {
      dialogConfig.maxHeight = this.dialogMaxHeight;
    }
    this.dialogRef = this.dialog.open(OFormLayoutDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(() => {
      this.updateIfNeeded();
    });
  }

  public getFormCacheData(formId: string): IDetailComponentData {
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      return this.oTabGroup.getFormCacheData(formId);
    } else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
      return this.dialogRef.componentInstance.data;
    }
    return undefined;
  }

  public getLastTabId(): string {
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      return this.oTabGroup.getLastTabId();
    }
    return undefined;
  }

  public setModifiedState(modified: boolean, id: string): void {
    if (this.isTabMode()) {
      this.oTabGroup.setModifiedState(modified, id);
    }
  }

  public getLabelFromData(data: any): string {
    let label = '';
    const isDataDefined = Util.isDefined(data);
    if (isDataDefined && data.hasOwnProperty('new_tab_title')) {
      label = this.translateService.get(data['new_tab_title']);
    } else if (isDataDefined && this.labelColsArray.length !== 0) {
      this.labelColsArray.forEach((col, idx) => {
        if (data[col] !== undefined) {
          label += data[col] + ((idx < this.labelColsArray.length - 1) ? this.separator : '');
        }
      });
    }
    return label;
  }

  public updateNavigation(data: any, id: string, insertionMode?: boolean): void {
    if (this.isTabMode()) {
      this.oTabGroup.updateNavigation(data, id, insertionMode);
    } else if (this.isDialogMode()) {
      this.dialogRef.componentInstance.updateNavigation(data, id);
    }
  }

  public updateActiveData(data: any) {
    if (this.isTabMode()) {
      this.oTabGroup.updateActiveData(data);
    } else if (this.isDialogMode()) {
      this.dialogRef.componentInstance.updateActiveData(data);
    }
  }

  public getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.isTabMode()) {
      route = this.oTabGroup.getRouteOfActiveItem();
    } else if (this.isDialogMode()) {
      route = this.dialogRef.componentInstance.getRouteOfActiveItem();
    }
    return route;
  }

  public isMainComponent(comp: OServiceComponent): boolean {
    const table = this.tableComponents.find(tableComp => tableComp === comp);
    if (Util.isDefined(table)) {
      return true;
    }
    const list = this.listComponents.find(listComp => listComp === comp);
    if (Util.isDefined(list)) {
      return true;
    }
    return false;
  }

  public getRouteForComponent(comp: OServiceComponent): any[] {
    const result = [];
    if (this.parentFormLayoutManager) {
      const parentRoute = this.parentFormLayoutManager.getRouteForComponent(comp);
      if (parentRoute && parentRoute.length > 0) {
        result.push(...parentRoute);
      }
    }
    if (!this.isMainComponent(comp)) {
      const activeRoute = this.getRouteOfActiveItem();
      if (activeRoute && activeRoute.length > 0) {
        result.push(...activeRoute);
      }
    }
    return result;
  }

  public setAsActiveFormLayoutManager(): void {
    this.oFormLayoutManagerService.activeFormLayoutManager = this;
  }

  public reloadMainComponents(): void {
    this.tableComponents.forEach((tableComp: OTableComponent) => {
      tableComp.reloadData();
    });
    this.listComponents.forEach((listComp: OListComponent) => {
      listComp.reloadData();
    });
  }

  public allowToUpdateNavigation(formAttr: string): boolean {
    return (this.isTabMode() && Util.isDefined(this.titleDataOrigin)) ?
      this.titleDataOrigin === formAttr :
      true;
  }

  protected updateStateStorage(): void {
    if (this.localStorageService && this.isTabMode() && this.storeState) {
      this.localStorageService.updateComponentStorage(this, false);
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

  public updateIfNeeded() {
    if (this.markForUpdate) {
      this.markForUpdate = false;
      this.onTriggerUpdate.emit();
    }
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
