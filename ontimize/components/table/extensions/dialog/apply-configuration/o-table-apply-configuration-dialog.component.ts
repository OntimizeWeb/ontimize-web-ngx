import { Component, Inject, Injector, EventEmitter, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatListOption, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services';

@Component({
  selector: 'o-table-apply-configuration-dialog',
  templateUrl: './o-table-apply-configuration-dialog.component.html',
  styleUrls: ['./o-table-apply-configuration-dialog.component.scss']
})
export class OTableApplyConfigurationDialogComponent {

  @ViewChild(MatSelectionList) configurationList: MatSelectionList;

  configurations: Array<any> = [];

  onDelete: EventEmitter<string> = new EventEmitter();

  protected dialogService: DialogService;

  constructor(
    public dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<any>,
    protected injector: Injector
  ) {
    if (data) {
      this.loadConfigurations(data);
    }
    this.dialogService = this.injector.get(DialogService);
  }

  loadConfigurations(configurations: Array<any>): void {
    this.configurations = [];
    configurations.forEach((configuration: any) => {
      this.configurations.push(configuration);
    });
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
