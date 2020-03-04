import { Component, EventEmitter, Injector } from '@angular/core';

import { OTableExportButtonService } from './o-table-export-button.service';

const INPUTS_ARRAY = [
  'icon',
  'svgIcon : svg-icon',
  'olabel: label',
  'exportType: export-type'
];

const OUTPUTS_ARRAY = [
  'onClick'
];

@Component({
  selector: 'o-table-export-button',
  templateUrl: './o-table-export-button.component.html',
  inputs: INPUTS_ARRAY,
  outputs: OUTPUTS_ARRAY
})
export class OTableExportButtonComponent {

  public static INPUTS_ARRAY = INPUTS_ARRAY;
  public staticOUTPUTS_ARRAY = OUTPUTS_ARRAY;

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
