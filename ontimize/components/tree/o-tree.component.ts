import {
  Component, OnInit, ViewEncapsulation, NgModule, Injector, ElementRef, Optional, Inject,
  forwardRef, OnDestroy, ViewChild, AfterViewInit, EventEmitter, HostListener, NgZone
  // , ContentChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  TreeModule, TreeModel, Ng2TreeSettings, TreeComponent, Tree,
  NodeSelectedEvent, NodeCollapsedEvent, NodeExpandedEvent, NodeMovedEvent, NodeCreatedEvent,
  NodeRemovedEvent, NodeRenamedEvent
  // , RenamableNode
} from 'ng2-tree';
// import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
// import { TreeController } from 'ng2-tree/src/tree-controller';
import { InputConverter } from '../../decorators';
import { OSharedModule } from '../../shared';
import { Util, Codes } from '../../utils';
import { DialogService, LocalStorageService } from '../../services';
import { FilterExpressionUtils } from '../filter-expression.utils';
import { ServiceUtils } from '../service.utils';
import { OFormComponent } from '../form/o-form.component';

import { OTreeClass } from './o-tree.class';
import { OTreeNodeComponent } from './node/o-tree-node.component';

export const DEFAULT_INPUTS_O_TREE = [
  ...OTreeClass.DEFAULT_INPUTS_O_TREE_CLASS,
  'controls'
];

export const DEFAULT_OUTPUTS_O_TREE = [
  'onNodeSelected',
  'onNodeMoved',
  'onNodeCreated',
  'onNodeRemoved',
  'onNodeRenamed',
  'onNodeExpanded',
  'onNodeCollapsed'
];

@Component({
  selector: 'o-tree',
  templateUrl: './o-tree.component.html',
  styleUrls: ['./o-tree.component.scss'],
  inputs: DEFAULT_INPUTS_O_TREE,
  outputs: DEFAULT_OUTPUTS_O_TREE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-tree]': 'tree'
  }
})
export class OTreeComponent extends OTreeClass implements OnInit, AfterViewInit, OnDestroy {

  static DEFAULT_INPUTS_O_TREE = DEFAULT_INPUTS_O_TREE;
  static DEFAULT_OUTPUTS_O_TREE = DEFAULT_OUTPUTS_O_TREE;
  static DEFAULT_ROOT_ROUTE = 'home';

  @InputConverter()
  controls: boolean = true;

  protected state: any;

  onNodeSelected: EventEmitter<any> = new EventEmitter();
  onNodeMoved: EventEmitter<any> = new EventEmitter();
  onNodeCreated: EventEmitter<any> = new EventEmitter();
  onNodeRemoved: EventEmitter<any> = new EventEmitter();
  onNodeRenamed: EventEmitter<any> = new EventEmitter();
  onNodeExpanded: EventEmitter<any> = new EventEmitter();
  onNodeCollapsed: EventEmitter<any> = new EventEmitter();

  @ViewChild('treeComponent') treeComponent: TreeComponent;
  tree: TreeModel;
  settings: Ng2TreeSettings;
  selectedNode: Tree;

  protected localStorageService: LocalStorageService;
  protected dialogService: DialogService;
  protected router: Router;
  protected actRoute: ActivatedRoute;

