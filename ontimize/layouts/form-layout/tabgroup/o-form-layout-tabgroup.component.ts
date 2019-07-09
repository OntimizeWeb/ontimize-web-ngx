import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Injector, OnDestroy, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { ONavigationItem } from '../../../services/navigation.service';
import { Codes, Util } from '../../../utils';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { IDetailComponentData, OFormLayoutManagerComponent } from '../o-form-layout-manager.component';

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
  public data: IDetailComponentData[] = [];
  public selectedTabIndex: number | null;
  public title: string;
  public options: any;
  public showLoading = new BehaviorSubject<boolean>(false);
  protected _state: any;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  protected closeTabSubscription: Subscription;
  protected tabsDirectivesSubscription: Subscription;
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
    protected elRef: ElementRef
  ) {
    this.dialogService = injector.get(DialogService);
    this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
    this.router = this.injector.get(Router);
  }

  ngAfterViewInit() {

    this.tabsDirectivesSubscription = this.tabsDirectives.changes.subscribe(changes => {
      if (this.tabsDirectives.length) {
        const tabItem = this.tabsDirectives.last;
        const tabData = this.data[tabItem.index];
        if (tabData && !tabData.rendered) {
          this.createTabComponent(tabData, tabItem);
        }
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

  addTab(compData: IDetailComponentData) {
    let addNewComp = true;
    const navData: ONavigationItem = this.formLayoutManager.navigationService.getLastItem();
    if (navData.isInsertFormRoute()) {
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

  reloadTab(compData: IDetailComponentData) {
    let compIndex = -1;
    const compParams = compData.params;
    this.data.forEach((comp, i) => {
      const currParams = comp.params || {};
      let sameParams = Util.isEquivalent(currParams, compParams);
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
      if (this.state.tabsData.length > 1) {
        if ((arg.index === this.state.tabsData.length) && Util.isDefined(this.state.selectedIndex)) {
          this.selectedTabIndex = this.state.selectedIndex;
          this.state = undefined;
        }
      } else {
        this.state = undefined;
      }
    }
    this.onSelectedTabChange.emit(this.data[this.selectedTabIndex - 1]);
  }

  closeTab(id: string) {
    if (!this.formLayoutManager) {
      return;
    }
    const onCloseTabAccepted: EventEmitter<any> = new EventEmitter<any>();
    const self = this;
    this.closeTabSubscription = onCloseTabAccepted.asObservable().subscribe(res => {
      if (res) {
        let tabData;
        for (let i = self.data.length - 1; i >= 0; i--) {
          if (self.data[i].id === id) {
            tabData = self.data.splice(i, 1)[0];
            break;
          }
        }
        self.onCloseTab.emit(tabData);
      }
    });
    const tabData = this.data.find((item: IDetailComponentData) => item.id === id);
    if (Util.isDefined(tabData) && tabData.modified) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(res => {
        onCloseTabAccepted.emit(res);
      });
    } else {
      onCloseTabAccepted.emit(true);
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
  }

  updateNavigation(data: any, id: string, insertionMode?: boolean) {
    let index = this.data.findIndex((item: any) => item.id === id);
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

  get elementRef(): ElementRef {
    return this.elRef;
  }
}
