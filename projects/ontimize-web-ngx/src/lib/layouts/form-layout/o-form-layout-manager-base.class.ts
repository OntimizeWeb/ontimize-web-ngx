import { EventEmitter } from '@angular/core';

import { ILayoutManagerComponent } from '../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerComponentStateClass } from '../../services/state/o-form-layout-manager-component-state.class';
import { FormLayoutCloseDetailOptions, FormLayoutDetailComponentData } from '../../types/form-layout-detail-component-data.type';
import { OFormLayoutManagerMode } from '../../interfaces/o-form-layout-manager-mode.interface';

export abstract class OFormLayoutManagerBase {
  public onTriggerUpdate: EventEmitter<any>;
  public onSelectedTabChange: EventEmitter<any>;
  onCloseTab: EventEmitter<any>;
  state: OFormLayoutManagerComponentStateClass;
  parentFormLayoutManager: OFormLayoutManagerBase;
  markForUpdate: boolean;
  public oTabGroup: OFormLayoutManagerMode;
  abstract get ignoreCanDeactivate(): boolean;
  abstract getRouteForComponent(comp: ILayoutManagerComponent): any[];
  abstract allowToUpdateNavigation(formAttr: string): boolean
  abstract allowNavigation(): boolean;
  abstract closeDetail(options?: FormLayoutCloseDetailOptions): void;
  abstract getFormCacheData(): FormLayoutDetailComponentData;
  abstract getLabelFromData(data: any): string;
  abstract getLabelFromUrlParams(urlParams: object): string;
  abstract getFormDataFromLabelColumns(data: any);
  abstract getParams(): any;
  abstract getIdOfActiveItem(): string;
  abstract getRouteOfActiveItem(): any[];
  abstract isMainComponent(comp: ILayoutManagerComponent): boolean;
  abstract isTabMode(): boolean;
  abstract setAsActiveFormLayoutManager();
  abstract hasToConfirmExit(data: FormLayoutDetailComponentData, options?: FormLayoutCloseDetailOptions): boolean
  abstract setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean);
  abstract updateIfNeeded(): void;
  abstract updateNavigation(data: any, keysValues: any, insertionMode: boolean);
  abstract getDataToStore(): any;
  abstract getComponentKey(): string;
  abstract closeDetails(detailsKeysData: any[], options?: FormLayoutCloseDetailOptions): void;

}
