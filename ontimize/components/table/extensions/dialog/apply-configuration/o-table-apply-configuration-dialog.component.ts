import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatListOption, MatSelectionList } from '@angular/material';

import { DialogService } from '../../../../../services';
import { ITableConfiguration } from '../../o-table-storage.class';

@Component({
  moduleId: module.id,
  selector: 'o-table-apply-configuration-dialog',
  templateUrl: './o-table-apply-configuration-dialog.component.html',
  styleUrls: ['./o-table-apply-configuration-dialog.component.scss']
})
export class OTableApplyConfigurationDialogComponent implements OnInit {

  public default_configuration = 'OTableApplyConfigurationDialogComponent-default';
  public configurations: ITableConfiguration[] = [];

  public onDelete: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatSelectionList)
  protected configurationList: MatSelectionList;

  protected dialogService: DialogService;

  constructor(
    public dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ITableConfiguration[],
    protected injector: Injector
  ) {
    this.loadConfigurations(data);
    this.dialogService = this.injector.get(DialogService);
  }

  public ngOnInit(): void {
    this.configurationList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  public loadConfigurations(configurations: ITableConfiguration[]): void {
    this.configurations = configurations;
  }

  public removeConfiguration(configurationName: string): void {
    this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_CONFIGURATION').then(result => {
      if (result) {
        this.onDelete.emit(configurationName);
      }
    });
  }

  public isDefaultConfigurationSelected(): boolean {
    const selected: MatListOption[] = this.configurationList.selectedOptions.selected;
    const selectedValue = selected.length ? selected[0].value : void 0;
    return selectedValue === this.default_configuration;
  }

  public getSelectedConfigurationName(): string {
    const selected: MatListOption[] = this.configurationList.selectedOptions.selected;
    return selected.length ? selected[0].value : void 0;
  }

}
