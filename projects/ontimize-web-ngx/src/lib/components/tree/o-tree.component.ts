import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { AsyncPipe, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';

import { OTranslatePipe } from '../../pipes/o-translate.pipe';
import { OSearchInputComponent } from '../input/search-input/o-search-input.component';
import { OTreeMenuComponent } from './header/tree-menu/o-tree-menu.component';
import { Observable, Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../decorators/input-converter';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { ComponentStateServiceProvider, OntimizeServiceProvider } from '../../services/factories';
import { OTreeComponentStateService } from '../../services/state/o-tree-component-state.service';
import { OActionStyleProvider } from '../../types/o-action-style.type';
import { OTreePermissions } from '../../types/o-tree-permissions.type';
import { OTreeFlatNode } from '../../types/tree-flat-node.type';
import { Codes } from '../../util/codes';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { AbstractOServiceComponent } from '../o-service-component.class';
import { OTreeDao } from './o-tree-dao.service';
import { OTreeDataSource } from './o-tree.datasource';
import type { OTreeNodeComponent } from './tree-node/tree-node.component';
import { O_TREE_NODE_TOKEN } from './o-tree-tokens';
import { ServiceUtils } from '../../util/service.utils';
import { OPermissions } from '../../types/o-permissions.type';
import { SQLOrder } from '../../types/sql-order.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { MatPaginator } from '@angular/material/paginator';
import { OTreeComponentStateClass } from '../../services/state/o-tree-component-state.class';
import { OQueryParams } from '../../types/query-params.type';
import { O_COMPONENT_STATE_SERVICE } from '../../injection-tokens';


export const DEFAULT_INPUTS_O_TREE = [
  // attr [string]: list identifier. It is mandatory if data are provided through the data attribute. Default: entity (if set).
  'oattr: attr',

  // service [string]: JEE service path. Default: no value.
  'service',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // insert-button [no|yes]: show insert button. Default: yes.
  'insertButton: insert-button',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  // delete-button [no|yes]: show delete button when user select items. Default: yes.
  'deleteButton: delete-button',

  // END OF DEFAULT_INPUTS_O_SERVICE_COMPONENT
  'visibleColumns: visible-columns',
  'selectAllCheckbox: select-all-checkbox',
  'separator',
  'parentColumn: parent-column',
  'sortColumn: sort-column',
  // select-all-checkbox-visible [yes|no|true|false]: show selection check boxes.Default: no.
  'selectAllCheckboxVisible: select-all-checkbox-visible',
  // filter [yes|no|true|false]: whether filter is case sensitive. Default: no.
  'filterCaseSensitive: filter-case-sensitive',
  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',
  // quick-filter-placeholder: quick filter placeholder
  'quickFilterPlaceholder: quick-filter-placeholder',
  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',
  // detail-mode [none|click|doubleclick]: way to open the detail form of a row. Default: 'click'.
  'detailMode: detail-mode',
  // detail-form-route [string]: route of detail form. Default: 'detail'.
  'detailFormRoute: detail-form-route',
  // show-buttons-text [yes|no|true|false]: show text of header buttons. Default: yes.
  'showButtonsText: show-buttons-text',
  'rootTitle: root-title',
  'recursive',
  'route'
];

export const DEFAULT_OUTPUTS_O_TREE = ['onNodeSelected', 'onNodeExpanded', 'onNodeCollapsed', 'onLoadNextLevel', 'onDataLoaded', 'onNodeClick'];

@Component({
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, NgTemplateOutlet, MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatTreeModule, OTranslatePipe, OSearchInputComponent, OTreeMenuComponent],
  selector: 'o-tree',
  templateUrl: './o-tree.component.html',
  styleUrls: ['./o-tree.component.scss'],
  inputs: DEFAULT_INPUTS_O_TREE,
  outputs: DEFAULT_OUTPUTS_O_TREE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-tree]': 'true'
  },
  providers: [
    OTreeDao,
    OntimizeServiceProvider,
    ComponentStateServiceProvider,
    { provide: O_COMPONENT_STATE_SERVICE, useClass: OTreeComponentStateService },
    { provide: OActionStyleProvider, useExisting: forwardRef(() => OTreeComponent) },
  ]
})

