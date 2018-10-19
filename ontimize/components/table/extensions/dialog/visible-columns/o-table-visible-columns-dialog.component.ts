import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DragDropService } from '@beyerleinf/ngx-dnd';

import { Util } from '../../../../../utils';
import { OColumn } from '../../../o-table.component';

@Component({
  moduleId: module.id,
  selector: 'o-table-visible-columns-dialog',
  templateUrl: 'o-table-visible-columns-dialog.component.html',
  styleUrls: ['o-table-visible-columns-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DragDropService],
  host: {
    '[class.o-table-visible-columns-dialog]': 'true'
  }
})
export class OTableVisibleColumnsDialogComponent {

  columns: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (Util.isArray(data.columnsData) && Util.isArray(data.originalVisibleColumns)) {
      let originalCols = data.originalVisibleColumns;
      data.columnsData.forEach((oCol: OColumn) => {
        this.columns.push({
          attr: oCol.attr,
          title: oCol.title,
          visible: oCol.visible,
          showInList: (oCol.definition !== undefined || oCol.visible || originalCols.indexOf(oCol.attr) !== -1)
        });
      });
    }
  }

  getVisibleColumns(): Array<string> {
    return this.columns.filter(col => col.visible).map(col => col.attr);
  }

  getColumnsOrder(): Array<string> {
    return this.columns.map(col => col.attr);
  }

  onClickColumn(col: OColumn): void {
    col.visible = !col.visible;
  }

}
