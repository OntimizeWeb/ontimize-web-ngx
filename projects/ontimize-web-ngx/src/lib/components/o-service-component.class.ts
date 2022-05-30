import { SelectionModel } from '@angular/cdk/collections';
import { ElementRef, EventEmitter, forwardRef, Injector, NgZone, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { OFilterBuilderComponent } from '../components/filter-builder/o-filter-builder.component';
import { OSearchInputComponent } from '../components/input/search-input/o-search-input.component';
import { BooleanConverter, InputConverter } from '../decorators/input-converter';
import { IServiceDataComponent } from '../interfaces/service-data-component.interface';
import { OFormLayoutDialogComponent } from '../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';
import { OFormLayoutTabGroupComponent } from '../layouts/form-layout/tabgroup/o-form-layout-tabgroup.component';
import { NavigationService } from '../services/navigation.service';
import { PermissionsService } from '../services/permissions/permissions.service';
import { AbstractComponentStateClass } from '../services/state/o-component-state.class';
import { AbstractComponentStateService, DefaultComponentStateService } from '../services/state/o-component-state.service';
import { OTranslateService } from '../services/translate/o-translate.service';
import { Expression } from '../types/expression.type';
import { OListInitializationOptions } from '../types/o-list-initialization-options.type';
import { OQueryDataArgs } from '../types/query-data-args.type';
import { OTableInitializationOptions } from '../types/table/o-table-initialization-options.type';
import { ObservableWrapper } from '../util/async';
import { Codes } from '../util/codes';
import { FilterExpressionUtils } from '../util/filter-expression.utils';
import { Util } from '../util/util';
import { OFormComponent } from './form/o-form.component';
import { AbstractOServiceBaseComponent, DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT } from './o-service-base-component.class';

export const DEFAULT_INPUTS_O_SERVICE_COMPONENT = [
  ...DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT,

  '_title: title',

  // visible [no|yes]: visibility. Default: yes.
  'ovisible: visible',

  // enabled [no|yes]: editability. Default: yes.
  'oenabled: enabled',

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
  'recursiveInsert: recursive-insert',

  // filter [yes|no|true|false]: whether filter is case sensitive. Default: no.
  'filterCaseSensitive: filter-case-sensitive',

  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',

  // quick-filter-placeholder: quick filter placeholder
  'quickFilterPlaceholder: quick-filter-placeholder',

  // pagination-controls [yes|no|true|false]: show pagination controls. Default: yes.
  'paginationControls: pagination-controls',

  // page-size-options [string]: Page size options separated by ';'.
  'pageSizeOptions: page-size-options'
];

export const DEFAULT_OUTPUTS_O_SERVICE_COMPONENT = [
  'onClick',
  'onDoubleClick',
  'onDataLoaded',
  'onPaginatedDataLoaded',
  'onSearch'
]

export abstract class AbstractOServiceComponent<T extends AbstractComponentStateService<AbstractComponentStateClass>>
  extends AbstractOServiceBaseComponent<T>
  implements IServiceDataComponent {
  @ViewChild(MatPaginator, { static: false }) matpaginator: MatPaginator;

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
  @InputConverter()
  paginationControls: boolean = true;

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  set pageSizeOptions(val: number[]) {
    if (!(val instanceof Array)) {
      val = Util.parseArray(String(val)).map(a => parseInt(a, 10));
    }
    this._pageSizeOptions = val;
  }

  protected _rowHeight = Codes.DEFAULT_ROW_HEIGHT;
  protected rowHeightSubject: BehaviorSubject<string> = new BehaviorSubject(this._rowHeight);
  public rowHeightObservable: Observable<string> = this.rowHeightSubject.asObservable();

  protected checkViewPortSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public checkViewPortObservable: Observable<boolean> = this.checkViewPortSubject.asObservable();

  set rowHeight(value) {
    this._rowHeight = value ? value.toLowerCase() : value;
    if (!Codes.isValidRowHeight(this._rowHeight)) {
      this._rowHeight = Codes.DEFAULT_ROW_HEIGHT;
    }
    this.rowHeightSubject.next(this._rowHeight);
  }
  get rowHeight(): string {
    return this._rowHeight;
  }
  protected insertFormRoute: string;
  @InputConverter()
  protected recursiveInsert: boolean = false;

  protected _filterCaseSensitive: boolean = false;
  set filterCaseSensitive(value: boolean) {
    this._filterCaseSensitive = BooleanConverter(value);
  }
  get filterCaseSensitive(): boolean {
    return this._filterCaseSensitive;
  }

  protected _quickFilter: boolean = true;
  get quickFilter(): boolean {
    return this._quickFilter;
  }
  set quickFilter(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._quickFilter = val;
    if (val) {
      setTimeout(() => this.registerQuickFilter(this.searchInputComponent), 0);
    }
  }

  public quickFilterPlaceholder: string;
  /* end of inputs variables */

  /* outputs variables */
  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedDataLoaded: EventEmitter<any> = new EventEmitter();
  public onSearch: EventEmitter<any> = new EventEmitter();
  /* end of outputs variables */

  public filterBuilder: OFilterBuilderComponent;
  public selection = new SelectionModel<Element>(true, []);

  protected onTriggerUpdateSubscription: any;
  protected formLayoutManager: OFormLayoutManagerComponent;
  protected formLayoutManagerTabIndex: number;
  public oFormLayoutDialog: OFormLayoutDialogComponent;

  protected tabsSubscriptions: any;

  public quickFilterComponent: OSearchInputComponent;
  @ViewChild((forwardRef(() => OSearchInputComponent)), { static: false })
  public searchInputComponent: OSearchInputComponent;
  protected quickFilterColArray: string[];

  protected dataResponseArray: any[] = [];
  protected quickFilterSubscription: Subscription;
  _pageSizeOptions = Codes.PAGE_SIZE_OPTIONS;

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
  }

  public afterViewInit(): void {
    this.registerFormLayoutManagerState();
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
    if (this.tabsSubscriptions) {
      this.tabsSubscriptions.unsubscribe();
    }
    if (this.quickFilterSubscription) {
      this.quickFilterSubscription.unsubscribe();
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
    if (Util.isDefined(item)) {
      this.selection.toggle(item);
    }
  }

  protected navigateToDetail(route: any[], qParams: any, relativeTo: ActivatedRoute): void {
    const extras = {
      relativeTo: relativeTo
    };
    if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
      qParams[Codes.IGNORE_CAN_DEACTIVATE] = this.formLayoutManager.ignoreCanDeactivate;
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
    const route = this.getInsertRoute();
    this.addFormLayoutManagerRoute(route);
    if (route.length > 0) {
      const relativeTo = this.recursiveInsert ? this.actRoute.parent : this.actRoute;
      const qParams = {};
      if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
        qParams[Codes.INSERTION_MODE] = 'true';
      }
      this.navigateToDetail(route, qParams, relativeTo);
    }
  }

  public viewDetail(item: any): void {
    if (this.oFormLayoutDialog) {
      console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
      return;
    }
    const route = this.getItemModeRoute(item, 'detailFormRoute');
    this.addFormLayoutManagerRoute(route);
    if (route.length > 0) {
      const qParams = Codes.getIsDetailObject();
      const relativeTo = this.recursiveDetail ? this.actRoute.parent : this.actRoute;
      const zone = this.injector.get(NgZone);
      zone.run(() =>
        this.navigateToDetail(route, qParams, relativeTo)
      );
    }
  }

  public editDetail(item: any): void {
    if (this.oFormLayoutDialog) {
      console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
      return;
    }
    const route = this.getItemModeRoute(item, 'editFormRoute');
    this.addFormLayoutManagerRoute(route);
    if (route.length > 0) {
      const qParams = Codes.getIsDetailObject();
      const relativeTo = this.recursiveEdit ? this.actRoute.parent : this.actRoute;
      const zone = this.injector.get(NgZone);
      zone.run(() =>
        this.navigateToDetail(route, qParams, relativeTo)
      );
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
    const route = [];
    if (Util.isDefined(this.detailFormRoute)) {
      route.push(this.detailFormRoute);
    }
    const insertRoute = Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE;
    route.push(insertRoute);
    // adding parent-keys info...
    const encodedParentKeys = this.getEncodedParentKeys();
    if (Util.isDefined(encodedParentKeys)) {
      const routeObj = {};
      routeObj[Codes.PARENT_KEYS_KEY] = encodedParentKeys;
      route.push(routeObj);
    }
    if (route.length > 0) {
      this.storeNavigationFormRoutes('insertFormRoute');
    }
    return route;
  }

  public getItemModeRoute(item: any, modeRoute: string): any[] {
    const result = this.getRouteOfSelectedRow(item);
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
        queryRecordOffset: Math.max(this.state.queryRecordOffset - this.queryRows, 0)
      }, result);
    }
    return result;
  }

  public getRouteOfSelectedRow(item: any): any[] {
    const route = [];
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
        const key = this.keysArray[k];
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
      const clonedOpts = Object.assign({}, options);
      if (clonedOpts.hasOwnProperty('entity')) {
        this.entity = clonedOpts.entity;
        if (this.oattrFromEntity) {
          this.oattr = undefined;
        }
        delete clonedOpts.entity;
      }
      for (const prop in clonedOpts) {
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
    const filter = super.getComponentFilter(existingFilter);

    const quickFilterExpr = this.getQuickFilterExpression();
    const filterBuilderExpr = this.getFilterBuilderExpression();
    let complexExpr = quickFilterExpr || filterBuilderExpr;
    if (quickFilterExpr && filterBuilderExpr) {
      complexExpr = FilterExpressionUtils.buildComplexExpression(quickFilterExpr, filterBuilderExpr, FilterExpressionUtils.OP_AND);
    }

    if (complexExpr && !Util.isDefined(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY])) {
      filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = complexExpr;
    } else if (complexExpr) {
      filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] =
        FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY], complexExpr, FilterExpressionUtils.OP_AND);
    }

    return filter;
  }

  protected getQuickFilterExpression(): Expression {
    if (this.pageable && Util.isDefined(this.quickFilterComponent)) {
      return this.quickFilterComponent.filterExpression;
    }
    return undefined;
  }

  protected getFilterBuilderExpression(): Expression {
    // Add filter from o-filter-builder component
    if (Util.isDefined(this.filterBuilder)) {
      return this.filterBuilder.getExpression();
    }
    return undefined;
  }

  protected storeNavigationFormRoutes(activeMode: string, queryConf?: any): void {
    const mainFormLayoutComp = this.formLayoutManager ? Util.isDefined(this.formLayoutManager.isMainComponent(this)) : undefined;
    this.navigationService.storeFormRoutes({
      mainFormLayoutManagerComponent: mainFormLayoutComp,
      isMainNavigationComponent: true,
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

  getRouteKey(): string {
    let route = '';
    if (this.formLayoutManager && !this.formLayoutManager.isMainComponent(this)) {
      route = this.router.url;
      const params = this.formLayoutManager.getParams();
      if (params) {
        route += '/' + (Object.keys(params).join('/'));
      }
    } else {
      route = super.getRouteKey();
    }
    return route;
  }

  get elementRef(): ElementRef {
    return this.elRef;
  }

  public showCaseSensitiveCheckbox(): boolean {
    return !this.pageable;
  }

  public registerQuickFilter(arg: any): void {
    const quickFilter = (arg as OSearchInputComponent);
    if (Util.isDefined(this.quickFilterComponent)) {
      // avoiding to register a quickfiltercomponent if it already exists one
      return;
    }
    this.quickFilterComponent = quickFilter;
    if (Util.isDefined(this.quickFilterComponent)) {
      this.quickFilterSubscription = this.quickFilterComponent.onSearch.subscribe(val => {
        this.onSearch.emit(val);
        this.filterData(val);
      });
      if (Util.isDefined(this.state)) {
        if ((this.state.quickFilterValue || '').length > 0) {
          this.quickFilterComponent.setValue(this.state.quickFilterValue, {
            emitEvent: true
          });
        }
      }
    }
  }

  public isFilterCaseSensitive(): boolean {
    const useQuickFilterValue = Util.isDefined(this.quickFilterComponent) && this.showCaseSensitiveCheckbox();
    if (useQuickFilterValue) {
      return this.quickFilterComponent.filterCaseSensitive;
    }
    return this.filterCaseSensitive;
  }

  public configureFilterValue(value: string): string {
    let returnVal = value;
    if (value && value.length > 0) {
      if (!value.startsWith('*')) {
        returnVal = '*' + returnVal;
      }
      if (!value.endsWith('*')) {
        returnVal = returnVal + '*';
      }
    }
    return returnVal;
  }

  public getQuickFilterValue(): string {
    const result = '';
    if (Util.isDefined(this.quickFilterComponent)) {
      return this.quickFilterComponent.getValue() || '';
    }
    return result;
  }

  public getQuickFilterColumns(): string[] {
    let result = this.quickFilterColArray;
    if (Util.isDefined(this.quickFilterComponent)) {
      result = this.quickFilterComponent.getActiveColumns();
    }
    return result;
  }

  /**
   * Filters data locally
   * @param value the filtering value
   */
  public filterData(value?: string, loadMore?: boolean): void {
    value = Util.isDefined(value) ? value : Util.isDefined(this.quickFilterComponent) ? this.quickFilterComponent.getValue() : void 0;
    if (Util.isDefined(this.state) && Util.isDefined(value)) {
      this.state.quickFilterValue = value;
    }
    if (this.pageable) {
      const queryArgs: OQueryDataArgs = {
        offset: 0,
        length: this.queryRows,
        replace: true
      };
      this.queryData(void 0, queryArgs);
      return;
    }
    if (this.dataResponseArray && this.dataResponseArray.length > 0) {
      let filteredData = this.dataResponseArray.slice(0);
      filteredData = this.getQuickFilterDataFromArray(value, filteredData);
      filteredData = this.getSortedDataFromArray(filteredData);
      filteredData = this.getPaginationDataFromArray(filteredData);
      this.setDataArray(filteredData);
    } else {
      this.setDataArray(this.dataResponseArray);
    }
  }

  protected getQuickFilterDataFromArray(quickfilter: string, dataArray: any[]): any[] {
    let result = dataArray;
    if (quickfilter && quickfilter.length > 0) {
      const caseSensitive = this.isFilterCaseSensitive();
      const quickFilterColumns = this.getQuickFilterColumns();
      const regExpStr = new RegExp(Util.escapeSpecialCharacter(Util.normalizeString(quickfilter, !caseSensitive)));
      result = dataArray.filter(item => {
        return quickFilterColumns.some(col => regExpStr.test(Util.normalizeString(item[col] + '', !caseSensitive)));
      });
    }
    return result;
  }

  protected getSortedDataFromArray(dataArray: any[]): any[] {
    return dataArray;
  }

  protected setData(data: any, sqlTypes?: any, replace?: boolean): void {
    if (!Util.isArray(data)) {
      this.setDataArray([]);
    } else {
      this.dataResponseArray = this.parseResponseArray(data, replace);
      if (this.pageable) {
        this.setDataArray(this.dataResponseArray);
      } else {
        this.filterData();
      }
    }
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onDataLoaded, this.dataResponseArray);
  }

  protected parseResponseArray(data: any[], replace?: boolean) {
    return data;
  }

  protected registerFormLayoutManagerState() {
    if (this.storeState && this.formLayoutManager && this.formLayoutManager.isTabMode() && this.formLayoutManager.oTabGroup) {
      if (!Util.isDefined(this.formLayoutManagerTabIndex)) {
        this.formLayoutManagerTabIndex = this.formLayoutManager.oTabGroup.data.length;
      }
      const updateComponentStateSubject = (this.formLayoutManager.oTabGroup as OFormLayoutTabGroupComponent).updateTabComponentsState;

      this.tabsSubscriptions = this.formLayoutManager.onSelectedTabChange.subscribe((arg) => {
        if (this.formLayoutManagerTabIndex === arg.previousIndex) {
          this.updateStateStorage();
          // setting alreadyStored to false to force triggering a new storage update after this
          this.alreadyStored = false;
          if (arg.index !== 0) {
            updateComponentStateSubject.next(arg);
          }
        }
        this.checkViewPortSubject.next(true);
      });

      this.tabsSubscriptions.add(updateComponentStateSubject.subscribe((arg) => {
        if (this.formLayoutManagerTabIndex === arg.index) {
          this.componentStateService.initialize(this);
          this.applyDefaultConfiguration();
        }
      }));

      this.tabsSubscriptions.add(this.formLayoutManager.onCloseTab.subscribe((arg) => {
        if (this.formLayoutManagerTabIndex === arg.index) {
          this.updateStateStorage();
        }
      }));
    }
  }

  applyDefaultConfiguration() {

  }

  public onChangePage(e: PageEvent): void {
    if (!this.pageable) {
      this.currentPage = e.pageIndex;
      this.queryRows = e.pageSize;
      this.filterData();
      return;
    }
    const goingBack = e.pageIndex < this.currentPage;
    this.currentPage = e.pageIndex;
    const pageSize = e.pageSize;

    const oldQueryRows = this.queryRows;
    const changingPageSize = (oldQueryRows !== pageSize);
    this.queryRows = pageSize;

    let newStartRecord;
    let queryLength;

    if (goingBack || changingPageSize) {
      newStartRecord = (this.currentPage * this.queryRows);
      queryLength = this.queryRows;
    } else {
      newStartRecord = Math.max(this.state.queryRecordOffset, (this.currentPage * this.queryRows));
      const newEndRecord = Math.min(newStartRecord + this.queryRows, this.state.totalQueryRecordsNumber);
      queryLength = Math.min(this.queryRows, newEndRecord - newStartRecord);
    }

    const queryArgs: OQueryDataArgs = {
      offset: newStartRecord,
      length: queryLength,
      replace: true
    };
    this.queryData(void 0, queryArgs);
  }

  set currentPage(val: number) {
    this._currentPage = val;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  protected _currentPage: number = 0;


  get totalRecords(): number {
    if (this.pageable) {
      return this.getTotalRecordsNumber();
    }
    return this.dataResponseArray.length;
  }

  protected getPaginationDataFromArray(dataArray: any[]): any[] {
    let result: any[];
    if (this.paginationControls) {
      result = dataArray.splice(this.currentPage * this.queryRows, this.queryRows);
    } else {
      result = dataArray.splice(0, this.queryRows * (this.currentPage + 1));
    }
    return result;
  }

}

/*This class is definied to mantain bacwards compatibility */
export class OServiceComponent extends AbstractOServiceComponent<DefaultComponentStateService> {

}
