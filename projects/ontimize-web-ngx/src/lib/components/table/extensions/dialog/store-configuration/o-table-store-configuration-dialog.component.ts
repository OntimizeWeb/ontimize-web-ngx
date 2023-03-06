import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange, MatDialogRef, MatListOption, MatSelectionList } from '@angular/material';

import { OTableBaseDialogClass } from '../o-table-base-dialog.class';

@Component({
  selector: 'o-table-store-configuration-dialog',
  templateUrl: './o-table-store-configuration-dialog.component.html',
  styleUrls: ['./o-table-store-configuration-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableStoreConfigurationDialogComponent extends OTableBaseDialogClass implements AfterViewInit {

  @ViewChild('propertiesList')
  public propertiesList: MatSelectionList;

  public properties: any[] = [{
    property: 'sort-columns',
    name: 'TABLE.DIALOG.PROPERTIES.SORT',
    info: 'TABLE.DIALOG.PROPERTIES.SORT.INFO'
  }, {
    property: 'oColumns-display',
    name: 'TABLE.DIALOG.PROPERTIES.COLUMNS_DISPLAY',
    info: 'TABLE.DIALOG.PROPERTIES.COLUMNS_DISPLAY.INFO'
  }, {
    property: 'quick-filter',
    name: 'TABLE.DIALOG.PROPERTIES.QUICK_FILTER',
    info: 'TABLE.DIALOG.PROPERTIES.QUICK_FILTER.INFO'
  }, {
    property: 'columns-filter',
    name: 'TABLE.DIALOG.PROPERTIES.COLUMNS_FILTER',
    info: 'TABLE.DIALOG.PROPERTIES.COLUMNS_FILTER.INFO'
  }, {
    property: 'filter-builder',
    name: 'TABLE.DIALOG.PROPERTIES.FILTER_BUILDER',
    info: 'TABLE.DIALOG.PROPERTIES.FILTER_BUILDER.INFO'
  }, {
    property: 'page',
    name: 'TABLE.DIALOG.PROPERTIES.PAGE',
    info: 'TABLE.DIALOG.PROPERTIES.PAGE.INFO'
  }];

  public formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<OTableStoreConfigurationDialogComponent>,
    protected injector: Injector
  ) {
    super(injector);
    this.setFormControl(this.formGroup.get('name'));
  }

  public ngAfterViewInit(): void {
    this.propertiesList.selectAll();
  }

  public areAllSelected(): boolean {
    return this.propertiesList && this.propertiesList.options && this.propertiesList.options.length === this.propertiesList.selectedOptions.selected.length;
  }

  public onSelectAllChange(event: MatCheckboxChange): void {
    event.checked ? this.propertiesList.selectAll() : this.propertiesList.deselectAll();
  }

  public getConfigurationAttributes(): any {
    return this.formGroup.value;
  }

  public getSelectedTableProperties(): any[] {
    const selected: MatListOption[] = this.propertiesList.selectedOptions.selected;
    return selected.length ? selected.map(item => item.value) : [];
  }

  public isIndeterminate(): boolean {
    return !this.areAllSelected();
  }

}
