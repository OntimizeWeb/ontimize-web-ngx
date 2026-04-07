import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { OTranslatePipe } from '../../../../pipes/o-translate.pipe';

@Component({
  standalone: true,
  imports: [FormsModule, MatCheckboxModule, MatMenuModule, OTranslatePipe],
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


