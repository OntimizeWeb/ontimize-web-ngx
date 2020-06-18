import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'oTableRowClass' })
export class OTableRowClassPipe implements PipeTransform {

  transform(row: object, rowClassFn?: (row: object) => string | string[]): string | string[] {
    return rowClassFn ? rowClassFn(row) : '';
  }

}