  constructor(
    injector: Injector,
    protected elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector);
    this.form = form;
    this.localStorageService = this.injector.get(LocalStorageService);
    this.dialogService = this.injector.get(DialogService);
    this.router = this.injector.get(Router);
    this.actRoute = this.injector.get(ActivatedRoute);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    if (this.localStorageService) {
      this.localStorageService.updateComponentStorage(this);
    }
  }

  getComponentKey(): string {
    return 'OTreeComponent_' + this.oattr;
  }

  getDataToStore() {
    let dataToStore = {
    };
    return dataToStore;
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngAfterViewInit() {
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }
    if (this.queryOnInit) {
      this.queryData(this.parentItem);
    }
  }

  ngOnDestroy() {
    this.destroy();

    if (this.localStorageService) {
      this.localStorageService.updateComponentStorage(this);
    }
  }

  initialize(): void {
    super.initialize();

    this.state = this.localStorageService.getComponentStorage(this);

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setTree(this.staticData);
    }
  }

  registerTreeNode(oTreeNode: OTreeNodeComponent) {
    // usar querylist
    this.treeNodes.push(oTreeNode);
  }

  queryData(parentItem: any = undefined, ovrrArgs?: any) {
    // let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    let queryMethodName = this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return;
    }
    parentItem = ServiceUtils.getParentItemFromForm(parentItem, this._pKeysEquiv, this.form);

    if ((Object.keys(this._pKeysEquiv).length > 0) && parentItem === undefined) {
      this.setTree([]);
    } else {
      let filter = ServiceUtils.getFilterUsingParentKeys(parentItem, this._pKeysEquiv);
      if (this.recursive && this.parentColumn !== undefined) {
        const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
        const parentNotNullExpr = FilterExpressionUtils.buildExpressionIsNull(this.parentColumn);
        const filterExpr = FilterExpressionUtils.buildComplexExpression(parentItemExpr, parentNotNullExpr, FilterExpressionUtils.OP_AND);
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = filterExpr;
      }
      let queryArguments = [filter, this.colArray, this.entity];
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
        this.loaderSubscription.unsubscribe();
      }
      this.loaderSubscription = this.load();
      const self = this;
      this.querySubscription = this.dataService[queryMethodName].apply(this.dataService, queryArguments).subscribe(res => {
        let data = undefined;
        if (Util.isArray(res)) {
          data = res;
        } else if ((res.code === 0) && Util.isArray(res.data)) {
          data = res.data;
        }
        self.setTree(data);
        self.loaderSubscription.unsubscribe();
      }, err => {
        self.setTree([]);
        self.loaderSubscription.unsubscribe();
        if (err && typeof err !== 'object') {
          self.dialogService.alert('ERROR', err);
        } else {
          self.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
        }
      });
    }
  }

  protected setTree(treeArray: any[]) {
    let childrenArray: TreeModel[] = [];

    treeArray.forEach(el => {
      childrenArray.push(this.mapTreeNode(el));
    });

    this.tree = {
      value: this.translateService.get(this.title),
      id: 0,
      children: childrenArray,
      settings: {
        rightMenu: this.rightMenu,
        static: this.static,
        cssClasses: {
          expanded: 'material-icons expanded-node',
          collapsed: 'material-icons collapsed-node'
        }
      }
    };

    this.settings = {
      rootIsVisible: this.showRoot
    };
  }

  reloadTree() {
    // if (this.unstructuredData) {
    //   this.static = true;
    //   this.rightMenu = false;
    //   this.setTreefromDirtyArray(this.unstructuredData);
    // } else if (this.data) {
    //   this.setTree(this.data);
    // } else {
    this.queryData();
    // }
  }

  onSearch(textValue: string) {
    // let textFilter = textValue;
    // if (textFilter && textFilter.length > 0) {
    //   textFilter = '*' + textFilter + '*';
    //   if (this.dataService) { // uses dataservice to query data
    //     let nodeDescriptionFilter = {};
    //     if (this.nodeDescription) {
    //       nodeDescriptionFilter[this.nodeDescription] = textFilter;
    //     }
    //     this.queryData(nodeDescriptionFilter);
    //   } else {
    //     // if ( && tree.children.length > 0)
    //   }

    //   // this.treeComponent.getController().expand();
    //   // for (var i = 0; i < tree.children.length; i++) {
    //   //     tree.children[i].loadChildren('');
    //   //     this.treeComponent.getControllerByNodeId(tree.children[i].id).expand();
    //   // }
    // }
  }

  nodeSelected(event: NodeSelectedEvent) {
    if (event && event.node && Util.isDefined(event.node.id)) {
      const node: Tree = event.node;
      // const controller: TreeController = this.treeComponent.getControllerByNodeId(node.id);
      // if (controller && controller.isCollapsed()) {
      //   controller.expand();
      // } else if (controller && controller.isExpanded()) {
      //   controller.collapse();
      // }
      const nodeModel = node.node ? (node.node as any).data : node;
      this.onNodeSelected.emit(nodeModel);
      this.selectedNode = node;

      if (Util.isDefined((node.node as any).route) || (node.id === 0)) {
        let route = '';
        if (node.id === 0) {
          route = OTreeComponent.DEFAULT_ROOT_ROUTE;
        } else {
          let nodeRoute = (node.node as any).route;
          let routeArray = nodeRoute.split(Codes.ROUTE_SEPARATOR);
          for (let i = 0, len = routeArray.length; i < len; i++) {
            if (routeArray[i].startsWith(Codes.ROUTE_VARIABLE_CHAR)) {
              routeArray[i] = nodeModel[routeArray[i].substring(1)];
            }
          }
          route = routeArray.join(Codes.ROUTE_SEPARATOR);
        }
        const extras = {
          relativeTo: this.actRoute
        };
        this.router.navigate([route], extras);
      }
    }
  }

  nodeMoved(event: NodeMovedEvent) {
    if (event && event.node && event.node.id) {
      // if (e.node.parent.id !== e.previousParent.id)
      // const node: Tree = event.node;
      // this.onNodeMoved(node);
    }

    // let nodeToUpdate = {}, data = {};
    // nodeToUpdate[this.valueColumn] = e.node.id;
    // data[this.parentColumn] = e.node.parent.id;
    // if (this.service && this.entity) {
    //   this.dataService.update(nodeToUpdate, data, this.entity).subscribe(resp => {
    //     if (resp && resp.code === 0) {
    //       this.dialogService.info('INFO', e.node.value + ' ha sido trasladado de ' + e.previousParent.value + ' a ' + e.node.parent.value);
    //     } else {
    //       this.dialogService.error('ERROR', 'Ha ocurrido un error a trasladar ' + e.node.value)
    //     }
    //   });
    // }

  }

  nodeCreated(event: NodeCreatedEvent) {
    // if (node && node.node && node.node.value.length > 0 && this.dataService) {
    //   let nodeObject: Tree = node.node;
    //   let nodeToInsert = {};
    // nodeToInsert[this.nodeDescription] = nodeObject.value;
    // if (nodeObject.parent && nodeObject.parent.id) {
    //   nodeToInsert[this.parentColumn] = nodeObject.parent.id;
    // }
    // if (this.codeColumn) {
    //   nodeToInsert[this.codeColumn] = node.node.value.toUpperCase().replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g, '-');
    // }
    // if (this.parentItem) {
    //   nodeToInsert = Object.assign({}, nodeToInsert, this.parentItem);
    // }
    // this.subscriber = this.dataService.insert(nodeToInsert, this.entity).subscribe(resp => {
    //   if (resp && resp.data && resp.data[this.valueColumn]) {
    //     console.log('Element inserted successfully!', resp)
    //     node.node.id = resp.data[this.valueColumn];
    //   }
    // }, err => {
    //   this.dialogService.info('ERROR', 'Ha ocurrido un error a insertar el elemento!');
    //   nodeObject.removeItselfFromParent();
    // });
    // }
  }

  nodeRemoved(event: NodeRemovedEvent) {
    // if (node && node.node && node.node.id && this.dataService) {
    // // this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE_TREE_NODE').then(
    // //     res => {
    // //         if (res === true) {
    // let nodeObject: Tree = node.node;
    // let nodeToDelete = {};
    // nodeToDelete[this.valueColumn] = nodeObject.id;
    // this.subscriber = this.dataService.delete(nodeToDelete, this.entity).subscribe(resp => {
    //   if (resp) {
    //     console.log('Element deleted successfully!', resp.data)
    //   }
    // }, err => {
    //   this.dialogService.info('ERROR', 'Ha ocurrido un error a remover el elemento!');

    // });
    // //     }
    // // });
    // }
  }

  nodeRenamed(event: NodeRenamedEvent) {
    // if (node && node.node && node.node.id && node.node.value.length > 0 && this.dataService) {
    //   // let nodeObject: Tree = node.node;
    //   // let nodeToRename = {};
    //   // nodeToRename[this.valueColumn] = nodeObject.id;
    //   // let data = {};
    //   // data[this.nodeDescription] = nodeObject.value;
    //   // this.subscriber = this.dataService.update(nodeToRename, data, this.entity).subscribe(resp => {
    //   //     if (resp) {
    //   //         console.log('Element renamed successfully!', resp)
    //   //     }
    //   // }, err => {
    //   //     this.dialogService.info('ERROR', 'Ha ocurrido un error a renombrar el elemento!');
    //   // });
    // }
  }

  nodeExpanded(event: NodeExpandedEvent) {
    if (event && event.node && event.node.id) {
      const node: Tree = event.node;
      this.onNodeExpanded.emit(node);
    }
  }

  nodeCollapsed(event: NodeCollapsedEvent) {
    if (event && event.node && event.node.id) {
      const node: Tree = event.node;
      this.onNodeCollapsed.emit(node);
    }
  }


  executeNodeActionById(id: number | string, action: string) {
    const treeController = this.treeComponent.getControllerByNodeId(id);
    if (treeController && typeof treeController[action] === 'function') {
      treeController[action]();
    } else {
      console.log('There isn`t a controller for a node with id - ' + id);
    }
  }

  load(): any {
    var self = this;
    var zone = this.injector.get(NgZone);
    var loadObservable = new Observable(observer => {
      var timer = window.setTimeout(() => {
        observer.next(true);
      }, 250);

      return () => {
        window.clearTimeout(timer);
        zone.run(() => {
          self.loading = false;
        });
      };

    });
    var subscription = loadObservable.subscribe(val => {
      zone.run(() => {
        self.loading = val as boolean;
      });
    });
    return subscription;
  }


}

@NgModule({
  declarations: [
    OTreeComponent,
    OTreeNodeComponent
  ],
  imports: [
    OSharedModule,
    CommonModule,
    TreeModule
  ],
  exports: [
    OTreeComponent,
    OTreeNodeComponent
  ]
})
export class OTreeModule {
}
