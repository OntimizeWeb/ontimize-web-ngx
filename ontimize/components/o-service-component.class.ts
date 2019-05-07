import { ActivatedRoute } from '@angular/router';
import { Codes, Util } from '../utils';
import { DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT, OServiceBaseComponent } from './o-service-base-component.class';
import { ElementRef, Injector } from '@angular/core';
import { NavigationService, OTranslateService, PermissionsService } from '../services';

import { FilterExpressionUtils } from './filter-expression.utils';
import { InputConverter } from '../decorators';
import { OFilterBuilderComponent } from '../components';
import { OFormComponent } from './form/o-form.component';
import { OFormLayoutDialogComponent } from '../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';
import { OListInitializationOptions } from './list/o-list.component';
import { OTableInitializationOptions } from './table/o-table.component';
import { SelectionModel } from '@angular/cdk/collections';

export const DEFAULT_INPUTS_O_SERVICE_COMPONENT = [
  ...DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT,

  '_title: title',

  // visible [no|yes]: visibility. Default: yes.
  'ovisible: visible',

  // enabled [no|yes]: editability. Default: yes.
  'enabled',

  // controls [string][yes|no|true|false]:
  'controls',

  // detail-mode [none|click|doubleclick]: way to open the detail form of a row. Default: 'click'.
  'detailMode: detail-mode',

  // detail-form-route [string]: route of detail form. Default: 'detail'.
  'detailFormRoute: detail-form-route',

  // recursive-detail [no|yes]: do not append detail keys when navigate (overwrite current). Default: no.
  'recursiveDetail: recursive-detail',

  // detail-button-in-row [no|yes]: adding a button in row for opening detail form. Default: yes.
  'detailButtonInRow: detail-button-in-row',

  // detail-button-in-row-icon [string]: material icon. Default: mode_edit.
  'detailButtonInRowIcon: detail-button-in-row-icon',

  // edit-form-route [string]: route of edit form. Default: 'edit'.
  'editFormRoute: edit-form-route',

  // recursive-edit [no|yes]: do not append detail keys when navigate (overwrite current). Default: no.
  'recursiveEdit: recursive-edit',

  // edit-button-in-row [no|yes]: adding a button in row for opening edition form. Default: no.
  'editButtonInRow: edit-button-in-row',

  // edit-button-in-row-icon [string]: material icon. Default: search.
  'editButtonInRowIcon: edit-button-in-row-icon',

  // insert-button [no|yes]: show insert button. Default: yes.
  'insertButton: insert-button',

  // row-height [small | medium | large]
  'rowHeight : row-height',

  // insert-form-route [string]: route of insert form. Default:
  'insertFormRoute: insert-form-route',

  // recursive-insert [no|yes]: do not append insert keys when navigate (overwrite current). Default: no.
  'recursiveInsert: recursive-insert'
];

export class OServiceComponent extends OServiceBaseComponent {

  public static DEFAULT_INPUTS_O_SERVICE_COMPONENT = DEFAULT_INPUTS_O_SERVICE_COMPONENT;

  protected permissionsService: PermissionsService;
  protected translateService: OTranslateService;
  protected navigationService: NavigationService;

  /* inputs variables */
  set title(val: string) {
    this._title = val;
  }
  get title(): string {
    if (Util.isDefined(this._title)) {
      return this.translateService.get(this._title);
    }
    return this._title;
  }
  protected _title: string;
  @InputConverter()
  protected ovisible: boolean = true;
  @InputConverter()
  protected oenabled: boolean = true;
  @InputConverter()
  protected controls: boolean = true;
  public detailMode: string = Codes.DETAIL_MODE_CLICK;
  protected detailFormRoute: string;
  @InputConverter()
  protected recursiveDetail: boolean = false;
  @InputConverter()
  detailButtonInRow: boolean = false;
  detailButtonInRowIcon: string = Codes.DETAIL_ICON;
  protected editFormRoute: string;
  @InputConverter()
  protected recursiveEdit: boolean = false;
  @InputConverter()
  editButtonInRow: boolean = false;
  editButtonInRowIcon: string = Codes.EDIT_ICON;
  @InputConverter()
  insertButton: boolean;
  rowHeight: string = Codes.DEFAULT_ROW_HEIGHT;
  protected insertFormRoute: string;
  @InputConverter()
  protected recursiveInsert: boolean = false;
  /* end of inputs variables */

  public filterBuilder: OFilterBuilderComponent;
  public selection = new SelectionModel<Element>(true, []);


  protected onTriggerUpdateSubscription: any;
  protected formLayoutManager: OFormLayoutManagerComponent;
  protected oFormLayoutDialog: OFormLayoutDialogComponent;

