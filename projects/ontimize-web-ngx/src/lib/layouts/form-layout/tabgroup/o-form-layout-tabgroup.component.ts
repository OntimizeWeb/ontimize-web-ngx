import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { OServiceComponent } from '../../../components/o-service-component.class';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { DialogService } from '../../../services/dialog.service';
import { ONavigationItem } from '../../../services/navigation.service';
import { FormLayoutDetailComponentData } from '../../../types/form-layout-detail-component-data.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = [
  'title',
  'options'
];

export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = [
  'onMainTabSelected',
  'onSelectedTabChange',
  'onCloseTab'
];

@Component({
  selector: 'o-form-layout-tabgroup',
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP,
  outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP,
  templateUrl: './o-form-layout-tabgroup.component.html',
  styleUrls: ['./o-form-layout-tabgroup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-tabgroup]': 'true'
  }
})
export class OFormLayoutTabGroupComponent implements OFormLayoutManagerMode, AfterViewInit, OnDestroy {

  public data: FormLayoutDetailComponentData[] = [];
  public selectedTabIndex: number | null;
  public title: string;
  public options: any;
  public showLoading = new BehaviorSubject<boolean>(false);
  protected _state: any;

  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  protected subscriptions: Subscription = new Subscription();
  protected router: Router;
  protected loading: boolean = false;
  protected dialogService: DialogService;

