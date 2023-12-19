
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { OTreeComponent } from '../../o-tree.component';

@Component({
  selector: 'o-tree-menu',
  templateUrl: './o-tree-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'selectAllCheckbox: select-all-checkbox',

  ]
})
export class OTreeMenuComponent {
  @ViewChild('menu', { static: true })
  matMenu: MatMenu;
  selectAllCheckbox = false;
  tree: OTreeComponent;

  constructor(protected injector: Injector) {
    this.tree = this.injector.get(OTreeComponent);
  }

  get isSelectAllOptionActive(): boolean {
    return this.tree.selectAllCheckboxVisible;
  }

  set isSelectAllOptionActive(value) {
    this.tree.selectAllCheckboxVisible = value
  }

}