  constructor(
    injector: Injector,
    protected elRef: ElementRef,
    protected form: OFormComponent
  ) {
    super(injector);
    this.permissionsService = this.injector.get(PermissionsService);
    this.translateService = this.injector.get(OTranslateService);
    this.navigationService = this.injector.get(NavigationService);
    try {
      this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
    } catch (e) {
      // no parent form layout manager
    }
    try {
      this.oFormLayoutDialog = this.injector.get(OFormLayoutDialogComponent);
      this.formLayoutManager = this.oFormLayoutDialog.formLayoutManager;
    } catch (e) {
      // no parent form layout manager
    }
  }

  public initialize(): void {
    super.initialize();
    if (this.detailButtonInRow || this.editButtonInRow) {
      this.detailMode = Codes.DETAIL_MODE_NONE;
    }

    this.rowHeight = this.rowHeight ? this.rowHeight.toLowerCase() : this.rowHeight;
    if (!Codes.isValidRowHeight(this.rowHeight)) {
      this.rowHeight = Codes.DEFAULT_ROW_HEIGHT;
    }
  }

  public afterViewInit(): void {
    super.afterViewInit();
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }

    if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
      this.onTriggerUpdateSubscription = this.formLayoutManager.onTriggerUpdate.subscribe(() => {
        this.reloadData();
      });
    }
  }

  public destroy(): void {
    super.destroy();
    if (this.onTriggerUpdateSubscription) {
      this.onTriggerUpdateSubscription.unsubscribe();
    }
  }

  public isVisible(): boolean {
    return this.ovisible;
  }

  public hasControls(): boolean {
    return this.controls;
  }

  public hasTitle(): boolean {
    return this.title !== undefined;
  }

  public getSelectedItems(): any[] {
    return this.selection.selected;
  }

  public clearSelection(): void {
    this.selection.clear();
  }

  public setSelected(item: any): void {
    this.selection.toggle(item);
  }

  protected navigateToDetail(route: any[], qParams: any, relativeTo: ActivatedRoute): void {
    const extras = {
      relativeTo: relativeTo
    };
    if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
      qParams[Codes.IGNORE_CAN_DEACTIVATE] = true;
      this.formLayoutManager.setAsActiveFormLayoutManager();
    }
    extras[Codes.QUERY_PARAMS] = qParams;
    this.router.navigate(route, extras);
  }

  public insertDetail(): void {
    if (this.oFormLayoutDialog) {
      console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
      return;
    }
    let route = this.getInsertRoute();
    this.addFormLayoutManagerRoute(route);
    if (route.length > 0) {
      const relativeTo = this.recursiveInsert ? this.actRoute.parent : this.actRoute;
      let qParams = {};
      this.navigateToDetail(route, qParams, relativeTo);
    }
  }

  public viewDetail(item: any): void {
    if (this.oFormLayoutDialog) {
      console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
      return;
    }
    let route = this.getItemModeRoute(item, 'detailFormRoute');
    this.addFormLayoutManagerRoute(route);
    if (route.length > 0) {
      let qParams = Codes.getIsDetailObject();
      const relativeTo = this.recursiveDetail ? this.actRoute.parent : this.actRoute;
      this.navigateToDetail(route, qParams, relativeTo);
    }
  }

  public editDetail(item: any): void {
    if (this.oFormLayoutDialog) {
      console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
      return;
    }
    let route = this.getItemModeRoute(item, 'editFormRoute');
    this.addFormLayoutManagerRoute(route);
    if (route.length > 0) {
      let qParams = Codes.getIsDetailObject();
      const relativeTo = this.recursiveEdit ? this.actRoute.parent : this.actRoute;
      this.navigateToDetail(route, qParams, relativeTo);
    }
  }

  protected addFormLayoutManagerRoute(routeArr: any[]): void {
    if (this.formLayoutManager && routeArr.length > 0) {
      const compRoute = this.formLayoutManager.getRouteForComponent(this);
      if (compRoute && compRoute.length > 0) {
        routeArr.unshift(...compRoute);
      }
    }
  }

  protected getEncodedParentKeys(): string {
    let encoded: string;
    if (Object.keys(this._pKeysEquiv).length > 0) {
      const pKeys = this.getParentKeysValues();
      if (Object.keys(pKeys).length > 0) {
        encoded = Util.encodeParentKeys(pKeys);
      }
    }
    return encoded;
  }

  public getInsertRoute(): any[] {
    let route = [];
    if (Util.isDefined(this.detailFormRoute)) {
      route.push(this.detailFormRoute);
    }
    let insertRoute = Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE;
    route.push(insertRoute);
    // adding parent-keys info...
    const encodedParentKeys = this.getEncodedParentKeys();
    if (Util.isDefined(encodedParentKeys)) {
      let routeObj = {};
      routeObj[Codes.PARENT_KEYS_KEY] = encodedParentKeys;
      route.push(routeObj);
    }
    if (route.length > 0) {
      this.storeNavigationFormRoutes('insertFormRoute');
    }
    return route;
  }

  public getItemModeRoute(item: any, modeRoute: string): any[] {
    let result = this.getRouteOfSelectedRow(item);
    if (result.length > 0) {
      if (Util.isDefined(this.detailFormRoute)) {
        result.unshift(this.detailFormRoute);
      }
      if (modeRoute === 'editFormRoute') {
        result.push(this.editFormRoute || Codes.DEFAULT_EDIT_ROUTE);
      }
    }
    if (result.length > 0 && !this.oFormLayoutDialog) {
      this.storeNavigationFormRoutes(modeRoute, this.getQueryConfiguration());
    }
    return result;
  }

  protected getQueryConfiguration(): any {
    let result = {
      keysValues: this.getKeysValues()
    };
    if (this.pageable) {
      result = Object.assign({
        serviceType: this.serviceType,
        queryArguments: this.queryArguments,
        entity: this.entity,
        service: this.service,
        queryMethod: this.pageable ? this.paginatedQueryMethod : this.queryMethod,
        totalRecordsNumber: this.getTotalRecordsNumber(),
        queryRows: this.queryRows,
        queryRecordOffset: (this.state.queryRecordOffset - this.queryRows)
      }, result);
    }
    return result;
  }

  public getRouteOfSelectedRow(item: any): any[] {
    let route = [];
    if (Util.isObject(item)) {
      this.keysArray.forEach(key => {
        if (Util.isDefined(item[key])) {
          route.push(item[key]);
        }
      });
    }
    return route;
  }

  protected deleteLocalItems(): void {
    const selectedItems = this.getSelectedItems();
    for (let i = 0; i < selectedItems.length; ++i) {
      const selectedItem = selectedItems[i];
      const selectedItemKv = {};
      for (let k = 0; k < this.keysArray.length; ++k) {
        let key = this.keysArray[k];
        selectedItemKv[key] = selectedItem[key];
      }
      for (let j = this.dataArray.length - 1; j >= 0; --j) {
        const item = this.dataArray[j];
        const itemKv = {};
        for (let k = 0; k < this.keysArray.length; ++k) {
          const key = this.keysArray[k];
          itemKv[key] = item[key];
        }
        let found = false;
        for (const k in selectedItemKv) {
          if (selectedItemKv.hasOwnProperty(k)) {
            found = itemKv.hasOwnProperty(k) && (selectedItemKv[k] === itemKv[k]);
          }
        }
        if (found) {
          this.dataArray.splice(j, 1);
          break;
        }
      }
    }
    this.clearSelection();
  }

  public reinitialize(options: OListInitializationOptions | OTableInitializationOptions): void {
    if (options && Object.keys(options).length) {
      let clonedOpts = Object.assign({}, options);
      if (clonedOpts.hasOwnProperty('entity')) {
        this.entity = clonedOpts.entity;
        if (this.oattrFromEntity) {
          this.oattr = undefined;
        }
        delete clonedOpts.entity;
      }
      for (var prop in clonedOpts) {
        if (clonedOpts.hasOwnProperty(prop)) {
          this[prop] = clonedOpts[prop];
        }
      }
      this.destroy();
      this.initialize();
    }
  }

  /**
   * Sets the `o-filter-builder` component that this component will use to filter its data.
   * @param filterBuilder the `o-filter-builder` component.
   */
  public setFilterBuilder(filterBuilder: OFilterBuilderComponent): void {
    this.filterBuilder = filterBuilder;
  }

  public getComponentFilter(existingFilter: any = {}): any {
    let filter = super.getComponentFilter(existingFilter);

    // Add filter from o-filter-builder component
    if (Util.isDefined(this.filterBuilder)) {
      let fbFilter = this.filterBuilder.getExpression();
      if (Util.isDefined(fbFilter)) {
        if (!Util.isDefined(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY])) {
          filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = fbFilter;
        } else {
          filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY], fbFilter, FilterExpressionUtils.OP_AND);
        }
      }
    }

    return filter;
  }

  protected storeNavigationFormRoutes(activeMode: string, queryConf?: any): void {
    const mainFormLayoutComp = this.formLayoutManager ? Util.isDefined(this.formLayoutManager.isMainComponent(this)) : undefined;
    this.navigationService.storeFormRoutes({
      mainFormLayoutManagerComponent: mainFormLayoutComp,
      detailFormRoute: this.detailFormRoute,
      editFormRoute: this.editFormRoute,
      insertFormRoute: Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE
    }, activeMode, queryConf);
  }

  protected saveDataNavigationInLocalStorage(): void {
    // Save data of the list in navigation-data in the localstorage
  }

  protected getKeysValues(): any[] {
    const data = this.dataArray;
    const self = this;
    return data.map((row) => {
      const obj = {};
      self.keysArray.forEach((key) => {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });
      return obj;
    });
  }

}
