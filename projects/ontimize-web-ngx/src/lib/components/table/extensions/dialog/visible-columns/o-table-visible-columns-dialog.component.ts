import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Type,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogService } from '../../../../../services/dialog.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import type { OColumn } from '../../../column/o-column.class';
import { OTableBase } from '../../../o-table-base.class';

export type ColumnVisibilityConfiguration = {
  attr: string;
  title: string;
  visible: boolean;
  deleteValueFilter?: boolean;
  deleteSortColummn?: boolean;
  deleteGrupingColumn?: boolean;
};

@Component({
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule, MatListModule, FlexLayoutModule, OTranslatePipe],
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
  protected dialogService: DialogService;
  protected cd: ChangeDetectorRef;
  protected translateService: OTranslateService;
  protected activeColumnValueFilters: string[] = [];
  protected activeSortColumns: string[] = [];
  protected activeGroupByColumns: string[] = [];
  protected table: OTableBase;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.dialogService = this.injector.get<DialogService>(DialogService as Type<DialogService>);
    this.cd = this.injector.get<ChangeDetectorRef>(ChangeDetectorRef as Type<ChangeDetectorRef>);
    this.translateService = this.injector.get<OTranslateService>(OTranslateService as Type<OTranslateService>);

    if (Util.isDefined(data.table)) {
      this.table = data.table;

      const visibleColumns = Util.parseArray(this.table.visibleColumns, true);
      const nonHidableColumns = Util.parseArray(this.table.nonHidableColumns, true);

      //if it has no definition and is not in visible columns, it is not shown
      this.table.oTableOptions.columns.filter(oCol => (visibleColumns.indexOf(oCol.attr) !== -1 || oCol.definition !== undefined) &&
        nonHidableColumns.indexOf(oCol.attr) === -1
      ).forEach((oCol: OColumn) => {
        this.columns.push({
          attr: oCol.attr,
          title: oCol.title,
          visible: oCol.visible
        });
      });

      this.rowHeight = this.table.rowHeight;
      this.activeColumnValueFilters = this.table.dataSource.getColumnValueFilters().map(colValueFilter => colValueFilter.attr);
      this.activeSortColumns = this.table.sortColArray.map(col => col.columnName);
      this.activeGroupByColumns = this.table.groupedColumnsArray;
    }
  }

  onClickColumn(col: ColumnVisibilityConfiguration): void {
    const activeColFilter = this.activeColumnValueFilters.includes(col.attr);
    const activeSorting = this.activeSortColumns.includes(col.attr);
    const activeGrouping = this.activeGroupByColumns.includes(col.attr);

    if (col.visible && (activeColFilter || activeSorting || activeGrouping)) {
      const warnArgs = [];
      if (activeColFilter) {
        warnArgs.push(this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.VALUE_FILTER_WARN'));
      }
      if (activeSorting) {
        warnArgs.push(this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.SORT_WARN'));
      }
      if (activeGrouping) {
        warnArgs.push(this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.GROUPING_WARN'));
      }
      const dialogText = this.translateService.get('TABLE.VISIBLE_COLUMNS_DIALOG.HIDE_COLUMN_WARNING', warnArgs);
      this.dialogService.confirm('CONFIRM', dialogText).then(res => {
        if (res) {
          col.deleteValueFilter = activeColFilter;
          col.deleteSortColummn = activeSorting;
          col.deleteGrupingColumn = activeGrouping;
          col.visible = !col.visible;
          this.cd.detectChanges();
        }
      });
    } else {
      col.visible = !col.visible;
      if (col.visible) {
        col.deleteValueFilter = false;
        col.deleteSortColummn = false;
        col.deleteGrupingColumn = false;
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  closeDialog() {

    const columnSortingToRemove = this.getColumnSortingToRemove();
    const newSortColumns = columnSortingToRemove.length > 0 ?
      this.table.sortColArray.filter(col => !columnSortingToRemove.includes(col.columnName)) :
      undefined;

    const columnGroupingToRemove = this.getColumnGroupingToRemove();
    const newGroupColumns = columnGroupingToRemove.length > 0 ?
      this.table.groupedColumnsArray.filter(col => !columnGroupingToRemove.includes(col)) :
      undefined;

    const columnsOrder = this.getColumnsOrder();

    this.dialogRef.close({
      visibleColArray: this.getVisibleColumns().sort((a, b) => columnsOrder.indexOf(a) - columnsOrder.indexOf(b)),
      columnsOrder: columnsOrder,
      sortColumns: newSortColumns,
      columnValueFiltersToRemove: this.getColumnValueFiltersToRemove(),
      groupColumns: newGroupColumns
    });
  }

  /**
   * Returns the visible columns, including non-hidable ones,
   * preserving the order defined in oTableOptions.columns.
   */
  private getVisibleColumns(): string[] {
    const nonHidableColumns = Util.parseArray(this.table.nonHidableColumns, true);

    // Visible columns selected in the dialog
    const visibleFromDialog = this.columns
      .filter(col => col.visible)
      .map(col => col.attr);

    // Merge: visible columns from the dialog + non-hidable (always visible)
    const allVisibleAttrs = new Set([...visibleFromDialog, ...nonHidableColumns]);

    // Sort according to the updated order in oTableOptions.columns
    return this.table.oTableOptions.columns
      .filter(oCol => allVisibleAttrs.has(oCol.attr))
      .map(oCol => oCol.attr);
  }

  /**
   * Returns the final columns order, preserving the order defined in the dialog
   * and keeping non-hidable and hidden columns in their original positions.
   */
  private getColumnsOrder(): string[] {
    const originalOrder = this.table.oTableOptions.columns.map(col => col.attr);

    // Columns from the dialog in their new order
    const dialogColumnsOrder = this.columns.map(col => col.attr);

    // Columns not present in the dialog (non-hidable + hidden ones)
    const columnsNotInDialog = originalOrder.filter(attr =>
      !dialogColumnsOrder.includes(attr)
    );

    // Build the new order
    const newOrder: string[] = [];

    for (const dialogAttr of dialogColumnsOrder) {
      // Before adding this dialog column,
      // add the columns (non-hidable or hidden) that were placed before it
      // in the original order
      const dialogOriginalPos = originalOrder.indexOf(dialogAttr);

      for (const notInDialogAttr of columnsNotInDialog) {
        const notInDialogOriginalPos = originalOrder.indexOf(notInDialogAttr);

        // If it was before and has not been added yet
        if (
          notInDialogOriginalPos < dialogOriginalPos &&
          !newOrder.includes(notInDialogAttr)
        ) {
          newOrder.push(notInDialogAttr);
        }
      }

      // Add the dialog column
      newOrder.push(dialogAttr);
    }

    // Add remaining columns that were placed after all dialog columns
    for (const notInDialogAttr of columnsNotInDialog) {
      if (!newOrder.includes(notInDialogAttr)) {
        newOrder.push(notInDialogAttr);
      }
    }

    return newOrder;
  }

  private getColumnValueFiltersToRemove(): string[] {
    return this.columns.filter(col => col.deleteValueFilter).map(col => col.attr);
  }

  private getColumnSortingToRemove(): string[] {
    return this.columns.filter(col => col.deleteSortColummn).map(col => col.attr);
  }

  private getColumnGroupingToRemove(): string[] {
    return this.columns.filter(col => col.deleteGrupingColumn).map(col => col.attr);
  }
}