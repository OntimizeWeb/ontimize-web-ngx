import { Component, Inject, Injector, EventEmitter, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatListOption, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services';

import { ITableConfiguration } from '../../o-table-storage.class';

@Component({
  selector: 'o-table-apply-configuration-dialog',
  templateUrl: './o-table-apply-configuration-dialog.component.html',
  styleUrls: ['./o-table-apply-configuration-dialog.component.scss']
})
export class OTableApplyConfigurationDialogComponent {

  @ViewChild(MatSelectionList) configurationList: MatSelectionList;

  configurations: Array<ITableConfiguration> = [];

  onDelete: EventEmitter<string> = new EventEmitter();

  protected dialogService: DialogService;

  constructor(
    public dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<ITableConfiguration>,
    protected injector: Injector
  ) {
    this.loadConfigurations(data);
    this.dialogService = this.injector.get(DialogService);
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

  getSelectedConfigurationName(): string {
    let selected: MatListOption[] = this.configurationList.selectedOptions.selected;
    return selected.length ? selected[0].value : void 0;
  }

}
