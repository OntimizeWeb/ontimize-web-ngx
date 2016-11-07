import {Component, ElementRef, OnInit, Inject, Injector, NgZone,
  Optional, forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {EventEmitter} from '@angular/core';
import {ObservableWrapper} from '../../util/async';

import { MdListModule, MdIconModule, MdToolbarModule, MdButtonModule } from '@angular/material';

import {OntimizeService} from '../../services';
import {dataServiceFactory} from '../../services/data-service.provider';
import {OSearchInputModule, OSearchInputComponent} from '../search-input/o-search-input.component';
import {OListItemModule} from './o-list-item.component';
import {OFormComponent} from '../form/o-form.component';
import {InputConverter} from '../../decorators';
import {Util} from '../../util/util';
import {MdListItemDirective} from '../../directives/MdListItemDirective';
import {IList, IListItem} from '../../interfaces';

export const DEFAULT_INPUTS_O_LIST = [
  'title',
  'filter',
  'refreshButton: refresh-button',
  'queryOnInit: query-on-init',
  'pageable',
  'cssClass: css-class',
  'columns',
  'parentKeys: parent-keys',
  'entity',
  'service',
  'key',
  'route',
  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data'
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onChange'
];

@Component({
  selector: 'o-list',
  templateUrl: 'list/o-list.component.html',
  styleUrls: ['list/o-list.component.css'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps:[Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListComponent implements OnInit, IList {

  public static DEFAULT_INPUTS_O_LIST = DEFAULT_INPUTS_O_LIST;
  public static DEFAULT_OUTPUTS_O_LIST = DEFAULT_OUTPUTS_O_LIST;

  title: string;
  @InputConverter()
  filter: boolean;
  @InputConverter()
  queryOnInit: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  pageable: boolean = false;
  cssclass: string;

  staticData: Array<any>;

  columns: string;
  parentKeys: string;
  entity: string;
  service: string;
  key: string;
  route: string;
  /* End Inputs */

  public mdClick: EventEmitter<any> = new EventEmitter();

  protected dataArray: any[] = [];
  serviceData: any[] = [];
  colArray: string[] = [];
  protected dataService: any;

  private _injector;
  private _router: Router;
  private _actRoute: ActivatedRoute;
  private elRef: ElementRef;

  private _pKeysEquiv = {};

  constructor(
    router: Router,
    actRoute: ActivatedRoute,
    el: ElementRef,
    zone: NgZone,
    injector: Injector,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent) {
    this._router = router;
    this._actRoute = actRoute;
    this.elRef = el;
    this._injector = injector;

  }

  registerListItem(item: MdListItemDirective) {
    if (item) {
     var self = this;
     item.onClick(mdItem => {
       self.doListitemClick(mdItem);
       ObservableWrapper.callEmit(self.mdClick, mdItem.item);
     });
    }
  }

  registerSearchInput(input: OSearchInputComponent) {
    if (input && this.filter) {
      var self = this;
      input.onSearch.subscribe(val => {
        console.log(val);
        self.filterData(val);
      });
    }
  }

  public onListItemClicked(onNext: (item: IListItem) => void): Object {
    return ObservableWrapper.subscribe(this.mdClick, onNext);
  }

  getKey() {
    return this.key;
  }

  ngOnInit(): void {
    this.colArray = Util.parseArray(this.columns);

     //TODO Move to ParseUtils to be used on table, combo, etc....
    let pkArray = Util.parseArray(this.parentKeys);
    if (pkArray && pkArray.length > 0) {
      pkArray.forEach(item => {
        let aux = item.split(':');
        if (aux && aux.length === 2) {
          this._pKeysEquiv[aux[0]] = aux[1];
        } else if (aux && aux.length === 1) {
          this._pKeysEquiv[item] = item;
        }
      });
    }

    if (this.staticData) {
      this.dataArray = this.staticData;
    } else {
      this.configureService();
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

  ngAfterViewInit() {
    if (this.queryOnInit) {
      this.queryData();
    }
  }

  setData(data: any) {
    this.dataArray = data;
  }

  queryData(filter: Object = {}) {
    var self = this;
    if (this.entity && this.entity.length > 0) {
      this.dataService.query(filter, this.colArray, this.entity)
        .subscribe(resp => {
          if (resp.code === 0) {
            self.setData(resp.data);
            self.serviceData = resp.data;
          } else {
            console.log('error');
          }
        }, err => {
          console.log(err);
        });
    }
  }

  onReload() {
    this.queryData();
  }

  doListitemClick(mdItem: MdListItemDirective): void {
    if (mdItem && mdItem.item && mdItem.item.getModel()) {
      let params = {};
      params[this.key] = mdItem.item.getModel()[this.key];
      this._router.navigate(['/' + this.route, params]);
    }
  }


/**
 * Improve this method.
 * Filters data locally.
 *  */
  filterData(value: string) : void {
    if (value && value.length > 0 && this.serviceData && this.serviceData.length > 0) {
      var _val = value;
      var self = this;
      var filteredData: any[] = [];
      this.serviceData.map(item => {
        self.colArray.forEach(col => {
          let current = item[col];
          if (current) {
            if (typeof current === 'string') {
              if (current.toLowerCase().indexOf(_val) >= 0) {
                filteredData.push(item);
              }
            }
          }
        });
      });

      if (filteredData.length > 0) {
        this.setData(filteredData);
      }

    } else {
      this.setData(this.serviceData);
    }
  }

}

@NgModule({
  declarations: [OListComponent],
  imports: [ CommonModule, MdListModule, MdToolbarModule, MdIconModule, MdButtonModule, OListItemModule, OSearchInputModule],
  exports: [OListComponent],
})
export class OListModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListModule,
      providers: []
    };
  }
}

