import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DialogService } from '../../../../../services/dialog.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../column/o-column.class';

export type ColumnVisibilityConfiguration = {
  attr: string;
  title: string;
  visible: boolean;
  showInList: boolean;
  deleteValueFilter?: boolean;
  deleteSortColummn?: boolean;
};

@Component({
  selector: 'o-table-visible-columns-dialog',
  templateUrl: 'o-table-visible-columns-dialog.component.html',
  styleUrls: ['o-table-visible-columns-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-visible-columns-dialog]': 'true'
  }
})
export class OTableVisibleColumnsDialogComponent {

  columns: ColumnVisibilityConfiguration[] = [];
  rowHeight: string = Codes.DEFAULT_ROW_HEIGHT;
  protected activeColumnValueFilters: string[] = [];
  protected activeSortColumns: string[] = [];
  protected dialogService: DialogService;
  protected cd: ChangeDetectorRef;
  protected translateService: OTranslateService;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.cd = this.injector.get(ChangeDetectorRef);
    this.translateService = this.injector.get<OTranslateService>(OTranslateService);

    if (Util.isArray(data.columnsData) && Util.isArray(data.visibleColumns)) {
      data.columnsData.forEach((oCol: OColumn) => {
        this.columns.push({
          attr: oCol.attr,
          title: oCol.title,
          visible: oCol.visible,
          showInList: data.visibleColumns.indexOf(oCol.attr) !== -1 || oCol.definition !== undefined
        });
      });
    }
    if (Util.isDefined(data.rowHeight)) {
      this.rowHeight = data.rowHeight;
    }
    if (Util.isDefined(data.activeColumnValueFilters)) {
      this.activeColumnValueFilters = data.activeColumnValueFilters;
    }
    if (Util.isDefined(data.activeSortColumns)) {
      this.activeSortColumns = data.activeSortColumns;
    }
  }

  getVisibleColumns(): string[] {
    return this.columns.filter(col => col.visible).map(col => col.attr);
  }

  getColumnsOrder(): string[] {
    return this.columns.map(col => col.attr);
  }

  getColumnValueFiltersToRemove(): string[] {
    return this.columns.filter(col => col.deleteValueFilter).map(col => col.attr);
  }

  getColumnSortingToRemove(): string[] {
    return this.columns.filter(col => col.deleteSortColummn).map(col => col.attr);
  }

  onClickColumn(col: ColumnVisibilityConfiguration): void {
    const activeColFilter = this.activeColumnValueFilters.includes(col.attr);
    const activeSorting = this.activeSortColumns.includes(col.attr);
    if (col.visible && (activeColFilter || activeSorting)) {
      const warnArgs = [];
      if (activeColFilter) {
        warnArgs.push(this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.VALUE_FILTER_WARN'));
      }
      if (activeSorting) {
        warnArgs.push(this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.SORT_WARN'));
      }
      const dialogText = this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.HIDE_COLUMN_WARNING', warnArgs);
      this.dialogService.confirm('CONFIRM', dialogText).then(res => {
        if (res) {
          col.deleteValueFilter = activeColFilter;
          col.deleteSortColummn = activeSorting;
          col.visible = !col.visible;
          this.cd.detectChanges();
        }
      });
    } else {
      col.visible = !col.visible;
      if (col.visible) {
        col.deleteValueFilter = false;
        col.deleteSortColummn = false;
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