export class OTreeComponent extends AbstractOServiceComponent<OTreeComponentStateService> implements OnInit, OnDestroy, AfterViewInit {

  getLevel = (node: OTreeFlatNode) => node.level;

  isExpandable = (node: OTreeFlatNode) => node.expandable;

  getChildren = (node: OTreeFlatNode): any => {
    if (this.recursive) {
      return this.getRecursiveChildrenNode(node);
    } else {
      return this.getTreeNodeChildren(node);
    }
  }

  getTreeNodeChildren(node: OTreeFlatNode): any {
    if (node.level === 0 && Util.isDefined(this.rootTitle)) {
      return this.rootNodes;
    } else if (node.childNode) {
      if (Util.isDefined(node.childNode.rootTitle) && !Util.isDefined(node.rootNode)) {
        let rootNode: OTreeFlatNode = {
          id: this.dataSource.data.length + 1, rootNode: true, label: this.translateService.get(node.childNode.rootTitle), level: node.level + 1, expandable: true, data: node.data, isLoading: false, node: node.childNode, childNode: node.childNode
        };
        this.daoTree.flatNodeMap.set(rootNode, node);
        return [rootNode];
      } else {
        return this.childQueryData(node);
      }
    } else {
      return this.childreNodes.filter((item) => item[this.parentKeys] === node[this.keys]);
    }
  }

  getRecursiveChildrenNode(node: OTreeFlatNode): any {
    if (node.level === 0 && Util.isDefined(this.rootTitle)) {
      return this.rootNodes;
    } else {
      return this.childQueryData(node);
    }

  }
  getComponentFilter(existingFilter: any = {}): any {
    let filter = existingFilter;
    if (this.recursive && this.parentColumn !== undefined) {
      const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
      const parentNotNullExpr = FilterExpressionUtils.buildExpressionIsNull(this.parentColumn);
      const filterExpr = FilterExpressionUtils.buildComplexExpression(parentItemExpr, parentNotNullExpr, FilterExpressionUtils.OP_AND);
      filter = {};
      filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = filterExpr;
    }
    return super.getComponentFilter(filter);
  }

  hasChild = (_: number, _nodeData: OTreeFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: OTreeFlatNode) => _nodeData.label === '';

  hasLoadMore = (node: OTreeFlatNode) => this.getLogicalLevel(node) > 0 && this.treeControl.isExpanded(node) && node.node.pageable;

  onLoadMore(event: Event, node: OTreeFlatNode) {
    event.stopPropagation();
    event.preventDefault();

    const parentNode = this.getParentNode(node);

    if (!parentNode || parentNode.isLoading) return;

    parentNode.isLoading = true;
    parentNode.offset = Math.min(
      (parentNode.offset ?? 0) + parentNode.childNode.queryRows,
      parentNode.totalQueryRecordsNumber);
    parentNode.hasMore = parentNode.offset + parentNode.childNode.queryRows < parentNode.totalQueryRecordsNumber;

    this.getChildren(parentNode).subscribe({
      next: (res: ServiceResponse) => {
        if (res.isSuccessful()) {
          const newData = res.data || [];
          this.dataSource.updateTree(parentNode, newData, true);
        }
      },
      error: (err) => {
        this.dialogService.error('ERROR', 'MESSAGES.ERROR_QUERY');
        parentNode.isLoading = false;
      }
    });
  }

  isLastChildAndHasMore(node: OTreeFlatNode): boolean {

    let parent = this.daoTree.flatNodeMap.get(node);
    if (!parent?.hasMore) return false;

    const siblings = this.treeControl.getDescendants(parent)
      .filter(child => child.level === node.level);

    if (!siblings || siblings.length === 0) return false;

    const lastSibling = siblings[siblings.length - 1];
    return node.id === lastSibling.id;
  }

  dataSource: OTreeDataSource;

  @BooleanInputConverter()
  refreshButton: boolean = true;
  @BooleanInputConverter()
  deleteButton: boolean = false;
  @BooleanInputConverter()
  showButtonsText: boolean = false;

