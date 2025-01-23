import { EventEmitter } from '@angular/core';

import { ILayoutManagerComponent } from '../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerComponentStateClass } from '../../services/state/o-form-layout-manager-component-state.class';
import { FormLayoutCloseDetailOptions, FormLayoutDetailComponentData } from '../../types/form-layout-detail-component-data.type';
import { OFormLayoutManagerMode } from '../../interfaces/o-form-layout-manager-mode.interface';
import { NavigationService } from '../../services/navigation.service';
import { IOFormLayoutManager } from '../../interfaces/form-layout-manager.interface';
import { ActivatedRouteSnapshot } from '@angular/router';
import { OFormLayoutManagerContext } from '../../types/form-layout-manager-context.type';


export abstract class OFormLayoutManagerBase implements IOFormLayoutManager {
  oattr: string;
  mode: string;
  separator: string;
  title: string;
  labelColumns: string;
  tabGroupOptions: any;
  dialogOptions: any;
  splitPaneOptions: any;
  onMainTabSelected: EventEmitter<any>;
  public onTriggerUpdate: EventEmitter<any>;
  public onSelectedTabChange: EventEmitter<any>;
  onCloseTab: EventEmitter<any>;
  state: OFormLayoutManagerComponentStateClass;
  parentFormLayoutManager: OFormLayoutManagerBase;
  markForUpdate: boolean;
  navigationService: NavigationService;
  storeState: boolean;
  public oTabGroup: OFormLayoutManagerMode;
  abstract addDetailComponent(childRoute: ActivatedRouteSnapshot, url: string, context?: OFormLayoutManagerContext);
  abstract allowNavigation(): boolean;
  abstract allowToUpdateNavigation(formAttr: string): boolean
  abstract closeDetail(options?: FormLayoutCloseDetailOptions): void;
  abstract closeDetails(detailsKeysData: any[], options?: FormLayoutCloseDetailOptions): void;
  abstract get ignoreCanDeactivate(): boolean;
  abstract getAttribute(): string;
  abstract getComponentKey(): string;
  abstract getDataToStore(): any;
  abstract getFormCacheData(): FormLayoutDetailComponentData;
  abstract getFormDataFromLabelColumns(data: any);
  abstract getIdOfActiveItem(): string;
  abstract getLabelFromData(data: any): string;
  abstract getLabelFromUrlParams(urlParams: object): string;
  abstract getParams(): any;
  abstract getRouteForComponent(comp: ILayoutManagerComponent): any[];
  abstract getRouteKey(): string;
  abstract getRouteOfActiveItem(): any[];
  abstract hasToConfirmExit(data: FormLayoutDetailComponentData, options?: FormLayoutCloseDetailOptions): boolean
  abstract isDialogMode(): boolean;
  abstract isMainComponent(comp: ILayoutManagerComponent): boolean;
  abstract isSplitPaneMode(): boolean;
  abstract isTabMode(): boolean;
  abstract reloadMainComponents();
  abstract setAsActiveFormLayoutManager();
  abstract setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean);
  abstract updateActiveData(data: any);
  abstract updateIfNeeded(): void;
  abstract updateNavigation(data: any, keysValues: any, insertionMode: boolean);
  abstract updateStateStorage();
}
