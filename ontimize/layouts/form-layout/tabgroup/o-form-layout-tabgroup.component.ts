import { Component, ViewEncapsulation, Injector, ComponentFactoryResolver, ViewContainerRef, ViewChildren, QueryList, ViewChild, AfterViewInit, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Util, Codes } from '../../../utils';
import { Router } from '@angular/router';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { IDetailComponentData, OFormLayoutManagerComponent } from '../o-form-layout-manager.component';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = [
  'title'
];

export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = [
  'onMainTabSelected',
  'onCloseTab'
];

@Component({
  moduleId: module.id,
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
export class OFormLayoutTabGroupComponent implements AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP;
  public static DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP;

  protected formLayoutManager: OFormLayoutManagerComponent;
  data: IDetailComponentData[] = [];
  selectedTabIndex: number | null;
  title: string;
  protected _state: any;

  private _ignoreTabsDirectivesChange: boolean = false;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  protected updatedDataOnTable: boolean = false;
  protected closeTabSubscription: Subscription;
  protected tabsDirectivesSubscription: Subscription;
  protected router: Router;
  protected loading: boolean = false;

  constructor(
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected location: ViewContainerRef,
    private cd: ChangeDetectorRef
  ) {
    this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
    this.router = this.injector.get(Router);
  }

  ngAfterViewInit() {
    this.tabsDirectivesSubscription = this.tabsDirectives.changes.subscribe(changes => {
      if (this.tabsDirectives.length && !this._ignoreTabsDirectivesChange) {
        const tabItem = this.tabsDirectives.last;
        const tabData = this.data[tabItem.index];
        if (tabData && !tabData.rendered) {
          this.createTabComponent(tabData, tabItem);
        }
      } else if (this._ignoreTabsDirectivesChange) {
        this._ignoreTabsDirectivesChange = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.tabsDirectivesSubscription) {
      this.tabsDirectivesSubscription.unsubscribe();
    }
    if (this.closeTabSubscription) {
      this.closeTabSubscription.unsubscribe();
    }
  }

  addTab(compData: IDetailComponentData) {
    let addNewComp = true;
    const newCompParams = compData.params;
    this.data.forEach(comp => {
      const currParams = comp.params || {};
      Object.keys(currParams).forEach(key => {
        addNewComp = addNewComp && (currParams[key] !== newCompParams[key]);
      });
    });
    if (addNewComp) {
      this.data.push(compData);
    } else {
      this.reloadTab(compData);
    }
  }

  reloadTab(compData: IDetailComponentData) {
    let compIndex = -1;
    const compParams = compData.params;
    this.data.forEach((comp, i) => {
      const currParams = comp.params || {};
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

  onTabSelectChange(arg: MatTabChangeEvent) {
    if (this.formLayoutManager && this.tabGroup.selectedIndex === 0 && this.updatedDataOnTable) {
      this.formLayoutManager.onMainTabSelected.emit();
      this.updatedDataOnTable = false;
    }
    if (Util.isDefined(this.state) && Util.isDefined(this.state.tabsData)) {
      if (this.state.tabsData.length > 1) {
        if ((arg.index === this.state.tabsData.length) && Util.isDefined(this.state.selectedIndex)) {
          this.selectedTabIndex = this.state.selectedIndex;
          this.state = undefined;
        }
      } else {
        this.state = undefined;
      }
    }
  }

  onCloseTab(id: string) {
    if (this.formLayoutManager) {
      const onCloseTabAccepted: EventEmitter<any> = new EventEmitter<any>();
      const self = this;
      this.closeTabSubscription = onCloseTabAccepted.asObservable().subscribe(res => {
        if (res) {
          self._ignoreTabsDirectivesChange = true;
          for (let i = self.data.length - 1; i >= 0; i--) {
            if (this.data[i].id === id) {
              self.data.splice(i, 1);
              break;
            }
          }
        }
      });
      this.formLayoutManager.onCloseTab.emit({
        onCloseTabAccepted: onCloseTabAccepted,
        id: id
      });
    }
  }

  createTabComponent(tabData: IDetailComponentData, content: OFormLayoutManagerContentDirective) {
    const component = tabData.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef: ViewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
    tabData.rendered = true;
  }

  getFormCacheData(idArg: string): IDetailComponentData {
    return this.data.filter(cacheItem => cacheItem.id === idArg)[0];
  }

  getLastTabId(): string {
    return this.data.length > 0 ? this.data[this.data.length - 1].id : undefined;
  }

  getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.data.length && this.tabGroup.selectedIndex > 0) {
      const urlSegments = this.data[this.tabGroup.selectedIndex - 1].urlSegments || [];
      urlSegments.forEach((segment) => {
        route.push(segment.path);
      });
      return route;
    }
    return route;
  }

  setModifiedState(modified: boolean, id: string) {
    for (let i = 0, len = this.data.length; i < len; i++) {
      if (this.data[i].id === id) {
        this.data[i].modified = modified;
        break;
      }
    }
    //when modified state of a tab, we must reload thedata of table
    this.updatedDataOnTable = true;
  }

  updateNavigation(data: any, id: string) {
    let index = this.data.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      let label = this.formLayoutManager.getLabelFromData(data);
      this.tabGroup.selectedIndex = (index + 1);
      label = label.length ? label : this.formLayoutManager.getLabelFromUrlParams(this.data[index].params);
      this.data[index].label = label;
    }
  }

  getDataToStore(): Object {
    let tabsData = [];
    this.data.map((data: IDetailComponentData) => {
      tabsData.push({
        params: data.params,
        queryParams: data.queryParams,
        urlSegments: data.urlSegments,
        url: data.url
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
      let extras = {};
      extras[Codes.QUERY_PARAMS] = state.tabsData[0].queryParams;
      const self = this;
      if (this.formLayoutManager) {
        this.formLayoutManager.setAsActiveFormLayoutManager();
      }
      this.router.navigate([state.tabsData[0].url], extras).then(val => {
        if (self.data[0]) {
          setTimeout(() => {
            self.createTabsFromState();
          }, 0);
        }
      });
    }
  }

  protected createTabsFromState() {
    const self = this;
    const tabComponent = self.data[0].component;
    this.state.tabsData.forEach((tabData: any, index: number) => {
      if (tabComponent && index > 0) {
        setTimeout(() => {
          const newDetailData = self.createDetailComponent(tabComponent, tabData);
          self.data.push(newDetailData);
        }, 0);
      }
    });
  }

  protected createDetailComponent(component: any, paramsObj: any) {
    const newDetailComp: IDetailComponentData = {
      params: paramsObj.params,
      queryParams: paramsObj.queryParams,
      urlSegments: paramsObj.urlSegments,
      component: component,
      url: paramsObj.url,
      id: Math.random().toString(36),
      label: '',
      modified: false
    };
    return newDetailComp;
  }

  get showLoading(): boolean {
    return this.loading;
  }

  set showLoading(arg: boolean) {
    this.loading = arg;
  }

  set state(arg: any) {
    this._state = arg;
    if (Util.isDefined(arg)) {
      this.showLoading = true;
    } else {
      const self = this;
      setTimeout(() => {
        self.showLoading = false;
        self.cd.detectChanges();
      }, 1000);
    }
  }

  get state(): any {
    return this._state;
  }
}
