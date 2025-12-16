import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

@Component({
  selector: 'o-table-cell-renderer-chip',
  templateUrl: './o-table-cell-renderer-chip.component.html',
  styleUrls: ['./o-table-cell-renderer-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OTableCellRendererChipComponent extends OBaseTableCellRenderer implements OnInit {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'chip';
  }

  initialize() {
    super.initialize();
  }

  getCellData(value: any) {
    return value;
  }


}
