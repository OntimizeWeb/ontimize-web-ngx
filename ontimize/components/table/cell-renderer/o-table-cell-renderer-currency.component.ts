import { Component, OnInit, Inject, Injector, forwardRef } from '@angular/core';

import {
  OTableCellRendererRealComponent,
  DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
} from './o-table-cell-renderer-real.component';
import { ITableCellRenderer } from '../../../interfaces';
import { OTableColumnComponent } from '../o-table-column.component';
import { CurrencyService } from '../../../services';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY = [

  ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL,

  // currency-symbol [string]: currency symbol. Default: dollar ($).
  'currencySymbol: currency-symbol',

  // currency-symbol-position [left|right]: position of the currency symbol. Default: left.
  'currencySymbolPosition: currency-symbol-position'

];

@Component({
  selector: 'o-table-cell-renderer-currency',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY
  ]
})
export class OTableCellRendererCurrencyComponent extends OTableCellRendererRealComponent implements OnInit, ITableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY;

  protected currencyService: CurrencyService;
  protected currencySymbol : string;
  protected currencySymbolPosition : string;

  constructor(@Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
    super(tableColumn, injector);
    this.currencyService = this.injector.get(CurrencyService);
  }

  public ngOnInit() {
    super.ngOnInit();
    if (typeof(this.currencySymbol) === 'undefined') {
      this.currencySymbol = this.currencyService.symbol;
    }
    if (typeof(this.currencySymbolPosition) === 'undefined') {
      this.currencySymbolPosition = this.currencyService.symbolPosition;
    }
  }

  public init(parameters: any) {
    super.init(parameters);
    if (typeof(parameters) !== 'undefined') {
      if (typeof(parameters.currencySymbol) !== 'undefined') {
        this.currencySymbol = parameters.currencySymbol;
      }
      if (typeof(parameters.currencySymbolPosition) !== 'undefined') {
        this.currencySymbolPosition = parameters.currencySymbolPosition;
      }
    }
  }

  public render(cellData: any, rowData: any): string {
    return this.currencyService.getCurrencyValue(cellData, this.currencySymbol, this.currencySymbolPosition, this.grouping,
        this.thousandSeparator, this.decimalSeparator, this.decimalDigits);
  }

  public handleCreatedCell(cellElement: any, rowData: any) {
    // nothing to do here
  }

}
