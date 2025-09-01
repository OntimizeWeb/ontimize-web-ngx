import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injector } from '@angular/core';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';

import { OTranslateService } from '../../services/translate';
import { OTreeDao } from './o-tree-dao.service';
import { OTreeComponent } from './o-tree.component';
import { OTreeFlatNode } from '../../types/tree-flat-node.type';
import { MatPaginator } from '@angular/material/paginator';

export class OTreeDataSource implements DataSource<OTreeFlatNode> {
  dataChange = new BehaviorSubject<OTreeFlatNode[]>([]);
  translateService: any;
  protected _database: OTreeDao;
  resultsLength: number = 0;
  protected _paginator: MatPaginator;

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
    if (this._database) {
      this.resultsLength = this._database.data.length;
    }
    if (oTree.matpaginator) {
      this._paginator = oTree.matpaginator;
    }
  }

  connect(collectionViewer: CollectionViewer): Observable<OTreeFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        change.added ||
        change.removed
      ) {
        this.handleTreeControl(change);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => {
      let data = Object.assign([], this.data);

      if (this.oTree.pageable) {
        const totalRecordsNumber = this.oTree.getTotalRecordsNumber();
        this.resultsLength = totalRecordsNumber ?? data.length;
      }

      return this.data;
    }));
  }


  disconnect(collectionViewer: CollectionViewer): void {
    this.dataChange.complete();
  }

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
    return 'level' in value && 'label' in value;
  }

  updateTree(parentNode: OTreeFlatNode, children: Array<any>, expand: boolean): void {
    const index = this.data.findIndex(node => node.id === parentNode.id);

    if (!children || index < 0) {
      parentNode.isLoading = false;
      return;
    }

    const level = parentNode.level + 1;
    const treeNode = parentNode.childNode ? parentNode.childNode : this.oTree;

    // Transformar hijos nuevos
    const newNodes: OTreeFlatNode[] = children.map(child =>
      this.isTreeFlatNode(child) ? child : treeNode.transformer(child, level, parentNode)
    );

    if (expand) {
      // Insertar después de los hijos existentes
      let insertIndex = index + 1;
      while (
        insertIndex < this.data.length &&
        this.data[insertIndex].level > parentNode.level
      ) {
        insertIndex++;
      }

      this.data.splice(insertIndex, 0, ...newNodes);

      // Expandir si aún no lo está
      if (!this._treeControl.isExpanded(parentNode)) {
        this._treeControl.expand(parentNode);
      }

      // Seleccionar hijos si el padre está seleccionado
      if (this.oTree.selection.isSelected(parentNode)) {
        this.oTree.selection.select(...newNodes);
      }
    } else {
      let count = 0;
      for (
        let i = index + 1;
        i < this.data.length && this.data[i].level > parentNode.level;
        i++, count++
      );
      this.data.splice(index + 1, count);
    }

    // Refrescar nodos del tree control
    this._treeControl.dataNodes = this.data;

    // Notificar cambio
    this.dataChange.next(this.data);
    parentNode.isLoading = false;

  }


}
