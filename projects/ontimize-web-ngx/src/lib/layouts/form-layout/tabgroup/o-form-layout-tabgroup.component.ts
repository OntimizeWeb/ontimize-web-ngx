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
  ViewEncapsulation
} from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { ILayoutManagerComponent } from '../../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { DialogService } from '../../../services/dialog.service';
import { ONavigationItem } from '../../../services/navigation.service';
import { OFormLayoutManagerComponentStateClass } from '../../../services/state/o-form-layout-manager-component-state.class';
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
  public title: string;
  public options: any;
  public showLoading = new BehaviorSubject<boolean>(false);

  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  protected subscriptions: Subscription = new Subscription();
  protected router: Router;
  protected dialogService: DialogService;

  public onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
  public onSelectedTabChange: EventEmitter<any> = new EventEmitter<any>();
  public onCloseTab: EventEmitter<any> = new EventEmitter<any>();

  protected previousSelectedIndex: number;

  public updateTabComponentsState = new Subject<any>();

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

  get state(): OFormLayoutManagerComponentStateClass {
    return this.formLayoutManager.state;
  }

  ngAfterViewInit() {
    this.initializeComponentState();

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

  public get mainTabTitle(): string {
    return (this.options.title || this.title || 'LAYOUT_MANANGER.MAIN_TAB_LABEL');
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
    const isLoading = this.showLoading.getValue();
    if (Util.isDefined(this.state) && Util.isDefined(this.state.tabsData) &&
      isLoading && arg.index === this.state.tabsData.length) {
      // this is only triggered once when all tabs are loaded 
      this.tabGroup.selectedIndex = this.state.selectedIndex;
      this.showLoading.next(false);
    }
    if (!isLoading) {
      this.onSelectedTabChange.emit({
        data: this.data[this.tabGroup.selectedIndex - 1],
        index: this.tabGroup.selectedIndex,
        previousIndex: this.previousSelectedIndex
      });
    }
    this.previousSelectedIndex = this.tabGroup.selectedIndex;
  }

  closeTab(index: number) {
    if (!this.formLayoutManager) {
      return;
    }
    const tabData = this.data[index];
    const onCloseTabAccepted: EventEmitter<any> = new EventEmitter<any>();

    this.subscriptions.add(onCloseTabAccepted.asObservable().subscribe(res => {
      if (res) {
        this.data.splice(index, 1);
        this.onCloseTab.emit({
          data: tabData,
          index: index + 1
        });
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

  getDataToStore(): any {
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

  initializeComponentState() {
    if (this.formLayoutManager) {
      this.formLayoutManager.setAsActiveFormLayoutManager();
    }

    if (!Util.isDefined(this.state) || !Util.isDefined(this.state.tabsData)) {
      return;
    }

    if (this.state.tabsData.length >= 1) {
      this.showLoading.next(true);
      const extras = {};
      extras[Codes.QUERY_PARAMS] = this.state.tabsData[0].queryParams;
      // Triggering first tab navigation
      this.router.navigate([this.state.tabsData[0].url], extras).then(() => {
        if (this.data[0] && this.data[0].component && this.state.tabsData.length > 1) {
          // Triggering rest of the tabs creation
          setTimeout(() => {
            this.createTabsFromState();
          }, 0);
        } else {
          this.showLoading.next(false);
        }
      });
    }
  }

  protected createTabsFromState() {
    const tabComponent = this.data[0].component;
    this.state.tabsData.forEach((tabData: any, index: number) => {
      if (index >= 1) {
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

  getParams(): any {
    return Util.isDefined(this.data[0]) ? this.data[0].params : undefined;
  }

  isMainComponent(comp: ILayoutManagerComponent): boolean {
    const firstTab = this.elementRef.nativeElement.getElementsByTagName('mat-tab-body')[0];
    return firstTab && comp.elementRef && firstTab.contains(comp.elementRef.nativeElement);
  }

  openDetail(detail: FormLayoutDetailComponentData) {
    this.addTab(detail);
  }

  closeDetail() {
    this.closeTab(this.tabGroup.selectedIndex - 1);
  }
}
