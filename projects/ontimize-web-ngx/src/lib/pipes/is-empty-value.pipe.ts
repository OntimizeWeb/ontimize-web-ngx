import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isEmptyValue',
  pure: true,
  standalone: true
})
export class IsEmptyValuePipe implements PipeTransform {

  transform(value: any): unknown {
    return value === null || value === undefined || value === '';
  }

}
