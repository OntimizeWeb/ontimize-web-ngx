import { PipeTransform } from '@angular/core';

export class OTableCellRenderer{
    
    protected pipeArguments:any;
    protected componentPipe:PipeTransform;
/**
 * 
 * @param value data to render integer
 */
  getCellData(value:any){
    let parsedValue:string;
    if (typeof this.pipeArguments !== 'undefined' && value!==undefined) {
        
      parsedValue = this.componentPipe.transform(value, this.pipeArguments);
    }
    return parsedValue;
  }
}