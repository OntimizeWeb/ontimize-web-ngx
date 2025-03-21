import { Directive, EventEmitter, Injector } from '@angular/core';

import { OTableExportButtonService } from './o-table-export-button.service';

export const DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON = [
  'icon',
  'svgIcon : svg-icon',
  'olabel: label',
  'exportType: export-type',
  'exportFunction: export-function'
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

  /**
   * @deprecated This event is deprecated and will be removed in future versions.
   * Please use `export-function` instead.
   */

  public onClick: EventEmitter<any> = new EventEmitter();
  public exportFunction: () => void;
  protected exportType: string;
  protected oTableExportButtonService: OTableExportButtonService;

  constructor(
    private readonly injector: Injector
  ) {
    this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
  }


}
