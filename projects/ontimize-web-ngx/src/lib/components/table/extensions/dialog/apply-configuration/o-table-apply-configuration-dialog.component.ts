import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyListOption as MatListOption, MatLegacySelectionList as MatSelectionList } from '@angular/material/legacy-list';

import { DialogService } from '../../../../../services/dialog.service';
import { OTableConfiguration } from '../../../../../types/table/o-table-configuration.type';

@Component({
  selector: 'o-table-apply-configuration-dialog',
  templateUrl: './o-table-apply-configuration-dialog.component.html'
})
export class OTableApplyConfigurationDialogComponent implements OnInit {

  public default_configuration = 'OTableApplyConfigurationDialogComponent-default';
  public configurations: OTableConfiguration[] = [];

  public onDelete: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatSelectionList, { static: true })
  protected configurationList: MatSelectionList;

  protected dialogService: DialogService;

  constructor(
    public dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: OTableConfiguration[],
    protected injector: Injector
  ) {
    this.loadConfigurations(data);
    this.dialogService = this.injector.get(DialogService);
  }

  public ngOnInit(): void {
    this.configurationList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  public loadConfigurations(configurations: OTableConfiguration[]): void {
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
