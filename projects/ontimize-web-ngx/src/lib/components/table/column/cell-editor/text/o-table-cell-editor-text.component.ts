import { ChangeDetectionStrategy, Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';

import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';

const INPUTS_ARRAY = [
  ...OBaseTableCellEditor.INPUTS_ARRAY
];

const OUTPUTS_ARRAY = [
  ...OBaseTableCellEditor.OUTPUTS_ARRAY
];

@Component({
  selector: 'o-table-cell-editor-text',
  templateUrl: './o-table-cell-editor-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY,
  outputs: OUTPUTS_ARRAY
})

export class OTableCellEditorTextComponent extends OBaseTableCellEditor {

  public static INPUTS_ARRAY = INPUTS_ARRAY;
  public static OUTPUTS_ARRAY = OUTPUTS_ARRAY;

  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;
  @ViewChild('input', { static: false }) inputRef: ElementRef;

  constructor(protected injector: Injector) {
    super(injector);
  }


}
