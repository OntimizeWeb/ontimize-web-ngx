import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';

import { OTablePivotFunction } from '../../types/table/o-table-pivot-function.type';
import { DefaultOTablePivotPreferences, OTablePivotPreferences } from '../../types/table/o-table-pivot-preferences.type';
import { Observable, Util } from '../../util';
import { OColumn } from '../table/column/o-column.class';
import { OTableComponent } from '../table/o-table.component';
import { OTableInitializationOptions } from '../../types/table/o-table-initialization-options.type';
import { OTablePivotSelectFunctionDialogComponent } from './select-function-dialog/select-function-dialog.component';

@Component({
  selector: 'o-table-pivot',
  templateUrl: './table-pivot.component.html',
  styleUrls: ['./table-pivot.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class OTablePivotComponent {
  @ViewChild('pivotTable') pivotTable: OTableComponent;
  @ViewChild('pivotFieldsList') pivotFieldsList: MatSelectionList;

  showPivotTable$: Observable<boolean>;
  protected showPivotTableSubject = new BehaviorSubject<boolean>(false);

  public sourceTable: OTableComponent;
  public fullscreen: boolean = false;
  public columns: any;
  public functions: any;
  public columnsToGroupData: any;
  public columnsOrderBy: any[];
  public entity: string;
  public service: string;
  public openedSidenav: boolean = true;
  public pivotTablePreference: OTablePivotPreferences;
  public appliedConfiguration: boolean = false;
  public dialog: MatDialog;
  public options: OTableInitializationOptions;
  processed_headers: string;
  processed_data: any[];

  constructor(
    public injector: Injector,
    @Inject(MAT_DIALOG_DATA) data: OTableComponent,
    public dialogRef: MatDialogRef<OTablePivotComponent>) {
    this.dialog = this.injector.get<MatDialog>(MatDialog);
    this.sourceTable = data;
    this.initialize();
  }



  protected initialize() {
    this.showPivotTable$ = this.showPivotTableSubject.asObservable();
    this.functions = [];
    this.columnsToGroupData = [];
    this.columnsOrderBy = [];
    this.columns = this.sourceTable.getOperableColumns();
    this.entity = this.sourceTable.entity;
    this.service = this.sourceTable.service;
    this.options = {};
    this.processed_data = [];
    this.initializePivotTablePreferences();

  }
  get processedData() {
    return this.processed_data;
  }
  get processedHeader() {
    return this.processed_headers;
  }

  setFullscreenDialog() {
    Util.setFullscreenDialog(this.fullscreen, this.dialogRef, '90%', '90%');
    this.fullscreen = !this.fullscreen;
  }

  previewPivotTable() {
    //this.getProcessHeader();
    this.showPivotTableSubject.next(false);
    this.getProcessedData(this.sourceTable.getDataArray(), this.pivotTablePreference);
    this.showPivotTableSubject.next(true);
  }

  public clearPivotTablePreferences() {
    this.initialize();

    if (this.pivotFieldsList) {
      this.pivotFieldsList.deselectAll();
    }
  }

  initializePivotTablePreferences() {
    this.pivotTablePreference = new DefaultOTablePivotPreferences();


  }

  selectFunction(event: Event, nameFunction: OTablePivotFunction) {
    event.stopPropagation();

    this.dialog
      .open(OTablePivotSelectFunctionDialogComponent, {
        data: nameFunction,
        panelClass: ['o-dialog-class', 'o-table-dialog']
      })
      .afterClosed()
      .subscribe((data: any) => {
        //Updated current functions selected and functionsData
        if (data) {
          this.updatedFunctionData(data);
        }
      });

  }

  isCheckedFunction(nameFunction) {

  }
  private updatedFunctionData(data: OTablePivotFunction) {
    const index = this.pivotTablePreference.functions.findIndex(x => x.column.attr === data.column.attr);
    if (index > -1) {
      this.pivotTablePreference.functions[index] = data;
    }
  }

  dropFields(event: CdkDragDrop<string[]>) {
    // if (event.previousContainer.id !== 'pivotFieldsList') {
    //   event.container.data.splice(event.previousIndex, 0), currentArray.splice(from, 1)[0])
    // }
    //moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    //this.updateColumnsSort();
  }

  // dropColumns(event: CdkDragDrop<string[]>) {
  //   console.log('drop columns ', event);
  //   moveItemInArray(this.pivotTablePreference.columns, event.previousIndex, event.currentIndex);
  //   //this.updateColumnsSort();
  // }

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer.id === 'pivotFieldsList')
      //event.previousContainer.data[event.previousIndex]
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
  }
  dropFunctions(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.pivotTablePreference.functions, event.previousIndex, event.currentIndex);
    } else {
      const field = event.previousContainer.data[event.previousIndex];
      const agregateFunction = this.createFunction(field);
      this.pivotTablePreference.functions.push(agregateFunction);

    }
    //this.updateColumnsSort();
  }



  updateColumnsSort() {
    this.pivotTablePreference.columns.sort((a: any, b: any) => {
      let indexA = this.columns.findIndex(x => x.id === a.id);
      let indexB = this.columns.findIndex(x => x.id === b.id);
      return indexA - indexB;
    });
  }

  updateColumnToGroupSort() {
    this.pivotTablePreference.groups.sort((a: string, b: string) => {
      let indexA = this.columnsToGroupData.findIndex(x => x === a);
      let indexB = this.columnsToGroupData.findIndex(x => x === b);
      return indexA - indexB;
    });
  }

  updateColumnGroupBySort() {
    this.pivotTablePreference.orderBy.sort((a: any, b: any) => {
      let indexA = this.columnsOrderBy.findIndex(x => x.columnId === a.columnId);
      let indexB = this.columnsOrderBy.findIndex(x => x.columnId === b.columnId);
      return indexA - indexB;
    });
  }



  functionsCompareFunction(f1: any, f2: any) {
    return f1.columnName === f2.columnName;
  }

  onSelectionChangeGroups(event: MatSelectionListChange) {
    if (!event.options[0].selected) return;

  }

  changeOrder(column: any, event) {
    const columnSelectedToOrder = this.columnsOrderBy.find(x => x.columnId === column.columnId);
    if (columnSelectedToOrder) {
      columnSelectedToOrder.ascendent = !columnSelectedToOrder.ascendent;
    }
    event.stopPropagation();
  }

  columnsOrderByCompareFunction(co1: any, co2: any) {

  }

  columnsCompareFunction(co1: any, co2: any) {

  }

  openSavePreferences(): void {

  }
  openSaveAsPreferences(): void {

  }
  onApplyConfigurationClicked(): void {

  }

  onSelectionChangeColumns(event: MatSelectionListChange) {
    const selectedColumn: OColumn = event.options[0].value;
    switch (selectedColumn.type) {
      case 'integer':
      case 'real':
      case 'currency':
      case 'percentage':
      case 'date':
        const indexColumn = this.pivotTablePreference.columns.filter((row: OColumn) => row.attr === selectedColumn.attr).length;
        indexColumn > 0 ? this.pivotTablePreference.columns.splice(indexColumn, 1) : this.pivotTablePreference.columns.push(selectedColumn);
        if (selectedColumn.type !== 'date') {
          const indexFunction = this.pivotTablePreference.functions.filter((pivotFunction: OTablePivotFunction) => pivotFunction.column.attr === selectedColumn.attr).length;
          indexFunction > 0 ? this.pivotTablePreference.functions.splice(indexFunction, 1) : this.pivotTablePreference.functions.push(this.createFunction(selectedColumn));
        }
        this.options.columns = this.pivotTablePreference.columns.join(';');
        break;
      default:
        const indexRow = this.pivotTablePreference.rows.filter((row: OColumn) => row.attr === selectedColumn.attr).length;
        indexRow > 0 ? this.pivotTablePreference.rows.splice(indexRow, 1) : this.pivotTablePreference.rows.push(selectedColumn);
        break;
    }

    // this.pivotTable.reinitialize(this.options);

  }

  createFunction(column: OColumn): OTablePivotFunction {
    return { column: column, type: (column.type === 'date' ? 'TOTAL' : 'SUM') }
  }

  getProcessedData(source, configs: OTablePivotPreferences) {
    this.processed_data = [];
    const rowsId: string[] = configs.rows.map((x: OColumn) => x.attr);
    const columnsId = configs.columns.map((x: OColumn) => x.attr);
    const rows = this.findUnique(this.pluck(source, rowsId));
    const columns = this.findUnique(this.pluck(source, columnsId));
    // const columns = [];
    const aggregateFunctions = configs.functions;
    const functionsHeader = configs.functions.map((x: OTablePivotFunction) => x.column.title);


    this.processed_headers = [...rowsId, ...columns, ...functionsHeader].join(';')

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let processed_row = {};
      processed_row['id'] = i;
      processed_row[rowsId[0]] = row;
      let row_count = 0;
      for (let j = 0; j < columns.length; j++) {
        const column = columns[j];
        let count = 0;

        for (let k = 0; k < source.length; k++) {
          const data = source[k];

          if (data[configs.rows[0].attr] == row && data[configs.columns[0].attr] == column) {
            count++;
          }
        }
        processed_row[column] = count;
        row_count += count;
      }

      configs.functions.forEach((aggregateFunction: OTablePivotFunction) => {
        let totalAggregate = 0;
        source.forEach(data => {
          //agrupa los valores iguales
          if (data[configs.rows[0].attr] == row) {
            totalAggregate += data[aggregateFunction.column.attr]
          }

        });
        processed_row[aggregateFunction.column.attr] = totalAggregate;
      });
      //processed_row.push(row_count);
      this.processed_data.push(processed_row);
    }
    console.log('processedData ', this.processedHeader, this.processedData);

  }

  getProcessHeader() {

  }


  findUnique(a) {
    return a.filter(function (item, pos) {
      return a.indexOf(item) == pos;
    });
  }

  pluck(array, key) {
    return array.filter(obj => Util.isDefined(obj[key])).map(obj => obj[key]);
  }
  editColumn(event: Event, column: OColumn) {

  }
}

