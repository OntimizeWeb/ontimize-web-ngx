import { ChangeDetectionStrategy, Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OGroupedColumnTypes } from '../../../../../types';
import { Util } from '../../../../../util/util';
import { ODualListSelectorComponent } from '../../../../dual-list-selector/o-dual-list-selector.component';
import { OColumn } from '../../../column/o-column.class';

@Component({
  selector: 'o-table-group-by-columns-dialog',
  templateUrl: 'o-table-group-by-columns-dialog.component.html',
  styleUrls: ['o-table-group-by-columns-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-group-by-column-dialog]': 'true'
  }
})
export class OTableGroupByColumnsDialogComponent {

  public columns: Array<OColumn> = [];
  public groupedColumns: Array<OColumn> = [];
  public groupedColumnTypes: OGroupedColumnTypes[] = [];

  @ViewChild('dualListSelector', { static: false }) dualListSelector: ODualListSelectorComponent;

  constructor(
    public dialogRef: MatDialogRef<OTableGroupByColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {

    if (Util.isArray(data.groupedColumns) && !Util.isArrayEmpty(data.groupedColumns)) {
      this.groupedColumns = data.groupedColumns.map((attr: string) => {
        const indexCol = data.columnsData.findIndex((col: OColumn) => col.attr === attr);
        if (indexCol > -1) {
          return data.columnsData[indexCol];
        }
      });
    }

    const self = this;
    if (Util.isArray(data.columnsData)) {
      this.columns = data.columnsData.filter((oCol: OColumn) => oCol.visible && oCol.groupable && self.groupedColumns.findIndex(x => x.attr === oCol.attr) === -1);

    }
    if (Util.isDefined(data.groupedColumnTypes)) {
      this.groupedColumnTypes = data.groupedColumnTypes;
    }
  }

  getGroupedColumns(): Array<string> {
    return this.dualListSelector.getSelectedItems().map((oCol: OColumn) => oCol.attr);
  }

  getGroupedColumnTypes(): OGroupedColumnTypes[] {
    return this.dualListSelector.getGroupedColumnTypes();
  }
}
