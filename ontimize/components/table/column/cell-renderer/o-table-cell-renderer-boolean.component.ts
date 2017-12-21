import { Component, Injector, ViewChild, TemplateRef } from '@angular/core';
import { OTranslateService } from '../../../../services/o-translate.service';
import { OBaseTableCellRenderer } from './o-base-table-cell-renderer.class';


export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN = [
  // true-value-type [string|number|icon|image]: type of value if true. Default: no value.
  'trueValueType: true-value-type',
  // true-value [string]: true value. Default: no value.
  'trueValue: true-value',
  // false-value-type [string|number|icon|image]: type of value if false. Default: no value.
  'falseValueType: false-value-type',
  // false-value [string]: false value. Default: no value.
  'falseValue: false-value',
  // false-value [number|boolean|string]: cellData value type. Default: boolean
  'booleanType: boolean-type'
];

@Component({
  selector: 'o-table-cell-renderer-boolean',
  templateUrl: './o-table-cell-renderer-boolean.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN
  ]
})
export class OTableCellRendererBooleanComponent extends OBaseTableCellRenderer {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN;

  public trueValueType: string;
  public trueValue: string;
  public falseValueType: string;
  public falseValue: string;

  protected booleanType: string = 'boolean';
  protected translateService: OTranslateService;



  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'boolean';
    this.translateService = this.injector.get(OTranslateService);
    this.initialize();
  }

  public hasCellDataTrueValue(cellData: any): boolean {
    let comparisonValue: boolean = undefined;
    switch (this.booleanType) {
      case 'string':
        const stringVal = cellData.toString().toLowerCase();
        comparisonValue = (stringVal === 'true' || stringVal === 'yes');
        break;
      case 'number':
        comparisonValue = (cellData === 1);
        break;
      case 'boolean':
      default:
        // boolean comparision as default value of dataType
        comparisonValue = (cellData === true);
        break;
    }
    return comparisonValue;
  }


  public getCellData(cellData: any) {
    let type = this.hasCellDataTrueValue(cellData) ? this.trueValueType : this.falseValueType;
    let value = this.hasCellDataTrueValue(cellData) ? this.trueValue : this.falseValue;

    switch (type) {
      case 'string':
        return this.translateService.get(value);
      case 'number':
        return value;
      default:
        return cellData;
    }
  }


}