  public onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
  public onSelectedTabChange: EventEmitter<any> = new EventEmitter<any>();
  public onCloseTab: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected location: ViewContainerRef,
    protected elementRef: ElementRef,
    @Inject(forwardRef(() => OFormLayoutManagerComponent)) public formLayoutManager: OFormLayoutManagerComponent
  ) {
    this.dialogService = injector.get(DialogService);
    this.router = this.injector.get(Router);
  }

  ngAfterViewInit() {
    this.subscriptions.add(this.tabsDirectives.changes.subscribe(changes => {
      if (this.tabsDirectives.length) {
        const tabItem = this.tabsDirectives.last;
        const tabData = this.data[tabItem.index];
        if (tabData && !tabData.rendered) {
          this.createTabComponent(tabData, tabItem);
        }
      }
    }));
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  public get disableAnimation() {
    return this.options && this.options.disableAnimation;
  }

  public get headerPosition() {
    let headerPosition;
    if (this.options && this.options.headerPosition) {
      headerPosition = this.options.headerPosition;
    }
    return headerPosition;
  }

  public get color() {
    let color;
    if (this.options && this.options.color) {
      color = this.options.color;
    }
    return color;
  }

  public get backgroundColor() {
    let backgroundColor;
    if (this.options && this.options.backgroundColor) {
      backgroundColor = this.options.backgroundColor;
    }
    return backgroundColor;
  }

  public get templateMatTabLabel() {
    let templateMatTabLabel;
    if (this.options && this.options.templateMatTabLabel) {
      templateMatTabLabel = this.options.templateMatTabLabel;
    }
    return templateMatTabLabel;
  }

  public get icon() {
    let icon;
    if (this.options && this.options.icon) {
      icon = this.options.icon;
    }
    return icon;
  }

  public get isIconPositionLeft() {
    return this.options && this.options.iconPosition === 'left';
  }

  addTab(compData: FormLayoutDetailComponentData) {
    let addNewComp = true;
    const navData: ONavigationItem = this.formLayoutManager.navigationService.getLastItem();
    if (navData && navData.isInsertFormRoute()) {
      const existingData = this.data.find(item => item.insertionMode);
      addNewComp = !existingData;
    }
    const newCompParams = compData.params;
    if (addNewComp) {
      this.data.forEach(comp => {
        const currParams = comp.params || {};
        Object.keys(currParams).forEach(key => {
          addNewComp = addNewComp && (currParams[key] !== newCompParams[key]);
        });
      });
    }
    if (addNewComp) {
      this.data.push(compData);
    } else {
      this.reloadTab(compData);
    }
  }

  reloadTab(compData: FormLayoutDetailComponentData) {
    let compIndex = -1;
    const compParams = compData.params;
    this.data.forEach((comp, i) => {
      const currParams = comp.params || {};
      const sameParams = Util.isEquivalent(currParams, compParams);
      if (sameParams) {
        compIndex = i;
      }
    });
    if (compIndex >= 0) {
      this.tabGroup.selectedIndex = (compIndex + 1);
    }
  }

  onTabSelectChange(arg: MatTabChangeEvent) {
    if (this.formLayoutManager && this.tabGroup.selectedIndex === 0) {
      this.formLayoutManager.updateIfNeeded();
      this.onMainTabSelected.emit();
    }
    if (Util.isDefined(this.state) && Util.isDefined(this.state.tabsData)) {
      if ((arg.index === this.state.tabsData.length) && Util.isDefined(this.state.selectedIndex)) {
        this.selectedTabIndex = this.state.selectedIndex;
        this.state = undefined;
      }
    }
    this.formLayoutManager.updateStateStorage();
    this.onSelectedTabChange.emit(this.data[this.selectedTabIndex - 1]);
  }

  closeTab(id: string) {
    if (!this.formLayoutManager) {
      return;
    }
    const tabDataIndex = this.data.findIndex((item: FormLayoutDetailComponentData) => item.id === id);
    const tabData = this.data[tabDataIndex];
    const onCloseTabAccepted: EventEmitter<any> = new EventEmitter<any>();

    this.subscriptions.add(onCloseTabAccepted.asObservable().subscribe(res => {
      if (res) {
        this.data.splice(tabDataIndex, 1);
        this.formLayoutManager.updateStateStorage();
        this.onCloseTab.emit(tabData);
      }
    }));

    if (Util.isDefined(tabData) && tabData.modified) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(res => {
        onCloseTabAccepted.emit(res);
      });
    } else {
      onCloseTabAccepted.emit(true);
    }
  }

  createTabComponent(tabData: FormLayoutDetailComponentData, content: OFormLayoutManagerContentDirective) {
    const component = tabData.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef: ViewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
    tabData.rendered = true;
  }

  getFormCacheData(): FormLayoutDetailComponentData {
    return this.data.length > 0 ? this.data[this.data.length - 1] : undefined;
  }

  getLastTabId(): string {
    return this.data.length > 0 ? this.data[this.data.length - 1].id : undefined;
  }

  getRouteOfActiveItem(): any[] {
    const route = [];
    if (this.data.length && this.tabGroup.selectedIndex > 0) {
      const urlSegments = this.data[this.tabGroup.selectedIndex - 1].urlSegments || [];
      urlSegments.forEach((segment) => {
        route.push(segment.path);
      });
      return route;
    }
    return route;
  }

  setModifiedState(modified: boolean) {
    const id = this.getLastTabId();
    for (let i = 0, len = this.data.length; i < len; i++) {
      if (this.data[i].id === id) {
        this.data[i].modified = modified;
        break;
      }
    }
  }

  updateNavigation(data: any, keysValues: any, insertionMode?: boolean) {
    let index;
    if (insertionMode) {
      index = this.data.findIndex((item: any) => item.insertionMode !== false);
    } else {
      index = this.data.findIndex((item: any) => Object.keys(keysValues).every(key => keysValues[key] == item.params[key]));
    }
    if (index >= 0) {
      let label = this.formLayoutManager.getLabelFromData(data);
      this.tabGroup.selectedIndex = (index + 1);
      label = label.length ? label : this.formLayoutManager.getLabelFromUrlParams(this.data[index].params);
      this.data[index].label = label;
      this.data[index].insertionMode = insertionMode;
      if (Object.keys(data).length > 0) {
        this.data[index].formDataByLabelColumns = this.formLayoutManager.getFormDataFromLabelColumns(data);
      }
    }
  }

  updateActiveData(data: any) {
    const index = this.tabGroup.selectedIndex - 1;
    if (Util.isDefined(this.data[index])) {
      this.data[index] = Object.assign(this.data[index], data);
    }
  }

  getDataToStore(): object {
    const tabsData = [];
    this.data.forEach((data: FormLayoutDetailComponentData) => {
      tabsData.push({
        params: data.params,
        queryParams: data.queryParams,
        urlSegments: data.urlSegments,
        url: data.url,
        label: data.label
      });
    });
    return {
      tabsData: tabsData,
      selectedIndex: this.tabGroup.selectedIndex
    };
  }

  initializeComponentState(state: any) {
    if (Util.isDefined(state) && Util.isDefined(state.tabsData) && Util.isDefined(state.tabsData[0])) {
      this.state = state;
      const extras = {};
      extras[Codes.QUERY_PARAMS] = state.tabsData[0].queryParams;
      if (this.formLayoutManager) {
        this.formLayoutManager.setAsActiveFormLayoutManager();
      }
      this.router.navigate([state.tabsData[0].url], extras).then(val => {
        if (this.data[0]) {
          setTimeout(() => {
            this.createTabsFromState();
          }, 0);
        }
      });
    }
  }

  protected createTabsFromState() {
    const tabComponent = this.data[0].component;
    this.state.tabsData.forEach((tabData: any, index: number) => {
      if (tabComponent && index > 0) {
        setTimeout(() => {
          const newDetailData = this.createDetailComponent(tabComponent, tabData);
          this.data.push(newDetailData);
        }, 0);
      }
    });
  }

  protected createDetailComponent(component: any, paramsObj: any) {
    const newDetailComp: FormLayoutDetailComponentData = {
      params: paramsObj.params,
      queryParams: paramsObj.queryParams,
      urlSegments: paramsObj.urlSegments,
      component: component,
      url: paramsObj.url,
      id: Math.random().toString(36),
      label: paramsObj.label,
      modified: false
    };
    return newDetailComp;
  }

  set state(arg: any) {
    this._state = arg;
    if (Util.isDefined(arg)) {
      this.showLoading.next(true);
    } else {
      this.showLoading.next(false);
    }
  }

  get state(): any {
    return this._state;
  }

  getParams(): any {
    return Util.isDefined(this.data[0]) ? this.data[0].params : undefined;
  }

  isMainComponent(comp: OServiceComponent): boolean {
    const firstTab = this.elementRef.nativeElement.getElementsByTagName('mat-tab-body')[0];
    return firstTab && comp.elementRef && firstTab.contains(comp.elementRef.nativeElement);
  }

  openDetail(detail: FormLayoutDetailComponentData) {
    this.addTab(detail);
  }

  closeDetail() {
    const tabData = this.data[this.selectedTabIndex - 1];
    if (Util.isDefined(tabData)) {
      this.closeTab(tabData.id);
    }
  }
}
