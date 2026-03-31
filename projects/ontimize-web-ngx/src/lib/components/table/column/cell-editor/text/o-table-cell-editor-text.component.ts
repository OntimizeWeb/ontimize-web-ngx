import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import {
  OBaseTableCellEditor
} from '../o-base-table-cell-editor.class';

@Component({
  selector: 'o-table-cell-editor-text',
  templateUrl: './o-table-cell-editor-text.component.html',
  styleUrls: ['./o-table-cell-editor-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class OTableCellEditorTextComponent extends OBaseTableCellEditor {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
