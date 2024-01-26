
import { ChangeDetectionStrategy, Component, EventEmitter, Injector, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'o-tree-menu',
  templateUrl: './o-tree-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'selectAllCheckbox: select-all-checkbox',
    'selectAllCheckboxVisible: select-all-checkbox-visible',
  ],
  outputs: [
    'onSelectCheckboxChange'
  ]
})
export class OTreeMenuComponent {
  @ViewChild('menu', { static: true })
  matMenu: MatMenu;

  selectAllCheckbox = false;
  selectAllCheckboxVisible = false;

  public onSelectCheckboxChange: EventEmitter<boolean> = new EventEmitter();

  toggleShowCheckbox(event: MatCheckboxChange) {
    this.onSelectCheckboxChange.emit(event.checked);
  }

}


