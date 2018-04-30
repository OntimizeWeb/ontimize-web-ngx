import { Component, ViewEncapsulation, Injector, ComponentFactoryResolver, ViewContainerRef, ViewChildren, QueryList, ViewChild, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
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

  title: string;

  private _ignoreTabsDirectivesChange: boolean = false;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChildren(OFormLayoutManagerContentDirective) tabsDirectives: QueryList<OFormLayoutManagerContentDirective>;

  protected closeTabSubscription: Subscription;
  protected tabsDirectivesSubscription: Subscription;

  constructor(
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected location: ViewContainerRef
  ) {
    this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
  }

  ngAfterViewInit() {
    this.tabsDirectivesSubscription = this.tabsDirectives.changes.subscribe(changes => {
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
    const newCompParams = compData.urlParams;
    this.data.forEach(comp => {
      const currParams = comp.urlParams || {};
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
    let viewContainerRef = content.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
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
      const urlParams = this.data[this.tabGroup.selectedIndex - 1].urlParams || [];
      Object.keys(urlParams).forEach(key => {
        route.push(urlParams[key]);
      });
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

  updateNavigation(id: string, label: string) {
    let index = undefined;
    for (let i = 0, len = this.data.length; i < len; i++) {
      if (this.data[i].id === id) {
        index = i;
        break;
      }
    }
    if (index !== undefined) {
      this.tabGroup.selectedIndex = (index + 1);
      label = label.length ? label : this.formLayoutManager.getLabelFromUrlParams(this.data[index].urlParams);
      this.data[index].label = label;
    }
  }

}
