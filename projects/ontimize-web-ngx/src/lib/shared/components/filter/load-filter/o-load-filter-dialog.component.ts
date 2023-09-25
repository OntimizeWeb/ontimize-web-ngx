import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injector,
  OnInit,
  Type,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';

import { DialogService } from '../../../../services/dialog.service';
import { OTableFiltersStatus } from '../../../../types/table/o-table-filter-status.type';

@Component({
  selector: 'o-load-filter-dialog',
  templateUrl: './o-load-filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OLoadFilterDialogComponent implements OnInit {

  @ViewChild(MatSelectionList, { static: true }) filterList: MatSelectionList;

  filters: OTableFiltersStatus[] = [];

  onDelete: EventEmitter<string> = new EventEmitter();

  protected dialogService: DialogService;
  protected cd: ChangeDetectorRef;

  constructor(
    public dialogRef: MatDialogRef<OLoadFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: OTableFiltersStatus[],
    protected injector: Injector
  ) {
    this.loadFilters(data);
    this.dialogService = this.injector.get<DialogService>(DialogService as Type<DialogService>);
    try {
      this.cd = this.injector.get<ChangeDetectorRef>(ChangeDetectorRef as Type<ChangeDetectorRef>);
    } catch (e) {
      // no parent form
    }
  }

  ngOnInit(): void {
    this.filterList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  loadFilters(filters: OTableFiltersStatus[]): void {
    this.filters = filters;
  }

  getSelectedFilterName(): string {
    const selected: MatListOption[] = this.filterList.selectedOptions.selected;
    return selected.length ? selected[0].value : void 0;
  }

  removeFilter(filterName: string): void {
    this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_FILTER').then(result => {
      if (result) {
        this.onDelete.emit(filterName);
        this.cd.detectChanges();
      }
    });
  }

}
