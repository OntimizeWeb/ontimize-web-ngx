import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OTreeComponent, OTreeNode } from './o-tree.component';

export class OTreeDataSource extends DataSource<any> {
  protected dataChange = new BehaviorSubject<any[]>([]);

  set data(arg: OTreeNode[]) {
    this.dataChange.next(arg);
  }

  constructor(public tree: OTreeComponent) {
    super();
  }

  connect(): Observable<OTreeNode[]> {
    const displayDataChanges: any[] = [this.dataChange];

    return merge(...displayDataChanges).pipe(
      map((x: any) => {
        let data = Object.assign([], this.tree.nodesArray);
        return data;
      })
    );
  }

  disconnect(): void { }
}
