import {
  Injector
  // , OnInit
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import { TreeModel } from 'ng2-tree';

import { InputConverter } from '../../decorators';
import { Util, Codes } from '../../utils';
import { OTranslateService, OntimizeService } from '../../services';
import { ServiceUtils } from '../service.utils';
import { ISQLOrder } from '../table/o-table.component';
import { OFormComponent } from '../form/o-form.component';
import { OTreeNodeComponent } from './node/o-tree-node.component';

const DEFAULT_INPUTS_O_TREE_CLASS = [
  'oattr: attr',

  // service [string]: JEE service path. Default: no value.
  'service',

  'serviceType : service-type',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // query-on-init [no|yes]: query on init. Default: yes.
  'queryOnInit: query-on-init',

  // query-on-init [no|yes]: query on bind. Default: yes.
  'queryOnBind: query-on-bind',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  'descriptionColumns: description-columns',

  'separator',

  'parentColumn: parent-column',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',

  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data',

  'showRoot: show-root',

  'rootTitle: root-title',

  'recursive',

  'recursiveLevels: recursive-levels',

  'translate',

  'route'
];

export class OTreeClass {
  static DEFAULT_INPUTS_O_TREE_CLASS = DEFAULT_INPUTS_O_TREE_CLASS;

  /* inputs variables */
  protected oattr: string;
  protected service: string;
  protected serviceType: string;
  protected entity: string;
  protected queryMethod: string = Codes.QUERY_METHOD;
  @InputConverter()
  protected queryOnInit: boolean = true;
  @InputConverter()
  protected queryOnBind: boolean = true;
  protected columns: string;
  protected sortColumns: string;
  protected descriptionColumns: string;
  protected separator: string = Codes.HYPHEN_SEPARATOR;
  protected parentColumn: string;
  protected keys: string;
  protected parentKeys: string;
  protected staticData: Array<any>;
  @InputConverter()
  showRoot: boolean = true;
  protected rootTitle: string;
  @InputConverter()
  recursive: boolean = false;
  @InputConverter()
  recursiveLevels: number = 1;
  @InputConverter()
  translate: boolean = false;
  protected route: string;

  /* parsed input variables */
  protected oattrFromEntity: boolean = false;
  protected colArray: Array<string> = [];
  protected sortColArray: Array<ISQLOrder> = [];
  protected descriptionColArray: Array<string> = [];
  protected keysArray: Array<string> = [];
  protected _pKeysEquiv = {};
  dataService: any;
  protected parentItem: any;

  protected translateService: OTranslateService;
  public loading: boolean = false;
  protected loaderSubscription: Subscription;
  protected querySubscription: Subscription;

  treeNodes: OTreeNodeComponent[] = [];
  form: OFormComponent;

  constructor(
    protected injector: Injector
  ) {
    this.translateService = this.injector.get(OTranslateService);
  }

  initialize() {
    if (!Util.isDefined(this.oattr) && Util.isDefined(this.entity)) {
      this.oattr = this.entity.replace('.', '_');
      this.oattrFromEntity = true;
    }

    this.keysArray = Util.parseArray(this.keys);
    this.colArray = Util.parseArray(this.columns, true);
    this.parseSortColumns();
    this.descriptionColArray = Util.parseArray(this.descriptionColumns, true);

    let pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray, Codes.COLUMNS_ALIAS_SEPARATOR);

    if (!this.staticData) {
      this.configureService();
    }
  }

  protected parseSortColumns() {
    this.sortColArray = [];
    if (this.sortColumns) {
      let cols = Util.parseArray(this.sortColumns);
      cols.forEach((col) => {
        let colDef = col.split(Codes.TYPE_SEPARATOR);
        if (colDef.length > 0) {
          let colName = colDef[0];
          const colSort = colDef[1] || Codes.ASC_SORT;
          this.sortColArray.push({
            columnName: colName,
            ascendent: colSort === Codes.ASC_SORT
          });
        }
      });
    }
  }

  destroy() {
    // this.onLanguageChangeSubscribe.unsubscribe();
    // if (this.onFormDataSubscribe) {
    //   this.onFormDataSubscribe.unsubscribe();
    // }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
      this.loaderSubscription.unsubscribe();
    }
    // if (this.onMainTabSelectedSubscription) {
    //   this.onMainTabSelectedSubscription.unsubscribe();
    // }
  }

  configureService() {
    let loadingService: any = OntimizeService;
    if (this.serviceType) {
      loadingService = this.serviceType;
    }
    try {
      this.dataService = this.injector.get(loadingService);
      if (Util.isDataService(this.dataService)) {
        let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
        if (this.entity) {
          serviceCfg['entity'] = this.entity;
        }
        this.dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  getRecursiveChildren(id: any, callback) {
    // let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    let queryMethodName = this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return;
    }
    let parentItem = ServiceUtils.getParentItemFromForm(this.parentItem, this._pKeysEquiv, this.form);
    let filter = (parentItem !== undefined) ? parentItem : {};
    filter[this.parentColumn] = id;

    let queryArguments = [filter, this.colArray, this.entity];
    this.doChildQuery(queryMethodName, queryArguments, callback);
  }

  getTreeNodesChildren(itemdata: any, callback) {
    let children = [];
    this.treeNodes.forEach(childNode => {
      let treeNode = {
        data: itemdata,
        route: this.route,
        value: this.translateService.get(childNode.rootTitle),
        id: childNode.oattr,
        loadChildren: (childNodeCallback) => {
          let queryMethodName = childNode.queryMethod;
          if (!childNode.dataService || !(queryMethodName in childNode.dataService) || !childNode.entity) {
            return;
          }
          let filter = ServiceUtils.getFilterUsingParentKeys(itemdata, childNode._pKeysEquiv);
          let queryArguments = [filter, childNode.colArray, childNode.entity];
          childNode.doChildQuery(queryMethodName, queryArguments, childNodeCallback);
        }
      };

      children.push(treeNode);
    });
    if (this.treeNodes.length === 1 && !this.treeNodes[0].showRoot) {
      children[0].loadChildren(callback);
    } else {
      callback(children);
    }
  }

  protected doChildQuery(queryMethodName: string, queryArguments: any[], callback: any) {
    this.dataService[queryMethodName].apply(this.dataService, queryArguments).subscribe(resp => {
      let children = [];
      if (resp && resp.data && resp.data.length > 0) {
        for (let i = 0, len = resp.data.length; i < len; i++) {
          let child = this.mapTreeNode(resp.data[i]);
          children.push(child);
        }
      }
      callback(children);
    });
  }

  protected mapTreeNode(itemdata: any = {}): TreeModel {
    let treeNode = {
      data: itemdata,
      value: this.getNodeDescription(itemdata),
      id: this.getNodeId(itemdata),
      route: this.route
    };
    if (this.recursive) {
      treeNode['loadChildren'] = (callback) => this.getRecursiveChildren(itemdata[this.keysArray[0]], callback);
    } else if (this.treeNodes.length > 0) {
      treeNode['loadChildren'] = (callback) => this.getTreeNodesChildren(itemdata, callback);
    }
    return treeNode;
  }
  protected getNodeId(item: any = {}) {
    let id = '';
    this.keysArray.forEach(key => {
      id += item[key];
    });
    return id;
  }

  protected getNodeDescription(item: any = {}) {
    let descTxt = '';
    const self = this;
    this.descriptionColArray.forEach((col, index) => {
      let txt = item[col];
      if (txt) {
        if (self.translate && self.translateService) {
          txt = self.translateService.get(txt);
        }
        descTxt += txt;
      }
      if (index < self.descriptionColArray.length - 1) {
        descTxt += self.separator;
      }
    });
    return descTxt;
  }

}
