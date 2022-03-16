import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { ILayoutManagerComponent } from '../../interfaces/layout-manager-component.interface';
import { ILocalStorageComponent } from '../../interfaces/local-storage-component.interface';
import { OFormLayoutManagerMode } from '../../interfaces/o-form-layout-manager-mode.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { NavigationService } from '../../services/navigation.service';
import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { AbstractComponentStateService } from '../../services/state/o-component-state.service';
import { OFormLayoutManagerComponentStateClass } from '../../services/state/o-form-layout-manager-component-state.class';
import { OFormLayoutManagerComponentStateService } from '../../services/state/o-form-layout-manager-component-state.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import {
  FormLayoutCloseDetailOptions,
  FormLayoutDetailComponentData
} from '../../types/form-layout-detail-component-data.type';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
  'oattr: attr',
  'mode',
  'storeState: store-state',

  // Common for dialog and tab mode
  // deprecated, only mantained for legacy reasons
  'title',
  'labelColumns: label-columns',
  'separator',

  // attr of the child form from which the data for building the tab title will be obtained (only in tab mode)
  // deprecated, only mantained for legacy reasons
  'titleDataOrigin: title-data-origin',

  // Only dialog options configurable as an input of the o-form-layout-manager (use the o-form-layout-dialog-options directive)
  // deprecated, only mantained for legacy reasons
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
  'onSelectedTabChange',
  'onCloseTab'
];

