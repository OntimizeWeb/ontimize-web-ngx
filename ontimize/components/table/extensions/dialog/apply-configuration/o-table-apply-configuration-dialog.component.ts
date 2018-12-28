import { Component, Inject, Injector, EventEmitter, ViewChild, OnInit, ChangeDetectionStrategy, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatListOption, MatSelectionList } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogService } from '../../../../../services';

import { ITableConfiguration } from '../../o-table-storage.class';

@Component({
  moduleId: module.id,
  selector: 'o-table-apply-configuration-dialog',
  templateUrl: './o-table-apply-configuration-dialog.component.html',
  styleUrls: ['./o-table-apply-configuration-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OTableApplyConfigurationDialogComponent implements OnInit {

  @ViewChild(MatSelectionList) configurationList: MatSelectionList;

  configurations: Array<ITableConfiguration> = [];

  onDelete: EventEmitter<string> = new EventEmitter();

  protected dialogService: DialogService;

  default_configuration = 'OTableApplyConfigurationDialogComponent-default';

  constructor(
    public dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<ITableConfiguration>,
    protected injector: Injector
  ) {
    this.loadConfigurations(data);
    this.dialogService = this.injector.get(DialogService);
  }

  ngOnInit(): void {
    this.configurationList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  loadConfigurations(configurations: Array<ITableConfiguration>): void {
    this.configurations = configurations;
  }

  removeConfiguration(configurationName: string): void {
    this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_CONFIGURATION').then(result => {
      if (result) {
        this.onDelete.emit(configurationName);
      }
    });
  }

  isDefaultConfigurationSelected(): boolean {
    const selected: MatListOption[] = this.configurationList.selectedOptions.selected;
    const selectedValue = selected.length ? selected[0].value : void 0;
    return selectedValue === this.default_configuration;
  }

  getSelectedConfigurationName(): string {
    const selected: MatListOption[] = this.configurationList.selectedOptions.selected;
    return selected.length ? selected[0].value : void 0;
  }

}
