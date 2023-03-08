import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import {
  OBaseTableCellEditor
} from '../o-base-table-cell-editor.class';

@Component({
  selector: 'o-table-cell-editor-email',
  templateUrl: './o-table-cell-editor-email.component.html',
  styleUrls: ['./o-table-cell-editor-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class OTableCellEditorEmailComponent extends OBaseTableCellEditor {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