  visibleColumns: string;
  separator: string = Codes.HYPHEN_SEPARATOR;
  parentColumn: string;
  sortColumn: string;
  @BooleanInputConverter()
  selectAllCheckboxVisible: boolean = false;
  @BooleanInputConverter()
  selectAllCheckbox: boolean = false;
  @BooleanInputConverter()
  recursive: boolean = false;

  protected _quickFilter: boolean = false;
  paginationControls = false;
  quickFilterColumns: string;
  selectedNode: OTreeFlatNode;
  childreNodes: OTreeFlatNode[] = [];
  nodesArray: OTreeFlatNode[] = [];
  ancestors: any[] = [];

  onNodeSelected: EventEmitter<any> = new EventEmitter();
  onNodeExpanded: EventEmitter<any> = new EventEmitter();
  onNodeCollapsed: EventEmitter<any> = new EventEmitter();
  onLoadNextLevel: EventEmitter<any> = new EventEmitter();
  onNodeClick: EventEmitter<any> = new EventEmitter<any>();
  rootTitle: string;
  rootNodes: OTreeFlatNode[] = [];
  daoTree: OTreeDao;

  @ContentChild('leafNodeTemplate', { read: TemplateRef, static: false })
  leafNodeTemplate: TemplateRef<any>;

  @ContentChild('parentNodeTemplate', { read: TemplateRef, static: false })
  parentNodeTemplate: TemplateRef<any>;

  treeFlattener: any;
  treeControl: FlatTreeControl<OTreeFlatNode, OTreeFlatNode>

  @ViewChild(MatPaginator) matpaginator: MatPaginator;

  @ContentChild('nodeTemplate', { read: TemplateRef, static: false })
  set nodeTemplate(value: TemplateRef<any>) {
    if (value != null) {
      this.leafNodeTemplate = value;
      this.parentNodeTemplate = value;
    }
  }

  @ContentChild(O_TREE_NODE_TOKEN, { descendants: false })
  treeNode!: OTreeNodeComponent;
  protected permissions: OTreePermissions;
  protected actionsPermissions: OPermissions[];
  protected visibleColumnsArray: string[] = [];
  public enabledDeleteButton: boolean = false;
  protected subscription: Subscription = new Subscription();
  public route: string;
  public sortColumnArray: SQLOrder[];

  get showTreeMenuButton(): boolean {
    const staticOpt = this.selectAllCheckbox;
    return staticOpt;
  }
  constructor(
    public injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    this.daoTree = this.injector.get(OTreeDao)

  }

  ngOnInit() {
    this.setTreeControl();
    this.setDatasource();
    this.initialize();
    this.initializeParams();

    this.subscription.add(
      this.selection.changed.subscribe(
        () => (this.enabledDeleteButton = !this.selection.isEmpty())
      )
    );
    this.permissions = this.permissionsService.getTreePermissions(this.oattr, this.actRoute);
    this.actionsPermissions = this.getActionsPermissions(this.permissions);
    this.setButtonPermissions(this.actionsPermissions);
  }


  public initialize(): void {
    super.initialize();
    this.initializeDao();
  }

