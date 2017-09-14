import {
  Component,
  Inject,
  forwardRef,
  Injector
} from '@angular/core';

import {
  OTableColumnComponent,
  ITableCellRenderer
} from '../o-table-column.component';

import { OTranslateService } from '../../../services';

import { Util } from '../../../util/util';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_STRING = [
  'translate'
];

@Component({
  selector: 'o-table-cell-renderer-string',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_STRING
  ],
})
export class OTableCellRendererStringComponent implements ITableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_STRING = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_STRING;

  protected translate: any;
  protected translateService: OTranslateService;

  constructor(
    @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector
  ) {
    tableColumn.registerRenderer(this);
    this.translateService = this.injector.get(OTranslateService);
  }

  public ngOnInit() {
    this.translate = Util.parseBoolean(this.translate, false);
    this.init(undefined);
  }

  public init(parameters: any) {
    if (typeof (parameters) !== 'undefined') {
      if (typeof (parameters.translate) !== 'undefined') {
        this.translate = parameters.translate;
      }
    }
  }

  public render(cellData: any, rowData: any): string {
    let value = '';
    if (typeof (cellData) !== 'undefined') {
      value = this.translate ? this.translateService.get(String(cellData)) : String(cellData);
    }
    return value;
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    // nothing to do here
  }

}
