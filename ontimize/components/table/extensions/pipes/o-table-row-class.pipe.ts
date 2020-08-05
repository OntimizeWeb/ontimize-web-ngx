import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'oTableRowClass' })
export class OTableRowClassPipe implements PipeTransform {

  transform(rowData: any, rowIndex: number, rowClassFn?: (row: any, index: number) => string | string[]): string | string[] {
    return rowClassFn ? rowClassFn(rowData, rowIndex) : '';
  }

}
