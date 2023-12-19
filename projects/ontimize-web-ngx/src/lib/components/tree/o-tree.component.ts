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
  ViewEncapsulation
} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../decorators/input-converter';
import { OTreeComponentStateService } from '../../services/state/o-tree-component-state.service';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { AbstractOServiceComponent } from '../o-service-component.class';

export interface OTreeNode {
  label: string;
  data: any;
  children?: OTreeNode[];
  display?: string;
}

export interface OTreeFlatNode {
  label: string;
  level: number,
  expandable: boolean,
  data: any;
  display?: string;
}

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
  // checkbox-selection-mode [single|parents|children]: whether clicking on a checkbox will select only the checkbox you selected,
  // the checkbox you selected and its parent nodes or the checkbox you selected and its child nodes. Default: children.
  'checkboxSelectionMode: checkbox-selection-mode',
];

export const DEFAULT_OUTPUTS_O_TREE = ['onNodeSelected', 'onNodeExpanded', 'onNodeCollapsed', 'onLoadNextLevel', 'onDataLoaded'];

type nodeHashType = {
  id: string;
  node: OTreeNode;
};

@Component({
  selector: 'o-tree',
  templateUrl: './o-tree.component.html',
  styleUrls: ['./o-tree.component.scss'],
  inputs: DEFAULT_INPUTS_O_TREE,
  outputs: DEFAULT_OUTPUTS_O_TREE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-tree]': 'true',
  },
})
export class OTreeComponent extends AbstractOServiceComponent<OTreeComponentStateService> implements OnInit, OnDestroy, AfterViewInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<OTreeFlatNode, OTreeNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<OTreeNode, OTreeFlatNode>();


  getLevel = (node: OTreeFlatNode) => node.level;

  isExpandable = (node: OTreeFlatNode) => node.expandable;

  getChildren = (node: OTreeNode): OTreeNode[] => this.childreNodes.filter((item) => item[this.parentColumn] === node[this.keys]);

  hasChild = (_: number, _nodeData: OTreeFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: OTreeFlatNode) => _nodeData.label === '';
  treeControl = new FlatTreeControl<OTreeFlatNode>(this.getLevel, this.isExpandable);

  dataSource: MatTreeFlatDataSource<OTreeNode, OTreeFlatNode>;

  @BooleanInputConverter()
  refreshButton: boolean = true;
  @BooleanInputConverter()
  deleteButton: boolean = false;
  @BooleanInputConverter()
  showButtonsText: boolean = false;
  checkboxSelectionMode: string = 'children';

  visibleColumns: string;
  separator: string = Codes.HYPHEN_SEPARATOR;
  parentColumn: string;
  sortColumn: string;
  @BooleanInputConverter()
  selectAllCheckboxVisible: boolean = false;
  @BooleanInputConverter()
  selectAllCheckbox: boolean = false;

  protected _quickFilter: boolean = false;
  paginationControls = false;
  quickFilterColumns: string;

  childreNodes: OTreeNode[] = [];
  nodesArray: OTreeNode[] = [];
  ancestors: any[] = [];

  checklistSelection = new SelectionModel<OTreeFlatNode>(true);

  onNodeSelected: EventEmitter<any> = new EventEmitter();
  onNodeExpanded: EventEmitter<any> = new EventEmitter();
  onNodeCollapsed: EventEmitter<any> = new EventEmitter();
  onLoadNextLevel: EventEmitter<any> = new EventEmitter();

  @ContentChild('leafNodeTemplate', { read: TemplateRef, static: false })
  leafNodeTemplate: TemplateRef<any>;

  @ContentChild('parentNodeTemplate', { read: TemplateRef, static: false })
  parentNodeTemplate: TemplateRef<any>;
  treeFlattener: any;

  @ContentChild('nodeTemplate', { read: TemplateRef, static: false })
  set nodeTemplate(value: TemplateRef<any>) {
    if (value != null) {
      this.leafNodeTemplate = value;
      this.parentNodeTemplate = value;
    }
  }

  protected visibleColumnsArray: string[] = [];
  protected parentNodesHash: nodeHashType[];
  public enabledDeleteButton: boolean = false;
  protected subscription: Subscription = new Subscription();
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
  }

  ngOnInit() {
    this.initialize();
    if (!Util.isDefined(this.quickFilterColumns)) {
      this.quickFilterColumns = this.visibleColumns;
    }
    this.subscription.add(
      this.selection.changed.subscribe(
        () => (this.enabledDeleteButton = !this.selection.isEmpty())
      )
    );
  }

  ngAfterViewInit(): void {
    this.visibleColumnsArray = Util.parseArray(this.visibleColumns, true);
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
    this.setDatasource();
    this.afterViewInit();
    if (this.queryOnInit) {
      this.queryData();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
    this.subscription.unsubscribe();
  }

  checkboxClicked(event: Event): void {
    event.stopPropagation();
  }

  leafNodeClicked(node: OTreeNode, event: Event): void {
    this.nodeClicked(node, event);
  }

  parentNodeClicked(node: OTreeNode, event: Event): void {
    this.nodeClicked(node, event);
  }

  protected nodeClicked(node: OTreeNode, event: Event) {
    event.stopPropagation();
    if (this.detailMode !== Codes.DETAIL_MODE_NONE) {
      this.viewDetail(node.data);
    }
  }
  onClickToggleButton(node) {
    if (this.treeControl.isExpanded(node)) {
      this.onNodeExpanded.emit(node);
    } else {
      this.onNodeCollapsed.emit(node);
    }
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OTreeFlatNode): void {
    this.todoItemSelectionToggle(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OTreeFlatNode): void {

    this.checklistSelection.toggle(node);
    if (this.checkboxSelectionMode === 'children') {
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);

      // Force update for the parent
      descendants.every((child) => this.checklistSelection.isSelected(child));
      this.onNodeSelected.emit(node.data);
    } else if (this.checkboxSelectionMode === 'parents') {
      this.ancestors = [];
      this.fillAncestorArray(node.data);
      if (this.ancestors) {
        this.ancestors.forEach((ancestor) => {
          this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(ancestor)
            : this.checklistSelection.deselect(ancestor);
        });
      }
      this.onNodeSelected.emit(node.data);
    }
  }

  fillAncestorArray(nodeData) {
    let ancestor: OTreeNode;
    if (nodeData !== null) {
      if (nodeData['parent_id']) {
        ancestor = {
          label: this.dataSource.data.filter(
            (item) => item['category_id'] == nodeData['parent_id']
          )[0]['name'],
          data: this.dataSource.data.filter(
            (item) => item['category_id'] == nodeData['parent_id']
          )[0],
        };
        if (ancestor) {
          this.ancestors.unshift(ancestor);
          this.fillAncestorArray(ancestor);
        }
      }
    }
  }

  /** */

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: OTreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OTreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  protected checkAllParentsSelection(node: OTreeFlatNode): void {
    let parent: OTreeFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  protected checkRootNodeSelection(node: OTreeFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  // /* Get the parent node of a node */
  protected getParentNode(node: OTreeFlatNode): OTreeFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** */

  protected setDatasource() {
    // this.dataSource = new OTreeDataSource(this);
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  getParentNodes(node: OTreeNode, tree: OTreeNode[]): OTreeNode[] {
    let ascensors = this.dataResponseArray.filter((item) => node[this.parentColumn] === item[this.keys]);
    ascensors.forEach(item => {
      const existingNode = tree.findIndex(x => x[this.keys] === item[this.keys]) > -1;
      if (Util.isDefined(item[this.parentColumn]) && !existingNode) {
        return this.getParentNodes(item, tree);
      } else {
        return [item];
      }
    });
    return ascensors;
  }
  filterData(value?: string, loadMore?: boolean): void {

    let filteredTreeData = [];
    if (value) {
      this.nestedNodeMap.forEach(nestedNode => {
        if (nestedNode.label.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {
          filteredTreeData.push(this.flatNodeMap.get(nestedNode));
        }
      });

      console.log('filternodes ', filteredTreeData);
      filteredTreeData.forEach(node => {
        const parentNodes = this.getParentNodes(node, filteredTreeData);
        if (!Util.isArrayEmpty(parentNodes)) {
          filteredTreeData = filteredTreeData.concat(parentNodes);
        }
      });

    } else {
      filteredTreeData = this.dataResponseArray;
    }

    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    this.setDataArray(filteredTreeData);
    // const data = this.transformer(filteredTreeData, 0);
    // Notify the change.
    if (value) {
      this.treeControl.expandAll();
    }


    //this.dataArray.forEach(item=>)
  }


  setDataArray(data: any): void {
    super.setDataArray(data);
    this.childreNodes = this.dataArray.filter(
      (item) => item[this.parentColumn] != null
    );
    this.dataSource.data = data;
    console.log('datanodes ', this.treeControl.dataNodes);
  }

  transformer = (node: any, level: number) => {

    const existingNode = this.nestedNodeMap.get(node);
    if (existingNode) {
      return existingNode;
    }
    const nodeChildren = this.childreNodes.filter((item) => item[this.parentColumn] === node[this.keys]);
    const flatNode: OTreeFlatNode =
      existingNode && existingNode.label === node.label ? existingNode : { 'label': this.getItemText(node), 'level': level, 'expandable': !!nodeChildren?.length, 'data': node };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    console.log('flatNode ', flatNode);
    nodeChildren.forEach(node => this.transformer(node, level + 1));
    return flatNode;

    // let allNodesHash: nodeHashType[] = this.dataArray.map((item) => {
    //   return {
    //     id: this.getItemKey(item),
    //     node: this.createNode(item),
    //   };
    // });
    // const childNodesHash = allNodesHash.filter(
    //   (item) => item.node.data[this.parentColumn] != null
    // );

    // childNodesHash.forEach((item) => {
    //   const parentNode = allNodesHash.find(
    //     (nodeItem) => nodeItem.id == item.node.data[this.parentColumn]
    //   );
    //   if (parentNode != null) {
    //     parentNode.node.children = [
    //       ...(parentNode.node.children || []),
    //       item.node,
    //     ];
    //   }
    // });

    // this.parentNodesHash = allNodesHash.filter(
    //   (item) => item.node.data[this.parentColumn] == null
    // );

    // const parentNodesArray = this.parentNodesHash.map((item) => item.node);

    // this.sort(parentNodesArray);
    // this.nodesArray = parentNodesArray;
  }

  protected sort(array: OTreeNode[]): void {
    if (this.sortColumn != null) {
      array.sort((a, b) =>
        a.data[this.sortColumn].localeCompare(b.data[this.sortColumn])
      );
      array
        .filter((node) => !!node.children)
        .forEach((node) => this.sort(node.children));
    }
  }



  protected getItemText(item: any): string {
    return this.visibleColumnsArray
      .filter((col) => item[col] != null && `${item[col]}`.length > 0)
      .map((col) => item[col])
      .join(this.separator);
  }

  protected getItemKey(item: any): string {
    return this.keysArray.map((col) => item[col]).join(';');
  }

  protected updateNodesDisplay(
    quickfilter: string,
    fixedValue?: boolean
  ): void {
    const filterData = this.treeControl.dataNodes.filter(node =>
      this.filterByQuickFilterColumns(node, quickfilter));
    console.log(filterData);
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

  public remove(clearSelectedItems: boolean = false): void { }

}
