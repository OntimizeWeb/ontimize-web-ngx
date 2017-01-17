import {
  Component, ElementRef, OnInit, Inject, Injector, NgZone, AfterContentInit, ContentChildren,
  ViewChild,
  QueryList, Optional, forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { ObservableWrapper } from '../../util/async';
import { Observable } from 'rxjs/Observable';

import { MdCheckbox } from '@angular/material';
import { MdListModule, MdIconModule, MdToolbarModule, MdButtonModule, MdProgressCircleModule } from '@angular/material';

import { OntimizeService, AuthGuardService, OTranslateService } from '../../services';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OSearchInputModule, OSearchInputComponent } from '../search-input/o-search-input.component';
import { OListItemModule } from './o-list-item.component';
import { OFormComponent } from '../form/o-form.component';
import { InputConverter } from '../../decorators';
import { Util } from '../../util/util';
import { OListItemDirective } from './o-list-item.directive';
import { IList } from '../../interfaces';
import { OListItemComponent } from './o-list-item.component';
import { OTranslateModule } from '../../pipes/o-translate.pipe';

import { Subscription } from 'rxjs/Subscription';
export const DEFAULT_INPUTS_O_LIST = [
  // attr [string]: list identifier. It is mandatory if data are provided through the data attribute. Default: entity (if set).
  'attr',
  'title',
  // visible [no|yes]: visibility. Default: yes.
  'visible',
  // enabled [no|yes]: editability. Default: yes.
  'enabled',
  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',
  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',
  //controls [string][yes|no|true|false]:
  'controls',
  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',
  // query-on-init [no|yes]: query table on init. Default: yes.
  'queryOnInit: query-on-init',
  'pageable',
  'cssClass: css-class',
  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',
  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',
  // entity [string]: entity of the service. Default: no value.
  'entity',
  'service',
  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',
  'route',
  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'listData: static-data',
  // detail-form-route [string]: route of detail form. Default: 'detail'.
  'detailFormRoute: detail-form-route',

  // paginated-query-method [string]: name of the service method to perform paginated queries. Default: advancedQuery.
  'paginatedQueryMethod : paginated-query-method',

  // query-rows [number]: number of rows per page. Default: 10.
  'queryRows: query-rows',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method'
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onChange'
];

