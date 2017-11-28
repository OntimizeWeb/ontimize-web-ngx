import { Component, OnInit, Injector, forwardRef, Inject, ComponentFactoryResolver, ComponentFactory, ViewChild, ViewContainerRef } from '@angular/core';
import { InputConverter } from '../../../decorators';
import {
  OTableCellRendererDateComponent,
  OTableCellRendererCurrencyComponent,
  OTableCellRendererImageComponent,
  OTableCellRendererIntegerComponent,
  OTableCellRendererRealComponent,
  OTableCellRendererBooleanComponent,
  OTableCellRendererPercentageComponent
} from './cell-renderer/cell-renderer';

import { OTableComponent } from '../o-table.component';
import { Util } from '../../../util/util';


export const DEFAULT_INPUTS_O_TABLE_COLUMN = [

  // attr [string]: column name.
  'attr',

  // title [string]: column title. Default: no value.
  'title',

  // orderable [no|yes]: column can be sorted. Default: yes.
  'orderable',

  // searchable [no|yes]: searchings are performed into column content. Default: yes.
  'searchable',

  // type [boolean|integer|real|currency|date|image]: column type. Default: no value (string).
  'type',

  // editable [no|yes]: column can be edited directly over the table. Default: no.
  'editable',

  // date-model-type [timestamp|string]: if a date column is editable, its model type must be defined to be able to save its value,
  // e.g. classic ontimize server dates come as timestamps (number), but to be able to save them they have to be send as strings with
  // the format 'YYYY-MM-DD HH:mm:ss' (especified in the date-model-format attribute). Default: timestamp.
  'dateModelType: date-model-type',

  // date-model-format [string]: if date model type is string, its date model format should be defined. Default: ISO date.
  'dateModelFormat: date-model-format',

  'width',

  'class',

  // break-word [no|yes|true|false]: content column can show in multiple lines if it not catch in the cell. Default: no and if content of the cell overflow.
  'breakWord:break-word',

  // async-load [no|yes|true|false]: asynchronous query. Default: no
  'asyncLoad : async-load'
];


@Component({
  selector: 'o-table-column',
  templateUrl: './o-table-column.component.html',
  styleUrls: ['./o-table-column.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_COLUMN,
    ...OTableCellRendererBooleanComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN,
    ...OTableCellRendererCurrencyComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY, // includes Integer and Real
    ...OTableCellRendererDateComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE,
    ...OTableCellRendererImageComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE,
  ],
  host: {
    '[class.columnBreakWord]': 'breakWord'
  }
})
export class OTableColumnComponent implements OnInit {

  public type: string;
  public renderer: any;
  public attr: string;
  public title: string;
  public orderable: any;
  public searchable: any;
  public editable: any;
  public width: string = '';

  /*input renderer date */
  protected format: string;
  /*input renderer integer */
  protected grouping: any = true;
  protected thousandSeparator: string = ',';
  /*input renderer real */
  protected decimalSeparator: string = '.';
  protected decimalDigits: number = 2;
  /*input renderer currency */
  protected currencySymbol: string;
  protected currencySymbolPosition: string;

  /*input renderer boolean */
  protected trueValueType: string;
  protected trueValue: string;
  protected falseValueType: string;
  protected falseValue: string;
  protected dataType: string = 'boolean';

  /*input image */
  protected imageType: string;
  protected avatar: string;
  protected emptyImage: string;

  @InputConverter()
  protected breakWord: boolean = false;
  @InputConverter()
  protected asyncLoad: boolean = false;

  protected table: OTableComponent;

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) table: OTableComponent,
    private resolver: ComponentFactoryResolver,
    protected injector: Injector) {
    this.table = table;
  }

  public ngOnInit() {
    let factory: ComponentFactory<any>;
    this.orderable = Util.parseBoolean(this.orderable, true);
    this.searchable = Util.parseBoolean(this.searchable, true);
    this.grouping = Util.parseBoolean(this.grouping, true);
    if (typeof (this.renderer) === 'undefined') {
      switch (this.type) {
        case 'currency':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererCurrencyComponent);
          break;
        case 'date':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererDateComponent);
          break;
        case 'integer':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererIntegerComponent);
          break;
        case 'boolean':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererBooleanComponent);
          break;
        case 'real':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererRealComponent);
          break;
        case 'image':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererImageComponent);
          break;
        case 'percentage':
          factory = this.resolver.resolveComponentFactory(OTableCellRendererPercentageComponent);
          break;

      }

      if (factory) {
        let ref = this.container.createComponent(factory);
        this.renderer = ref.instance;
        switch (this.type) {
          case 'currency':
            this.renderer.currencySymbol = this.currencySymbol;
            this.renderer.currencySymbolPosition = this.currencySymbolPosition;
            this.renderer.decimalSeparator = this.decimalSeparator;
            this.renderer.decimalDigits = this.decimalDigits;
            this.renderer.grouping = this.grouping;
            this.renderer.thousandSeparator = this.thousandSeparator;

            break;
          case 'date':
            this.renderer.format = this.format;
            break;
          case 'integer':
            this.renderer.grouping = this.grouping;
            this.renderer.thousandSeparator = this.thousandSeparator;
            break;
          case 'boolean':
            this.renderer.trueValueType = this.trueValueType;
            this.renderer.trueValue = this.trueValue;
            this.renderer.falseValueType = this.falseValueType;
            this.renderer.falseValue = this.falseValue;
            this.renderer.dataType = this.dataType;
            break;
          case 'real':
          case 'percentage':
            this.renderer.decimalSeparator = this.decimalSeparator;
            this.renderer.decimalDigits = this.decimalDigits;
            this.renderer.grouping = this.grouping;
            this.renderer.thousandSeparator = this.thousandSeparator;

            break;
          case 'image':
            this.renderer.imageType = this.imageType;
            this.renderer.avatar = this.avatar;
            this.renderer.emptyImage = this.emptyImage;
            break;
        }

      }
    }
    this.table.registerColumn(this);
  }

  public registerRenderer(renderer: any) {
    this.renderer = renderer;
  }
}
