import { DataSource, CollectionViewer, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { BehaviorSubject, Observable, merge, map } from "rxjs";
import { OTreeComponent, OTreeFlatNode, OTreeNode } from "./o-tree.component";
import { OTreeDao } from "./o-tree-dao.service";
import { Util } from "../../util";
import { ServiceResponse } from "../../interfaces/service-response.interface";

export class OTreeDataSource implements DataSource<OTreeFlatNode> {
  dataChange = new BehaviorSubject<OTreeFlatNode[]>([]);

  get data(): OTreeFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: OTreeFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private oTree: OTreeComponent,
    private _treeControl: FlatTreeControl<OTreeFlatNode>,
    private _database: OTreeDao,

  ) { }

  connect(collectionViewer: CollectionViewer): Observable<OTreeFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<OTreeFlatNode>).added ||
        (change as SelectionChange<OTreeFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<OTreeFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => {
      return this.data;
    }));
  }

  disconnect(collectionViewer: CollectionViewer): void { }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<OTreeFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  updateTree(parentNode: OTreeFlatNode, children: Array<any>, expand: boolean) {
    const treeNode = parentNode.treeNode ? parentNode.treeNode : this.oTree;
    const index = this.data.findIndex(node => treeNode.getItemKey(node.data) === treeNode.getItemKey(parentNode.data))
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    parentNode.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(child => treeNode.transformer(child, parentNode.level + 1));
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > parentNode.level;
          i++, count++
        ) { }
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      parentNode.isLoading = false;
    }, 1000);
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: OTreeFlatNode, expand: boolean) {
    const children = node.treeNode ? node.treeNode.getChildren(node):this.oTree.getChildren(node);


    if (Util.isArray(children)) {
      this.updateTree(node, children, expand);
    } else {
      children.subscribe((res: ServiceResponse) => {
        let data;
        if (Util.isArray(res.data)) {
          data = res.data;
        } else if (res.isSuccessful()) {
          const arrData = (res.data !== undefined) ? res.data : [];
          data = Util.isArray(arrData) ? arrData : [];
        }
        this.updateTree(node, data, expand);
        //this.loadingSubject.next(false);
      }, err => {


        //  this.loadingSubject.next(false);
        // if (Util.isDefined(this.queryFallbackFunction)) {
        //   this.queryFallbackFunction(err);
        // } else {
        //   this.oErrorDialogManager.openErrorDialog(err);
        //   console.error(err);
        // }
      });
    }
  }
}