@Component({
  selector: 'o-list',
  templateUrl: 'list/o-list.component.html',
  styleUrls: ['list/o-list.component.css'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListComponent implements OnInit, IList, AfterContentInit {

  public static DEFAULT_INPUTS_O_LIST = DEFAULT_INPUTS_O_LIST;
  public static DEFAULT_OUTPUTS_O_LIST = DEFAULT_OUTPUTS_O_LIST;
  public static DEFAULT_QUERY_ROWS = 10;

  public loading: boolean = false;
  protected authGuardService: AuthGuardService;
  protected translateService: OTranslateService;

  @InputConverter()
  controls: boolean = true;
  @InputConverter()
  quickFilter: boolean = true;
  @InputConverter()
  queryOnInit: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  pageable: boolean = false;
  @InputConverter()
  visible: boolean = true;
  @InputConverter()
  enabled: boolean = true;

  protected attr: string;
  protected title: string;
  protected cssclass: string;
  protected columns: string;
  protected quickFilterColumns: string;
  protected parentKeys: string;
  protected entity: string;
  protected service: string;
  protected keys: string;
  protected dataKeys: Array<string>;
  protected dataParentKeys: {};
  protected parentItem: any;
  protected route: string;
  protected detailFormRoute: string;
  protected onFormDataSubscribe: any;
  /* End Inputs */

  @ContentChildren(OListItemComponent)
  templateItem: QueryList<OListItemComponent>;

  @ViewChild(OSearchInputComponent)
  searchInputComponent: OSearchInputComponent;

  public mdClick: EventEmitter<any> = new EventEmitter();

  protected dataArray: any[] = [];
  protected listData: any[] = null;
  protected dataColumns: string[] = [];
  protected quickFilterColArray: string[];

  protected dataService: any;

  protected loaderSuscription: Subscription;
  protected querySuscription: Subscription;
  protected queryMethod: string;
  protected paginatedQueryMethod: string;
  protected queryRows: any;

  protected queryRecordOffset: number = 0;
  protected queryTotalRecordNumber: number = 0;
  protected onLanguageChangeSubscribe: any;

  protected dataSelected: any[] = [];
  private _filterValue: string;

  constructor(
    protected _router: Router,
    protected _actRoute: ActivatedRoute,
    public element: ElementRef,
    protected zone: NgZone,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent) {

    this.authGuardService = this._injector.get(AuthGuardService);
    this.translateService = this._injector.get(OTranslateService);

    this.onLanguageChangeSubscribe = this.translateService.onLanguageChanged.subscribe(
      res => {
        console.log('OListComponent TODO onLanguageChangeSubscribe');
      }
    );
  }

  registerListItem(item: OListItemDirective) {
    if (item) {
      var self = this;
      item.onClick(mdItem => {
        self.doListItemClick(mdItem);
        ObservableWrapper.callEmit(self.mdClick, item);
      });
    }
  }

  registerSearchInput(input: OSearchInputComponent) {
    if (input && this.quickFilter) {
      var self = this;
      input.onSearch.subscribe(val => {
        //console.log(val);
        self.filterData(val);
      });
    }
  }


  public onListItemClicked(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  getKeys() {
    return this.dataKeys;
  }

  ngOnInit(): void {
    if (typeof (this.attr) === 'undefined') {
      if (typeof (this.entity) !== 'undefined') {
        this.attr = this.entity.replace('.', '_');
      }
    }

    if (typeof (this.title) !== 'undefined') {
      this.title = this.translateService.get(this.title);
    }

    this.authGuardService.getPermissions(this._router.url, this.attr)
      .then(
      permissions => {
        if (typeof (permissions) !== 'undefined') {
          if (this.visible && permissions.visible === false) {
            this.visible = false;
          }
          if (this.enabled && permissions.enabled === false) {
            this.enabled = false;
          }
        }
      }
      );

    this.dataColumns = Util.parseArray(this.columns);

    if (this.quickFilterColumns) {
      this.quickFilterColArray = Util.parseArray(this.quickFilterColumns);
    } else {
      this.quickFilterColArray = this.dataColumns;
    }

    let pkArray = Util.parseArray(this.parentKeys);
    this.dataParentKeys = Util.parseParentKeysEquivalences(pkArray);

    if (this.keys) {
      this.dataKeys = Util.parseArray(this.keys);
    } else {
      this.dataKeys = [];
    }

    if (this.listData) {
      this.setData(this.listData);
    } else {
      this.configureService();
    }

    if (this.form) {
      this.setFormComponent(this.form);
    }

    if (!this.queryMethod) {
      this.queryMethod = 'query';
    }
    if (!this.paginatedQueryMethod) {
      this.paginatedQueryMethod = 'advancedQuery';
    }
    if (this.queryRows) {
      this.queryRows = parseInt(this.queryRows);
    } else {
      this.queryRows = OListComponent.DEFAULT_QUERY_ROWS;
    }

    if (this.queryOnInit) {
      this.queryData();
    }
  }

  public ngOnDestroy() {
    this.onLanguageChangeSubscribe.unsubscribe();
  }

  ngAfterContentInit() {
    //console.log(this.dataArray);
    this.templateItem.changes.subscribe(() => {
      console.log(this.dataArray);
    });
  }

  ngAfterViewInit() {
    if (this.searchInputComponent) {
      this.registerSearchInput(this.searchInputComponent);
    }
  }

  configureService() {
    this.dataService = this._injector.get(OntimizeService);

    if (Util.isDataService(this.dataService)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }
  }

  setData(data: any) {
    this.dataArray = data;
  }

  queryData(filter: Object = {}, ovrrArgs?: any) {
    if (this.querySuscription) {
      this.querySuscription.unsubscribe();
      this.loaderSuscription.unsubscribe();
    }
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {

      this.setParentKeyValues(filter);

      this.loaderSuscription = this.load();
      let queryArguments = [filter, this.dataColumns, this.entity];
      if (this.pageable) {
        let queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.queryRecordOffset;
        let queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
        queryArguments = queryArguments.concat([undefined, queryOffset, queryRowsN, undefined]);
      }
      var self = this;
      this.querySuscription = this.dataService[queryMethodName].apply(this.dataService, queryArguments)
        .subscribe(res => {
          let data = undefined;
          if (($ as any).isArray(res)) {
            data = res;
          } else if ((res.code === 0) && ($ as any).isArray(res.data)) {
            data = res.data;
            if (this.pageable) {
              this.updatePaginationInfo(res);
            }
          }
          // set list data
          if (($ as any).isArray(data)) {
            let dataArray = data;
            if (self.pageable && !(ovrrArgs && ovrrArgs['replace'])) {
              dataArray = (self.listData || []).concat(data);
            }
            self.listData = dataArray;
            self.filterData(self._filterValue);
          }
          self.loaderSuscription.unsubscribe();
        }, err => {
          console.log('[OList.queryData]: error', err);
          self.loaderSuscription.unsubscribe();
        });
    }
  }

  updatePaginationInfo(queryRes: any) {
    let resultEndIndex = queryRes.startRecordIndex + queryRes.data.length;
    if (queryRes.startRecordIndex !== undefined) {
      this.queryRecordOffset = resultEndIndex;
    }
    if (queryRes.totalQueryRecordsNumber !== undefined) {
      this.queryTotalRecordNumber = queryRes.totalQueryRecordsNumber;
    }
  }

  setParentKeyValues(filter: Object) {
    if (this.dataParentKeys && this.parentItem) {
      for (let key in this.dataParentKeys) {
        if (this.parentItem.hasOwnProperty(key)) {
          filter[this.dataParentKeys[key]] = this.parentItem[key];
        }
      }
    }
  }

  onReload() {
    let queryArgs = {};
    if (this.pageable) {
      this.queryRecordOffset = 0;
      queryArgs = {
        length: this.listData.length,
        replace: true
      };
    }
    this.queryData({}, queryArgs);
  }

  doListItemClick(mdItem: OListItemDirective): void {
    if (mdItem && mdItem.modelData) {
      let route = this.getRouteOfSelectedRow(mdItem.modelData, this.detailFormRoute);
      if (route.length > 0) {
        this._router.navigate(route,
          {
            relativeTo: this._actRoute,
            queryParams: {
              'isdetail': 'true'
            }
          }
        );
      }
    }
    // this._router.navigate(['/' + this.route, params]);
  }

  protected getRouteOfSelectedRow(item: any, modeRoute: any) {
    let route = [];
    // TODO: multiple keys
    let filter = undefined;
    if (typeof (item) === 'object') {
      for (let k = 0; k < this.dataKeys.length; ++k) {
        let key = this.dataKeys[k];
        filter = item[key];
      }
    }
    if (typeof (filter) !== 'undefined') {
      if (modeRoute) {
        route.push(modeRoute);
      }
      route.push(filter);
    }
    return route;
  }

  configureFilterValue(value: string) {
    let returnVal = value;
    if (value && value.length > 0) {
      if (!value.startsWith('*')) {
        returnVal = '*' + returnVal;
      }
      if (!value.endsWith('*')) {
        returnVal = returnVal + '*';
      }

      returnVal = returnVal.replace(new RegExp('[a\u00E1A\u00C1]', 'gi'), '[a\u00E1A\u00C1]');
      returnVal = returnVal.replace(new RegExp('[e\u00E9E\u00C9]', 'gi'), '[e\u00E9E\u00C9]');
      returnVal = returnVal.replace(new RegExp('[i\u00EDI\u00CD]', 'gi'), '[i\u00EDI\u00CD]');
      returnVal = returnVal.replace(new RegExp('[o\u00F3O\u00D3]', 'gi'), '[o\u00F3O\u00D3]');
      returnVal = returnVal.replace(new RegExp('[u\u00FAU\u00DA]', 'gi'), '[u\u00FAU\u00DA]');
      //ñÑ
      returnVal = returnVal.replace(new RegExp('[\u00F1\u00D1]', 'gi'), '[\u00F1\u00D1]');

      returnVal = returnVal.replace(new RegExp('\\*', 'gi'), '.*');
      returnVal = returnVal.replace(new RegExp('\\+', 'gi'), '\\\\+');
      returnVal = returnVal.replace(new RegExp('\\?', 'gi'), '\\\\?');
      returnVal = returnVal.replace(new RegExp('\\(', 'gi'), '\\\\(');
      returnVal = returnVal.replace(new RegExp('\\)', 'gi'), '\\\\)');
    }

    return returnVal;
  }
  /**
   * Improve this method.
   * Filters data locally.
   *  */
  filterData(value: string): void {
    this._filterValue = value;
    if (value && value.length > 0 && this.listData && this.listData.length > 0) {
      var _val = this.configureFilterValue(value);

      var self = this;
      //var filteredData: any[] = [];
      var filteredData = this.listData.filter(item => {
        let found = false;
        let regExp: RegExp = new RegExp(_val, 'i');
        self.quickFilterColArray.forEach(col => {
          let current = item[col];
          if (current) {
            if (typeof current === 'string') {
              let match = regExp.exec(current.toLowerCase());
              if (match && match.length > 0) {
                found = true;
              }
            }
          }
        });
        return found;
      });

      //if (filteredData.length > 0) {
      this.setData(filteredData);
      //}

    } else {
      this.setData(this.listData);
    }
  }

  public load(): any {
    var self = this;
    var loadObservable = new Observable(observer => {
      var timer = window.setTimeout(() => {
        observer.next(true);
      }, 250);

      return () => {
        window.clearTimeout(timer);
        self.loading = false;
      };

    });
    var subscription = loadObservable.subscribe(val => {
      self.loading = val as boolean;
    });
    return subscription;
  }


  public setFormComponent(form: OFormComponent) {
    var self = this;
    this.onFormDataSubscribe = this.form.onFormDataLoaded.subscribe(data => {
      self.parentItem = data;
      self.queryData();
    }
    );

    let dataValues = this.form.getDataValues();
    if (dataValues && Object.keys(dataValues).length > 0) {
      self.parentItem = dataValues;
      self.queryData();
    } else {
      //this.filterForm = true;
    }
  }

  getSelectedItems(): any[] {
    return this.dataSelected;
  }

  isItemSelected(item) {
    let result = this.dataSelected.find(current => {
      let itemKeys = Object.keys(item);
      let currentKeys = Object.keys(current);
      if (itemKeys.length !== currentKeys.length) {
        return false;
      }
      let found = true;
      itemKeys.forEach(key => {
        if (current.hasOwnProperty(key)) {
          if (current[key] !== item[key]) {
            found = false;
          }
        } else {
          found = false;
        }
      });
      return found;
    });
    if (result) {
      return true;
    } else {
      return false;
    }
    //return this.dataSelected.indexOf(item) > -1;
  }

  setSelected(item) {
    let idx = this.dataSelected.indexOf(item);
    if (idx > -1) {
      this.dataSelected.splice(idx, 1);
    } else {
      this.dataSelected.push(item);
    }
  }

  onScroll($event: Event): void {
    let pendingRegistries = this.listData.length < this.queryTotalRecordNumber;
    if (!this.loading && pendingRegistries) {
      let element = $event.srcElement as any;
      if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
        let queryArgs = {
          offset: this.queryRecordOffset,
          length: this.queryRows
        };
        this.queryData({}, queryArgs);
      }
    }
  }
}

@NgModule({
  declarations: [OListComponent],
  imports: [CommonModule, MdListModule, MdToolbarModule, MdIconModule, MdButtonModule, OListItemModule, OSearchInputModule, MdProgressCircleModule, OTranslateModule],
  exports: [OListComponent],
  entryComponents: [MdCheckbox]
})
export class OListModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListModule,
      providers: []
    };
  }
}
