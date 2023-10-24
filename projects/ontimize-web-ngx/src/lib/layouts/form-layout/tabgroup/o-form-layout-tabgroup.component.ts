import {
  AfterViewInit,
  Component,
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
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { ILayoutManagerComponent } from '../../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { DialogService } from '../../../services/dialog.service';
import { OFormLayoutManagerComponentStateClass } from '../../../services/state/o-form-layout-manager-component-state.class';
import { FormLayoutCloseDetailOptions, FormLayoutDetailComponentData } from '../../../types/form-layout-detail-component-data.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerBase } from '../o-form-layout-manager-base.class';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = [
  'title',
  'options',
  'stretchTabs: stretch-tabs'
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
  @BooleanInputConverter()
  public stretchTabs: boolean = false;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  protected subscriptions: Subscription = new Subscription();
  protected router: Router;
  protected dialogService: DialogService;

  public onMainTabSelected: EventEmitter<any> = new EventEmitter<any>();
  public onSelectedTabChange: EventEmitter<any> = new EventEmitter<any>();
  public onCloseTab: EventEmitter<any> = new EventEmitter<any>();

  protected previousSelectedIndex: number;

  public updateTabComponentsState = new Subject<any>();
  public tabsModificationsCache: any[] = [];

  constructor(
    protected injector: Injector,
    protected location: ViewContainerRef,
    protected elementRef: ElementRef,
    @Inject(forwardRef(() => OFormLayoutManagerBase)) public formLayoutManager: OFormLayoutManagerBase
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

  get maxTabs(): number {
    let maxTabs;
    if (this.options && this.options.maxTabs) {
      maxTabs = this.options.maxTabs;
    }
    return maxTabs;
  }

  addTab(compData: FormLayoutDetailComponentData) {
    let addNewComp = true;
    if (compData.insertionMode) {
      const alreadyExistingInsertionTab = Util.isDefined(this.data.find(item => item.insertionMode));
      addNewComp = !alreadyExistingInsertionTab;
    }
    const newCompParams = compData.params;
    if (addNewComp) {
      this.data.forEach(comp => {
        const currParams = comp.params || {};
        let someDiffParams = true;
        if (Object.keys(currParams).length > 0) {
          someDiffParams = Object.keys(currParams).some(key => currParams[key] != newCompParams[key]);
        }
        addNewComp = addNewComp && someDiffParams;
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
    if (isLoading && Util.isDefined(this.state) && Util.isDefined(this.state.tabsData) &&
      arg.index === this.state.tabsData.length - 1) {
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

  closeTab(index: number, options?: FormLayoutCloseDetailOptions) {
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

    if (Util.isDefined(tabData) && this.formLayoutManager.hasToConfirmExit(tabData, options)) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(res => {
        onCloseTabAccepted.emit(res);
      });
    } else {
      onCloseTabAccepted.emit(true);
    }
  }

  createTabComponent(tabData: FormLayoutDetailComponentData, content: OFormLayoutManagerContentDirective) {
    const component = tabData.component;
    const viewContainerRef: ViewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(component);
    tabData.rendered = true;
  }

  getFormCacheData(): FormLayoutDetailComponentData {
    return this.data.length > 0 ? this.data[this.data.length - 1] : undefined;
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

  setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean) {
    if (this.tabGroup.selectedIndex > 0) {
      const selectedData = this.data[this.tabGroup.selectedIndex - 1];
      if (Util.isDefined(selectedData)) {
        selectedData.innerFormsInfo[formAttr] = {
          modified: modified,
          confirmOnExit: confirmExit
        };
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
    // Issue #884 avoid storing insertionMode tabs
    const tabsData = this.data
      .filter((data: FormLayoutDetailComponentData) => !data.insertionMode)
      .map((data: FormLayoutDetailComponentData) => ({
        params: data.params,
        queryParams: data.queryParams,
        urlSegments: data.urlSegments,
        url: data.url,
        label: data.label,
        insertionMode: data.insertionMode
      }));
    return {
      tabsData: tabsData,
      selectedIndex: this.tabGroup.selectedIndex
    };
  }

  initializeComponentState() {
    if (!Util.isDefined(this.state) || !Util.isDefined(this.state.tabsData)) {
      return;
    }

    // Issue #884 ensuring that a insertion mode tab that might be previously stored wont be created
    this.state.tabsData = this.state.tabsData.filter(tabData => !tabData.insertionMode)

    if (this.state.tabsData.length >= 1 && (this.state.tabsData[0].url || '').length > 0) {
      this.showLoading.next(true);
      const extras = {};
      extras[Codes.QUERY_PARAMS] = this.state.tabsData[0].queryParams;
      extras[Codes.QUERY_PARAMS][Codes.INSERTION_MODE] = `${this.state.tabsData[0].insertionMode}`
      if (this.formLayoutManager) {
        this.formLayoutManager.setAsActiveFormLayoutManager();
      }
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
    // skipping first element (created in initializeComponentState)
    const stateTabsData = this.state.tabsData.slice(1);
    if (stateTabsData.length > 0) {
      stateTabsData.forEach((tabData: any) => {
        setTimeout(() => {
          const newDetailData = this.createDetailComponent(tabComponent, tabData);
          this.data.push(newDetailData);
        }, 0);
      });
    } else {
      this.showLoading.next(false);
    }
  }

  protected createDetailComponent(component: any, paramsObj: any) {
    const newDetailComp: FormLayoutDetailComponentData = {
      params: paramsObj.params,
      queryParams: paramsObj.queryParams,
      urlSegments: paramsObj.urlSegments,
      component: component,
      url: paramsObj.url,
      id: Util.randomNumber().toString(),
      label: paramsObj.label,
      innerFormsInfo: {}
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

  closeDetail(options?: FormLayoutCloseDetailOptions) {
    this.closeTab(this.tabGroup.selectedIndex - 1, options);
  }

  canAddDetailComponent(): boolean {
    // The max tabs number includes the main tab
    const maxReached = (this.data.length + 1) >= this.maxTabs;
    if (maxReached) {
      this.dialogService.info('INFO', 'LAYOUT_MANANGER.MAX_TABS_NUMBER_REACHED')
    }
    return !maxReached;
  }

  isTabDataModified(tabData: FormLayoutDetailComponentData): boolean {
    return Object.keys(tabData.innerFormsInfo).some(formAttr => tabData.innerFormsInfo[formAttr].modified);
  }

  closeDetails(detailsKeysData: any[] = [], options?: FormLayoutCloseDetailOptions) {
    detailsKeysData.forEach((detailData) => {
      const index = this.data.findIndex((item) => Util.isEquivalent(detailData, item.params || {}));
      if (index !== -1) {
        this.closeTab(index, options);
      }
    });
  }

  getIdOfActiveItem(): string {
    return this.data[this.data.length - 1] ? this.data[this.data.length - 1].id : this.data.length.toString();
  }
}
