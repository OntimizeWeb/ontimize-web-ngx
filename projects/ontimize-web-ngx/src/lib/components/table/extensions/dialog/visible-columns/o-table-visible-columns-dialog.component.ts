import { Component, Inject, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, Codes } from '../../../../../utils';
import { OColumn } from '../../../o-table.component';
import { DragDropService } from '@churchs19/ng2-dnd';

@Component({
  moduleId: module.id,
  selector: 'o-table-visible-columns-dialog',
  templateUrl: 'o-table-visible-columns-dialog.component.html',
  styleUrls: ['o-table-visible-columns-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DragDropService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-visible-columns-dialog]': 'true'
  }
})
export class OTableVisibleColumnsDialogComponent {

  columns: Array<any> = [];
  protected cd: ChangeDetectorRef;
  rowHeight: string = Codes.DEFAULT_ROW_HEIGHT;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    try {
      this.cd = this.injector.get(ChangeDetectorRef);
    } catch (e) {
      // no parent form
    }
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
    if (Util.isDefined(data.rowHeight)) {
      this.rowHeight = data.rowHeight;
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

  onDragSuccess(arg: any) {
    this.cd.detectChanges();
  }
}