@Component({
  selector: 'o-form-layout-manager',
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER,
  outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER,
  templateUrl: './o-form-layout-manager.component.html',
  styleUrls: ['./o-form-layout-manager.component.scss'],
  providers: [
    { provide: AbstractComponentStateService, useClass: OFormLayoutManagerComponentStateService, deps: [Injector] }
  ],
  host: {
    '[class.o-form-layout-manager]': 'true'
  }
}) export class OFormLayoutManagerComponent implements AfterViewInit, OnInit, OnDestroy, ILocalStorageComponent {

  // declaring this property to have acces to static members in the template
  OFormLayoutManagerComponent = OFormLayoutManagerComponent;

  public static guardClassName = 'CanActivateFormLayoutChildGuard';

  public static DIALOG_MODE = 'dialog';
  public static TAB_MODE = 'tab';
  public static SPLIT_PANE_MODE = 'split-pane';

  public oattr: string;
  public _mode: string = OFormLayoutManagerComponent.DIALOG_MODE;

  public get mode(): string {
    return this._mode;
  }

  public set mode(value: string) {
    const availableModeValues = [OFormLayoutManagerComponent.DIALOG_MODE, OFormLayoutManagerComponent.TAB_MODE, OFormLayoutManagerComponent.SPLIT_PANE_MODE];
    this._mode = (value || '').toLowerCase();
    if (availableModeValues.indexOf(this._mode) === -1) {
      this._mode = OFormLayoutManagerComponent.DIALOG_MODE;
    }
  }

  protected _separator: string = ' ';

  /**
  * @deprecated user should use the options input
  */
  set separator(value: string) {
    this._separator = value;
  }

  get separator(): string {
    return this._separator;
  }

  /**
   * @deprecated user should use the options input
   */
  public title: string;

  @InputConverter()
  public storeState: boolean = true;

  /**
  * @deprecated user should use the options input
  */
  public titleDataOrigin: string;

  /**
   * @deprecated The next inputs are deprecated and user should use the OFormLayoutDialogOptionsDirective inputs
   */
  public dialogWidth: string;
  public dialogMinWidth: string;
  public dialogMaxWidth: string;
  public dialogHeight: string;
  public dialogMinHeight: string;
  public dialogMaxHeight: string;
  public dialogClass: string = '';

  @ViewChild('tabGroup', { static: false })
  public oTabGroup: OFormLayoutManagerMode;
  public dialogRef: MatDialogRef<OFormLayoutDialogComponent>;
  @ViewChild('splitPane', { static: false })
  public oSplitPane: OFormLayoutManagerMode;

  public onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
  public onSelectedTabChange: EventEmitter<any> = new EventEmitter<any>();
  public onCloseTab: EventEmitter<any> = new EventEmitter<any>();

  protected _labelColumns: string;

  get labelColumns(): string {
    return this._labelColumns;
  }

  /**
  * @deprecated user should use the options input
  */
  set labelColumns(value: string) {
    this._labelColumns = value;
    this._labelColsArray = Util.parseArray(value);
  }

  protected _labelColsArray: string[] = [];

  get labelColsArray(): string[] {
    return this._labelColsArray;
  }

  set labelColsArray(value: string[]) {
    this._labelColsArray = value;
  }

  protected translateService: OTranslateService;
  protected oFormLayoutManagerService: OFormLayoutManagerService;
  protected localStorageService: LocalStorageService;

  protected _tabGroupOptions: any = {};

  get tabGroupOptions(): any {
    return this._tabGroupOptions;
  }

  addTabGroupOptions(value: any) {
    Object.assign(this._tabGroupOptions, value);
    if (value.hasOwnProperty('labelColumns')) {
      this.labelColsArray = Util.parseArray(value['labelColumns']);
    }
    if (value.hasOwnProperty('separator')) {
      this.separator = value['separator'];
    }
  }

  protected _dialogOptions: any = {};

  get dialogOptions(): any {
    return this._dialogOptions;
  }

  addDialogOptions(value: any) {
    Object.assign(this._dialogOptions, value);
    if (value.hasOwnProperty('labelColumns')) {
      this.labelColsArray = Util.parseArray(value['labelColumns']);
    }
    if (value.hasOwnProperty('separator')) {
      this.separator = value['separator'];
    }
  }

  protected _splitPaneOptions: any = {};

  get splitPaneOptions(): any {
    return this._splitPaneOptions;
  }

  addSplitPaneOptions(value: any) {
    Object.assign(this._splitPaneOptions, value);
  }

  protected addingGuard: boolean = false;

  public navigationService: NavigationService;

  public _markForUpdate: boolean = false;
  public onTriggerUpdate: EventEmitter<any> = new EventEmitter<any>();

  protected subscription: Subscription = new Subscription();

  protected componentStateService: OFormLayoutManagerComponentStateService;

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
    this.componentStateService = this.injector.get(OFormLayoutManagerComponentStateService);
    if (this.storeState) {
      this.subscription.add(this.localStorageService.onRouteChange.subscribe(res => {
        this.updateStateStorage();
      }));
    }
  }

  get state(): OFormLayoutManagerComponentStateClass {
    return this.componentStateService.state;
  }

  public ngOnInit(): void {
    this.addActivateChildGuard();
    if (!Util.isDefined(this.oattr)) {
      this.oattr = (this.title || '') + this.mode;
      console.warn('o-form-layout-manager must have an unique attr');
    }
    this.oFormLayoutManagerService.registerFormLayoutManager(this);
    if (this.storeState) {
      this.componentStateService.initialize(this);
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.elRef) {
        this.elRef.nativeElement.removeAttribute('title');
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.oFormLayoutManagerService.removeFormLayoutManager(this);
    this.destroyActivateChildGuard();
  }

  public getAttribute(): string {
    return this.oattr;
  }

  public getComponentKey(): string {
    return 'OFormLayoutManagerComponent_' + this.oattr;
  }

  public getRouteKey(): string {
    let route = this.router.url;
    this.actRoute.params.subscribe(params => {
      Object.keys(params).forEach(key => {
        route = route.replace(params[key], key);
      });
    });
    return route;
  }

  public getDataToStore(): any {
    const compRef = this.getLayoutModeComponent();
    return Util.isDefined(compRef) ? compRef.getDataToStore() : {};
  }

  @HostListener('window:beforeunload', [])
  public beforeunloadHandler(): void {
    this.updateStateStorage();
  }

  public getLabelFromUrlParams(urlParams: object): string {
    let label = '';
    const keys = Object.keys(urlParams);
    keys.forEach((param, i) => {
      label += urlParams[param] + ((i < keys.length - 1) ? this.separator : '');
    });
    return label;
  }

  public getFormDataFromLabelColumns(data: any) {
    const formData = {};
    Object.keys(data).forEach(x => {
      if (this.labelColsArray.indexOf(x) > -1) {
        formData[x] = data[x];
      }
    });
    return formData;
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

  public destroyActivateChildGuard(): void {
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

  public isSplitPaneMode(): boolean {
    return this.mode === OFormLayoutManagerComponent.SPLIT_PANE_MODE;
  }

  public addDetailComponent(childRoute: ActivatedRouteSnapshot, url: string): void {
    const newDetailComp: FormLayoutDetailComponentData = {
      params: childRoute.params,
      queryParams: childRoute.queryParams,
      urlSegments: childRoute.url,
      component: childRoute.routeConfig.component,
      url: url,
      id: Math.random().toString(36),
      label: '',
      innerFormsInfo: {},
      insertionMode: childRoute.queryParams[Codes.INSERTION_MODE] === 'true'
    };
    if (this.isDialogMode()) {
      this.openFormLayoutDialog(newDetailComp);
    } else {
      const compRef = this.getLayoutModeComponent();
      if (Util.isDefined(compRef)) {
        compRef.openDetail(newDetailComp);
      }
    }
  }

  public closeDetail(options?: FormLayoutCloseDetailOptions): void {
    const compRef = this.getLayoutModeComponent();
    if (Util.isDefined(compRef)) {
      compRef.closeDetail(options);
    }
  }

  public openFormLayoutDialog(detailComp: FormLayoutDetailComponentData): void {
    const cssclass = ['o-form-layout-dialog-overlay'];
    if (this.dialogClass) {
      cssclass.push(this.dialogClass);
    }

    const dialogOptions = (this.dialogOptions || {});

    const dialogConfig: MatDialogConfig = {
      data: {
        data: detailComp,
        layoutManagerComponent: this,
        title: dialogOptions.title || this.title,
      },
      width: dialogOptions.width || this.dialogWidth,
      minWidth: dialogOptions.minWidth || this.dialogMinWidth,
      maxWidth: dialogOptions.maxWidth || this.dialogMaxWidth,
      height: dialogOptions.height || this.dialogHeight,
      minHeight: dialogOptions.minHeight || this.dialogMinHeight,
      maxHeight: dialogOptions.maxHeight || this.dialogMaxHeight,
      disableClose: dialogOptions.disableClose || true,
      panelClass: dialogOptions.class || cssclass
    };

    if (this.dialogOptions) {
      dialogConfig.closeOnNavigation = this.dialogOptions.closeOnNavigation;
      dialogConfig.backdropClass = this.dialogOptions.backdropClass;
      dialogConfig.position = this.dialogOptions.position;
      dialogConfig.disableClose = this.dialogOptions.disableClose;
    }

    this.dialogRef = this.dialog.open(OFormLayoutDialogComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(() => {
      if (this.markForUpdate) {
        this.updateIfNeeded();
      } else {
        this.reloadMainComponents();
      }
    });
  }

  public getFormCacheData(): FormLayoutDetailComponentData {
    const compRef = this.getLayoutModeComponent();
    return Util.isDefined(compRef) ? compRef.getFormCacheData() : undefined;
  }

  public setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean): void {
    const compRef = this.getLayoutModeComponent();
    if (Util.isDefined(compRef)) {
      compRef.setModifiedState(formAttr, modified, confirmExit);
    }
  }

  public getLabelFromData(data: any): string {
    let label = '';
    const isDataDefined = Util.isDefined(data);
    if (isDataDefined && data.hasOwnProperty('new_tab_title')) {
      label = this.translateService.get(data.new_tab_title);
    } else if (isDataDefined && this.labelColsArray.length !== 0) {
      this.labelColsArray.forEach((col, idx) => {
        if (data[col] !== undefined) {
          label += data[col] + ((idx < this.labelColsArray.length - 1) ? this.separator : '');
        }
      });
    }
    return label;
  }

  public updateNavigation(data: any, keysValues: any, insertionMode: boolean): void {
    const compRef = this.getLayoutModeComponent();
    if (Util.isDefined(compRef)) {
      compRef.updateNavigation(data, keysValues, insertionMode);
    }
  }

  public updateActiveData(data: any) {
    const compRef = this.getLayoutModeComponent();
    if (Util.isDefined(compRef)) {
      compRef.updateActiveData(data);
    }
  }

  public getRouteOfActiveItem(): any[] {
    const compRef = this.getLayoutModeComponent();
    return Util.isDefined(compRef) ? compRef.getRouteOfActiveItem() : [];
  }

  public isMainComponent(comp: ILayoutManagerComponent): boolean {
    if (this.isDialogMode()) {
      return !comp.oFormLayoutDialog;
    }
    const compRef = this.getLayoutModeComponent();
    return Util.isDefined(compRef) && compRef.isMainComponent(comp);
  }

  public getRouteForComponent(comp: ILayoutManagerComponent): any[] {
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
    this.onTriggerUpdate.emit();
  }

  public allowToUpdateNavigation(formAttr: string): boolean {
    return (this.isTabMode() && Util.isDefined(this.oTabGroup) && Util.isDefined(this.titleDataOrigin)) ?
      this.titleDataOrigin === formAttr :
      true;
  }

  public updateStateStorage(): void {
    if (!this.localStorageService || !this.storeState) {
      return;
    }
    const isTabMode = this.isTabMode() && Util.isDefined(this.oTabGroup);
    const isSplitPaneMode = this.isSplitPaneMode() && Util.isDefined(this.oSplitPane);
    if (isTabMode || isSplitPaneMode) {
      this.localStorageService.updateComponentStorage(this, this.getRouteKey());
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

  public getParams(): any {
    const compRef = this.getLayoutModeComponent();
    return Util.isDefined(compRef) ? compRef.getParams() : undefined;
  }

  set markForUpdate(arg: boolean) {
    this._markForUpdate = arg;
    if (this.isSplitPaneMode()) {
      this.updateIfNeeded();
    }
  }

  get markForUpdate(): boolean {
    return this._markForUpdate;
  }

  get ignoreCanDeactivate(): boolean {
    return !this.isSplitPaneMode();
  }

  protected getLayoutModeComponent(): OFormLayoutManagerMode {
    let compRef;
    if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
      compRef = this.oTabGroup;
    } else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
      compRef = this.dialogRef.componentInstance;
    } else if (this.isSplitPaneMode() && Util.isDefined(this.oSplitPane)) {
      compRef = this.oSplitPane;
    }
    return compRef;
  }

  allowNavigation(): boolean {
    return !this.isTabMode();
  }

  public canAddDetailComponent(): Observable<boolean> {
    const compRef = this.getLayoutModeComponent();
    return Util.wrapIntoObservable(Util.isDefined(compRef) ? compRef.canAddDetailComponent() : true);
  }

  public hasToConfirmExit(data: FormLayoutDetailComponentData, options?: FormLayoutCloseDetailOptions): boolean {
    if (Util.isDefined(options) && options.exitWithoutConfirmation) {
      return false;
    }
    const formsAttr = Object.keys(data.innerFormsInfo);
    let result: boolean = false;
    if(formsAttr.length > 0) {
      formsAttr.forEach(formAttr => {
        if(!result) {
          const formData = data.innerFormsInfo[formAttr];
          result = formData.confirmOnExit && formData.modified;
        }
      });
    }
    return result;
  }
}
