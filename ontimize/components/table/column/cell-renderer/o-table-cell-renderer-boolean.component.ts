import { Component, Injector,Inject,forwardRef,ViewChild, TemplateRef } from '@angular/core';
import { OTableColumnComponent} from '../o-table-column.component'

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
    'dataType: data-type'
  ];
  
@Component({
  selector: 'o-table-cell-renderer-boolean',
  templateUrl: './o-table-cell-renderer-boolean.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN
  ]
})
export class OTableCellRendererBooleanComponent{

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN;

  public trueValueType: string;
  public trueValue: string;
  public falseValueType: string;
  public falseValue: string; 
  protected dataType: string='boolean';

  protected tableColumn: OTableColumnComponent;
  

  @ViewChild('templateref',{read:TemplateRef}) public templateref: TemplateRef<any>;
  
  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {
      this.tableColumn = this.injector.get(OTableColumnComponent);
      this.tableColumn.type = "boolean";
      this.tableColumn.registerRenderer(this);
    }
  
  public hasCellDataTrueValue(cellData: any): boolean {
    let comparisonValue: boolean = undefined;
    switch (this.dataType) {
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
 

}
