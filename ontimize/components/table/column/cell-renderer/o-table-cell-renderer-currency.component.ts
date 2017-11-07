
import { Component, forwardRef, Inject, Injector, ViewChild, TemplateRef } from '@angular/core';
import { OTableColumnComponent } from '../o-table-column.component'
import { OTableCellRenderer } from './o-table-cell-renderer';
import {
    OTableCellRendererRealComponent
} from './o-table-cell-renderer-real.component';

import {
    OCurrencyPipe,
    ICurrencyPipeArgument
} from '../../../../pipes';

import { CurrencyService } from '../../../../services';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY = [
    ...OTableCellRendererRealComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL,

    // currency-symbol [string]: currency symbol. Default: dollar ($).
    'currencySymbol: currency-symbol',

    // currency-symbol-position [left|right]: position of the currency symbol. Default: left.
    'currencySymbolPosition: currency-symbol-position'

];

@Component({
    selector: 'o-table-cell-renderer-currency',
    templateUrl: './o-table-cell-renderer-currency.component.html',
    inputs: [
        ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY
    ]
})

export class OTableCellRendererCurrencyComponent extends OTableCellRenderer {

    public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY;

    protected currencySymbol: string;
    protected currencySymbolPosition: string;
    protected decimalSeparator: string = ".";
    protected decimalDigits: number = 2;
    protected grouping: boolean = true;
    protected thousandSeparator: string = ",";

    protected currencyService: CurrencyService;
    protected tableColumn: OTableColumnComponent;

    protected componentPipe: OCurrencyPipe
    protected pipeArguments: ICurrencyPipeArgument;
    @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

    constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
        protected injector: Injector) {
        super();
        this.tableColumn = this.injector.get(OTableColumnComponent);
        this.tableColumn.type = "currency";
        this.currencyService = this.injector.get(CurrencyService);
        this.setComponentPipe();
    }


    setComponentPipe() {
        this.componentPipe = new OCurrencyPipe(this.injector);
    }
    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if (typeof this.currencySymbol === "undefined") {
            this.currencySymbol = this.currencyService.symbol;
        }
        if (typeof this.currencySymbolPosition === "undefined") {
            this.currencySymbolPosition = this.currencyService.symbolPosition;
        }
        this.pipeArguments = {
            currencySimbol:this.currencySymbol,
            currencySymbolPosition:this.currencySymbolPosition,
            decimalDigits: this.decimalDigits,
            decimalSeparator: this.decimalSeparator,
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
        };


        this.tableColumn.registerRenderer(this);
    }
}  