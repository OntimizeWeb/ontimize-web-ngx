import { Injector } from '@angular/core';
import 'rxjs/add/operator/combineLatest';
import { TreeModel } from 'ng2-tree';

import { InputConverter } from '../../decorators';
import { Util, Codes } from '../../utils';
import { ServiceUtils, ISQLOrder } from '../service.utils';
import { DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT, OServiceBaseComponent } from '../o-service-base-component.class';
import { OTreeNodeComponent } from './node/o-tree-node.component';

const DEFAULT_INPUTS_O_TREE_CLASS = [
  ...DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT,

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  'descriptionColumns: description-columns',

  'separator',

  'parentColumn: parent-column',

  'showRoot: show-root',

  'rootTitle: root-title',

  'recursive',

  'recursiveLevels: recursive-levels',

  'translate',

  'route'
];

export class OTreeClass extends OServiceBaseComponent {
  static DEFAULT_INPUTS_O_TREE_CLASS = DEFAULT_INPUTS_O_TREE_CLASS;

  /* inputs variables */
  protected sortColumns: string;
  protected descriptionColumns: string;
  protected separator: string = Codes.HYPHEN_SEPARATOR;
  protected parentColumn: string;
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
  protected sortColArray: Array<ISQLOrder> = [];
  protected descriptionColArray: Array<string> = [];

  treeNodes: OTreeNodeComponent[] = [];

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  initialize() {
    super.initialize();

    this.sortColArray = ServiceUtils.parseSortColumns(this.sortColumns);
    this.descriptionColArray = Util.parseArray(this.descriptionColumns, true);
  }

  destroy() {
    super.destroy();
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