  protected initializeDao() {

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
    }
  }

  initializeParams(): void {
    // If visible-columns is not present then visible-columns is all columns
    if (!this.visibleColumns) {
      this.visibleColumns = this.columns;
    }

    if (this.state) {
      this.state.queryRecordOffset = 0;
      this.currentPage = this.state.currentPage ?? 0;
    }
    if (!Util.isDefined(this.quickFilterColumns)) {
      this.quickFilterColumns = this.visibleColumns;
    }
    this.parseSortColumn();
  }

  get state(): OTreeComponentStateClass {
    return this.componentStateService.state;
  }

  ngAfterViewInit(): void {
    this.visibleColumnsArray = Util.parseArray(this.visibleColumns, true);
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
    this.setDatasource();
    this.afterViewInit();
    this.registerQuickFilter(this.searchInputComponent);
    if (this.queryOnInit) {
      this.queryData();
    }
    this.manageCustomPermissions(this.actionsPermissions, '[o-tree-button]');
  }

  ngOnDestroy(): void {
    this.destroy();
    this.subscription.unsubscribe();
  }

  registerTreeNode(oTreeNode: OTreeNodeComponent) {
    // this.dataSource.data.forEach()
  }

  checkboxClicked(event: Event): void {
    event.stopPropagation();
  }

  leafNodeClicked(event: Event, node: OTreeFlatNode): void {
    this.nodeClicked(node, event);
  }

  parentNodeClicked(event: Event, node: OTreeFlatNode): void {
    this.nodeClicked(node, event);
  }

  protected nodeClicked(node: OTreeFlatNode, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.onNodeClick.emit(node);
    this.selectedNode = node;
    if (this.detailMode !== Codes.DETAIL_MODE_NONE && !this.isRootNode(node)) {
      node.node.viewDetail(node.data, { label: node.label });
    }
  }

  isRootNode(node: OTreeFlatNode) {
    return Util.isDefined(node.rootNode) && node.rootNode;
  }

  onClickToggleButton(event: Event, node) {
    event.stopPropagation();
    if (this.treeControl.isExpanded(node)) {
      this.onNodeExpanded.emit(node);
    } else {
      this.onNodeCollapsed.emit(node);
    }
  }
  /**
  * Toggle the node, remove from display list
  */
  toggleNode(node: OTreeFlatNode, expand: boolean) {
    node.isLoading = true;
    if (expand && node.expandable) {
      const children = this.getChildren(node);
      if (Util.isArray(children)) {
        this.dataSource.updateTree(node, children, expand);
      } else {
        this.updateAsyncTree(children, node, expand);
      }
    } else {
      this.dataSource.updateTree(node, [], expand);
    }

  }

  private updateAsyncTree(children: any, flatNode: OTreeFlatNode, expand: boolean) {
    children.subscribe((res: ServiceResponse) => {
      let data;
      if (res.isSuccessful()) {
        const arrData = (res.data !== undefined) ? res.data : [];
        data = Util.isArray(arrData) ? arrData : [];
      }

      const node = this.recursive ? flatNode.node : flatNode.childNode;
      flatNode.hasMore = false;

      flatNode.totalQueryRecordsNumber = node.pageable ? res.totalQueryRecordsNumber : data.length;

      const canLoadMore = this.hasLoadMore(flatNode);
      flatNode.hasMore = false;
      if (canLoadMore) {
        flatNode.hasMore = Util.isDefined(res.startRecordIndex) ? (node.queryRows + res.startRecordIndex < res.totalQueryRecordsNumber) : (this.queryRows < data.length);
      }
      this.dataSource.updateTree(flatNode, data, expand);
    }, err => {
      flatNode.isLoading = false;
      if (Util.isDefined(this.queryFallbackFunction)) {
        this.queryFallbackFunction(err);
      } else {
        this.oErrorDialogManager.openErrorDialog(err);
        console.error(err);
      }
    });

  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OTreeFlatNode): void {
    this.todoItemSelectionToggle(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OTreeFlatNode): void {
    this.selection.toggle(node);

    const descendants = this.treeControl.getDescendants(node);
    this.selection.isSelected(node)
      ? this.selection.select(...descendants)
      : this.selection.deselect(...descendants);

    // Force update for the parent
    descendants.every((child) => this.selection.isSelected(child));
    this.onNodeSelected.emit(node.data);


  }


  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: OTreeFlatNode): boolean {
    let descAllSelected = false;
    const descendants = this.treeControl.getDescendants(node);
    if (node.expandable) {

      if (this.treeControl.isExpanded(node) && descendants.length > 0) {
        descAllSelected = descendants.every((child) =>
          this.selection.isSelected(child)
        );
        descAllSelected ? this.selection.select(node) : this.selection.deselect(node);
        return descAllSelected;
      } else {
        return this.selection.isSelected(node);
      }

    } else {
      return this.selection.isSelected(node);
    }

  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OTreeFlatNode): boolean {

    let result = false;
    const descendants = this.treeControl.getDescendants(node);
    if (node.expandable) {
      if (descendants.length > 0) {
        result = descendants.some((child) =>
          this.selection.isSelected(child)
        );
      }
    }
    return result && !this.descendantsAllSelected(node);

  }


  protected setTreeControl() {
    if (!Util.isDefined(this.treeControl)) {
      this.treeControl = new FlatTreeControl<OTreeFlatNode>(this.getLevel, this.isExpandable);
    }
  }
  /** */

  protected setDatasource() {
    if (!Util.isDefined(this.dataSource)) {
      this.dataSource = new OTreeDataSource(this, this.treeControl, this.injector);
    }

  }

  getParentNodes(node: OTreeFlatNode, index: number, tree: OTreeFlatNode[]): OTreeFlatNode[] {
    let parentNode = this.daoTree.flatNodeMap.get(node);
    if (Util.isDefined(parentNode)) {
      const existingNode = tree.findIndex(x => x['id'] === parentNode['id']) > -1;
      if (Util.isDefined(parentNode)) {
        if (!existingNode) {
          //if not exist node in tree then, add parent before node
          tree.splice(index, 0, parentNode)
          return this.getParentNodes(parentNode, index, tree);
        } else {
          //if not exist node in tree then, add parent before node
          return this.getParentNodes(parentNode, index, tree);
        }
      } else {
        return tree;
      }
    } else {
      return tree;
    }
  }

  filterData(value?: string, loadMore?: boolean): void {

    if (this.pageable) {
      const queryArgs: OQueryDataArgs = {
        offset: 0,
        length: this.queryRows,
        replace: true
      };
      this.queryData(void 0, queryArgs);
      return;
    }

    let filteredTreeData = [];
    if (value) {
      for (let [nestedNode] of this.daoTree.flatNodeMap) {
        if (nestedNode.label.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {
          filteredTreeData.push(nestedNode);
        }
      };

      let index = 0;
      while (index < filteredTreeData.length) {
        let node = filteredTreeData[index];
        const parentNodes = this.getParentNodes(node, index, filteredTreeData);
        if (!Util.isArrayEmpty(parentNodes)) {
          filteredTreeData = parentNodes;
        }
        index++;
      }
      this.dataSource.data = filteredTreeData;
    } else {
      filteredTreeData = this.dataResponseArray;
      this.setDataArray(filteredTreeData);
    }


    // Notify the change.
    if (value) {
      let rootNodes = filteredTreeData.filter(node => node.level == 0);
      this.expandNodesWithNodes(rootNodes);
    }

  }
  /**
   * Expands nodes with nodes
   * @param treeData
   */
  expandNodesWithNodes(treeData: OTreeFlatNode[]) {
    treeData.filter(node => node.expandable).forEach(node => {
      const descendants = this.treeControl.getDescendants(node);
      if (descendants.length > 0) {
        this.treeControl.expand(node);
        this.expandNodesWithNodes(descendants)
      }
    });
  }

  /**
    * Gets data tree
    * @returns
    */
  getDataArray() {
    return this.daoTree.data;
  }

  setDataArray(data: any): void {
    this.daoTree.flatNodeMap.clear();
    this.daoTree.setDataArray(data);
    if (this.recursive) {
      this.childreNodes = data.filter(
        (item: any) => item[this.parentColumn] != null
      );
      this.rootNodes = data.filter(
        (item: any) => !Util.isDefined(item[this.parentColumn]) || item[this.parentColumn] === null
      );
    }

    this.rootNodes = data;

    let level = 0;
    let rootNode: OTreeFlatNode;
    if (Util.isDefined(this.rootTitle)) {
      level = +1;
      rootNode = { id: 0, label: this.translateService.get(this.rootTitle), rootNode: true, level: 0, expandable: true, data: {}, isLoading: false };
      this.daoTree.flatNodeMap.set(rootNode, null);
      this.dataSource.data = [rootNode];
      this.treeControl.expand(rootNode);
    } else {
      this.dataSource.data = this.rootNodes.map(node => this.transformer(node, level));
    }

  }

  transformer = (node: any, level: number, parentNode?: any) => {

    const nodeChildren = this.childreNodes.filter((item) => item[this.parentColumn] === node[this.keys]);
    const flatNode: OTreeFlatNode =
    {
      'id': this.getNodeId(node, parentNode),
      'label': this.getItemText(node),
      'level': level,
      'node': this,
      childNode: this.treeNode,
      'expandable': Util.isDefined(this.treeNode) || !!nodeChildren?.length || this.recursive,
      'data': node,
      'isLoading': false,
      'route': this.route,
      'offset': this.parentComponent?.queryRows ?? 0
    };

    this.daoTree.flatNodeMap.set(flatNode, parentNode);

    //recursive
    nodeChildren.forEach(node => this.transformer(node, level + 1));
    return flatNode;


  }

  onSelectCheckboxChange(visible: boolean) {
    this.selectAllCheckboxVisible = visible;
  }

  protected sort(array: OTreeFlatNode[]): void {
    if (this.sortColumn != null) {
      array.sort((a, b) =>
        a.data[this.sortColumn].localeCompare(b.data[this.sortColumn])
      );
      array
        .filter((node) => !!this.treeControl.getDescendants(node))
        .forEach((node) => this.sort(this.treeControl.getDescendants(node)));
    }
  }

  protected getItemText(item: any): string {
    return this.visibleColumnsArray
      .filter((col) => item[col] != null && `${item[col]}`.length > 0)
      .map((col) => item[col])
      .join(this.separator);
  }

  getItemKey(item: any): string {
    return this.keysArray.map((col) => item[col]).join(';');
  }


  protected filterByQuickFilterColumns(
    item: any,
    quickfilter: string
  ): boolean {
    const caseSensitive = this.isFilterCaseSensitive();
    const regExpStr = new RegExp(
      Util.escapeSpecialCharacter(
        Util.normalizeString(quickfilter, !caseSensitive)
      )
    );
    return this.getQuickFilterColumns().some((col) =>
      regExpStr.test(Util.normalizeString(item.data[col] + '', !caseSensitive))
    );
  }

  public add(e?: Event): void {
    super.insertDetail();
  }

  protected getNodeId(item: any, parentNode: any) {
    /** revisarlo:igual con id incremental era mas facil e igual de eficiente */
    let id = '';
    this.keysArray.forEach(key => {
      id += item[key];
    });
    if (Util.isDefined(this.parentKeys) && Util.isDefined(parentNode)) {
      id += parentNode.id;
    }

    return this.keys + ':' + id;
  }

  protected navigateToViewDetail(node: OTreeFlatNode) {
    if (Util.isDefined(node.route)) {
      let route = undefined;

      let nodeRoute = node.route;
      let routeArray = nodeRoute.split(Codes.ROUTE_SEPARATOR);
      for (let i = 0, len = routeArray.length; i < len; i++) {
        if (routeArray[i].startsWith(Codes.ROUTE_VARIABLE_CHAR)) {
          routeArray[i] = node.data[routeArray[i].substring(1)];
        }
      }
      route = routeArray.join(Codes.ROUTE_SEPARATOR);

      if (Util.isDefined(route)) {
        const extras = {
          relativeTo: this.actRoute
        };
        this.router.navigate([route], extras);
      }
    }
  }

  isSelectedNode(node: OTreeFlatNode) {
    return this.selectedNode == node;
  }

  public onItemDetailClick(node: OTreeFlatNode): void {
    this.handleItemClick(node.data);
  }

  get selection() {
    if (!Util.isDefined(this._selection)) {
      this._selection = new SelectionModel<any>(true, [], true, (sm1, sm2) => sm1.id === sm2.id);
    }
    return this._selection;
  }

  getSelectedItems(): any[] {
    const selectedFlatNodes = this.selection.selected;
    const selectedKeys = this.getSelectedNodeKeys(selectedFlatNodes);

    const nodeMap = new Map<string, any>();
    const rootNodes: any[] = [];

    for (const flatNode of selectedFlatNodes) {
      const key = this.getFlatNodeIdentifier(flatNode);
      const treeNode = this.createTreeNode(flatNode);
      nodeMap.set(key, treeNode);

      const parent = this.daoTree.flatNodeMap.get(flatNode);
      if (!parent) {
        rootNodes.push(treeNode);
        continue;
      }

      const parentKey = this.getFlatNodeIdentifier(parent);
      if (!selectedKeys.has(parentKey)) {
        rootNodes.push(treeNode);
        continue;
      }

      const parentNode = this.ensureNodeInMap(parent, nodeMap);
      this.addChildToParent(parentNode, treeNode);

      if (this.shouldBeRoot(parent, selectedKeys) && !rootNodes.includes(parentNode)) {
        rootNodes.push(parentNode);
      }
    }

    return rootNodes;
  }

  public parseSortColumn(): void {
    this.sortColumnArray = ServiceUtils.parseSortColumns(this.sortColumn) || [];
  }

  public getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): OQueryParams {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    if (this.pageable) {
      if (Util.isDefined(this.sortColumnArray)) {
        queryArguments[6] = this.sortColumnArray;
      }
    }
    return queryArguments;
  }

  private shouldBeRoot(parent: OTreeFlatNode, selectedKeys: Set<string>): boolean {
    const grandParent = this.daoTree.flatNodeMap.get(parent);
    if (!grandParent) return true;

    const grandParentKey = this.getFlatNodeIdentifier(grandParent);
    return !selectedKeys.has(grandParentKey);
  }

  protected createTreeNode(flatNode: OTreeFlatNode): any {
    return flatNode.node
      ? { ...flatNode.data }
      : { label: flatNode.label };
  }


  protected getFlatNodeIdentifier(flatNode: OTreeFlatNode): string {
    if (flatNode.node?.getItemKey) {
      return flatNode.node.getItemKey(flatNode.data);
    } else if (flatNode.id != null) {
      return flatNode.id.toString();
    }
    return flatNode.label;

  }
  private addChildToParent(parentNode: any, childNode: any): void {
    if (!parentNode.children) {
      parentNode.children = [];
    }
    parentNode.children.push(childNode);
  }

  addParentToRootIfNoGrandparentSelected(
    parent: OTreeFlatNode,
    parentKey: string,
    selectedKeys: Set<string>,
    nodeMap: Map<string, any>,
    rootNodes: any[]
  ): void {
    const grandParent = this.daoTree.flatNodeMap.get(parent);
    const grandParentKey = grandParent ? this.getFlatNodeIdentifier(grandParent) : null;

    if (!grandParent || !selectedKeys.has(grandParentKey)) {
      const parentNode = nodeMap.get(parentKey);
      if (!rootNodes.includes(parentNode)) {
        rootNodes.push(parentNode);
      }
    }
  }
  private ensureNodeInMap(flatNode: OTreeFlatNode, map: Map<string, any>): any {
    const key = this.getFlatNodeIdentifier(flatNode);
    if (!map.has(key)) {
      map.set(key, this.createTreeNode(flatNode));
    }
    return map.get(key);
  }

  private getSelectedNodeKeys(nodes: OTreeFlatNode[]): Set<string> {
    return new Set(nodes.map(node => this.getFlatNodeIdentifier(node)));
  }

  getSelectedFlatNodes(): OTreeFlatNode[] {
    return this.selection.selected;
  }

  getParentNode(node: any): OTreeFlatNode {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) === currentLevel - 1) {
        return currentNode;
      }
    }
    return null;
  }

  reloadData(clearSelectedItems: boolean = true) {

    if (clearSelectedItems) {
      this.clearSelection();
    }

    let queryArgs: OQueryDataArgs;
    if (this.pageable) {
      queryArgs = {
        offset: this.currentPage * this.queryRows,
        length: this.queryRows
      };
    }
    this.queryData(void 0, queryArgs);
  }

  getLogicalLevel(node: OTreeFlatNode): number {
    const hasFakeRoot = this.hasFakeRoot(); // Lo defines según tu estructura
    return hasFakeRoot ? node.level - 1 : node.level;
  }

  hasFakeRoot(): boolean {
    return !!this.rootTitle;
  }

  public childQueryData(flatNode: OTreeFlatNode): Observable<ServiceResponse> | Observable<any> {
    return this.daoTree.queryNodeChildren(flatNode, this.recursive);
  }

}
