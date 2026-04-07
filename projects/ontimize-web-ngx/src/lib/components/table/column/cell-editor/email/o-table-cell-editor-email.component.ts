import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { OMatErrorDirective } from '../../../../../directives/o-mat-error.directive';
import {
  OBaseTableCellEditor
} from '../o-base-table-cell-editor.class';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule, OTranslatePipe, OMatErrorDirective],
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
