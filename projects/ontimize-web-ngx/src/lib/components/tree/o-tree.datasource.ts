import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injector } from '@angular/core';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';

import { OTranslateService } from '../../services/translate';
import { OTreeDao } from './o-tree-dao.service';
import { OTreeComponent, OTreeFlatNode } from './o-tree.component';

export class OTreeDataSource implements DataSource<OTreeFlatNode> {
  dataChange = new BehaviorSubject<OTreeFlatNode[]>([]);
  translateService: any;
  protected _database: OTreeDao;

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
    private injector: Injector
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this._database = this.oTree.daoTree;
  }

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
      change.added.forEach(node => this.oTree.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.oTree.toggleNode(node, false));
    }
  }

  isTreeFlatNode(value: any) {
    let isType = false;
    return isType = 'level' in value && 'label' in value;
  }

  updateTree(parentNode: OTreeFlatNode, children: Array<any>, expand: boolean) {
    const treeNode = parentNode.treeNode ? parentNode.treeNode : this.oTree;
    const index = this.data.findIndex(node => node.id === parentNode.id);

    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    if (expand) {
      let level = parentNode.level + 1;
      let nodes: Array<OTreeFlatNode>;
      nodes = children.map(child => {
        if (this.isTreeFlatNode(child)) {
          return child;
        } else {
          return treeNode.transformer(child, level, parentNode);
        }
      });
      // }
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
    this.data = this.data;
    this.dataChange.next(this.data);
    parentNode.isLoading = false;

  }


}
