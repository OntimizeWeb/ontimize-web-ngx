import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatListOption, MatSelectionList } from '@angular/material';

// import { ITableFiltersStatus } from '../../o-table-storage.class';

@Component({
  moduleId: module.id,
  selector: 'o-table-store-configuration-dialog',
  templateUrl: './o-table-store-configuration-dialog.component.html',
  styleUrls: ['./o-table-store-configuration-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableStoreConfigurationDialogComponent implements AfterViewInit {

  @ViewChild('propertiesList')
  propertiesList: MatSelectionList;

  properties: Array<any> = [{
    property: 'sort',
    name: 'TABLE.DIALOG.PROPERTIES.SORT',
  }, {
    property: 'columns-display',
    name: 'TABLE.DIALOG.PROPERTIES.COLUMNS_DISPLAY'
  }, {
    property: 'quick-filter',
    name: 'TABLE.DIALOG.PROPERTIES.QUICK_FILTER'
  }, {
    property: 'columns-filter',
    name: 'TABLE.DIALOG.PROPERTIES.COLUMNS_FILTER'
  }, {
    property: 'page',
    name: 'TABLE.DIALOG.PROPERTIES.PAGE'
  }];

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<OTableStoreConfigurationDialogComponent>
  ) { }

  ngAfterViewInit(): void {
    this.propertiesList.selectAll();
  }

  areAllSelected(): boolean {
    return this.propertiesList && this.propertiesList.options && this.propertiesList.options.length === this.propertiesList.selectedOptions.selected.length;
  }

  onSelectAllClicked(selectAll: boolean) {
    selectAll ? this.propertiesList.selectAll() : this.propertiesList.deselectAll();
  }

  getConfigurationAttributes(): any {
    return this.formGroup.value;
  }

  getSelectedTableProperties(): any[] {
    let selected: MatListOption[] = this.propertiesList.selectedOptions.selected;
    return selected.length ? selected.map(item => item.value) : [];
  }
}
