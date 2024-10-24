import { Directive, EventEmitter, Injector } from '@angular/core';

import { OTableExportButtonService } from './o-table-export-button.service';

export const DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON = [
  'icon',
  'svgIcon : svg-icon',
  'olabel: label',
  'exportType: export-type'
];

export const DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON = [
  'onClick'
];

@Directive({
  selector: 'o-table-export-button',
  inputs: DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON,
  outputs: DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON
})
export class OTableExportButtonComponent {

  public icon: string;
  public svgIcon: string;
  public olabel: string;
  public onClick: EventEmitter<any> = new EventEmitter();
  protected exportType: string;
  protected oTableExportButtonService: OTableExportButtonService;

  constructor(
    private injector: Injector
  ) {
    this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
  }

  click() {
    this.onClick.emit(this.exportType);
    this.oTableExportButtonService.export$.next(this.exportType);
  }

}
