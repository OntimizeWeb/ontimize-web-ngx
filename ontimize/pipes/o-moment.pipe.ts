
import { Pipe, PipeTransform } from '@angular/core';
import {
    MomentService,
  } from '../services';

  
@Pipe({
    name: 'oMoment'
})

export class oMomentPipe implements PipeTransform {
    constructor(public momentService: MomentService) {
        
          }
        
    transform(value: any, format: string = ""): string {
      
        return this.momentService.parseDate(value,format);
    }
}