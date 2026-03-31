import { EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { OFormLayoutManagerContext } from '../types/form-layout-manager-context.type';
import { FormLayoutCloseDetailOptions, FormLayoutDetailComponentData } from '../types/form-layout-detail-component-data.type';

export interface IOFormLayoutManager {
  oattr: string;
  mode: string;
  separator: string;
  title: string;
  storeState: boolean;
  labelColumns: string;

  readonly tabGroupOptions: any;
  readonly dialogOptions: any;
  readonly splitPaneOptions: any;

  onMainTabSelected: EventEmitter<any>;
  onSelectedTabChange: EventEmitter<any>;
  onCloseTab: EventEmitter<any>;
  onTriggerUpdate: EventEmitter<any>;


  addDetailComponent(childRoute: ActivatedRouteSnapshot, url: string, context?: OFormLayoutManagerContext): void;
  allowToUpdateNavigation(formAttr: string): boolean;
  closeDetail(options?: FormLayoutCloseDetailOptions): void;
  closeDetails(detailsData: any[], options?: FormLayoutCloseDetailOptions): void;
  getAttribute(): string;
  getComponentKey(): string;
  getDataToStore(): any;
  getFormCacheData(): FormLayoutDetailComponentData;
  getFormDataFromLabelColumns(data: any): any;
  getLabelFromData(data: any): string;
  getLabelFromUrlParams(urlParams: object): string;
  getRouteForComponent(comp: any): any[];
  getRouteKey(): string;
  getRouteOfActiveItem(): any[];
  isDialogMode(): boolean;
  isMainComponent(comp: any): boolean;
  isSplitPaneMode(): boolean;
  isTabMode(): boolean;
  reloadMainComponents(): void;
  setAsActiveFormLayoutManager(): void;
  setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean): void;
  updateActiveData(data: any): void;
  updateNavigation(data: any, keysValues: any, insertionMode: boolean): void;
  updateStateStorage(): void;
}
