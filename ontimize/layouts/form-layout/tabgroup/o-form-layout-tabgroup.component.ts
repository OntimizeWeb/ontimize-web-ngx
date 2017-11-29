import { Component, ViewEncapsulation, Injector, ComponentFactoryResolver, ViewContainerRef, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { MdTabGroup } from '@angular/material';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { IDetailComponentData, OFormLayoutManagerComponent } from '../o-form-layout-manager.component';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = [
  'title'
];

export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = [
  'onMainTabSelected'
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

export class OFormLayoutTabGroupComponent implements AfterViewInit {


  public static DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP;
  public static DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP;

  protected formLayoutManager: OFormLayoutManagerComponent;
  data: IDetailComponentData[] = [];
  title: string;

  private _ignoreTabsDirectivesChange: boolean = false;
  @ViewChild('tabGroup') tabGroup: MdTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  constructor(
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected location: ViewContainerRef
  ) {
    this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
  }

  ngAfterViewInit() {
    this.tabsDirectives.changes.subscribe(changes => {
      if (this.tabsDirectives.length && !this._ignoreTabsDirectivesChange) {
        const tabItem = this.tabsDirectives.last;
        const tabData = this.data[tabItem.index];
        if (tabData) {
          this.createTabComponent(tabData, tabItem);
        }
      } else if (this._ignoreTabsDirectivesChange) {
        this._ignoreTabsDirectivesChange = false;
      }
    });
  }

  addTab(compData: IDetailComponentData) {
    let addNewComp = true;
    const newCompParams = compData.urlParams;
    this.data.forEach(comp => {
      const currParams = comp.urlParams || {};
      Object.keys(currParams).forEach(key => {
        addNewComp = addNewComp && (currParams[key] !== newCompParams[key]);
      });
    });
    if (addNewComp) {
      compData.index = this.data.length;
      this.data.push(compData);
    } else {
      this.reloadTab(compData);
    }
  }

  reloadTab(compData: IDetailComponentData) {
    let compIndex = -1;
    const compParams = compData.urlParams;
    this.data.forEach((comp, i) => {
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

  onTabSelectChange() {
    if (this.formLayoutManager && this.tabGroup.selectedIndex === 0) {
      this.formLayoutManager.onMainTabSelected.emit();
    }
  }

  onCloseTab(index: number) {
    this._ignoreTabsDirectivesChange = true;
    this.data.splice(index, 1);
  }

  createTabComponent(tabData: IDetailComponentData, content: OFormLayoutManagerContentDirective) {
    const component = tabData.component;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

  getFormCacheData(formIndex: number): IDetailComponentData {
    return this.data.filter(cacheItem => cacheItem.index === formIndex)[0];
  }

  getLastTabIndex(): number {
    return this.data.length > 0 ? this.data[this.data.length - 1].index : undefined;
  }

  getRouteOfActiveItem(): any[] {
    let route = [];
    if (this.data.length && this.tabGroup.selectedIndex > 0) {
      const urlParams = this.data[this.tabGroup.selectedIndex - 1].urlParams || [];
      Object.keys(urlParams).forEach(key => {
        route.push(urlParams[key]);
      });
    }
    return route;
  }

  updateNavigation(index: number, label: string) {
    this.tabGroup.selectedIndex = (index + 1);
    label = label.length ? label : this.formLayoutManager.getLabelFromUrlParams(this.data[index].urlParams);
    this.data[index].label = label;
  }

}
