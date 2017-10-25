import { Component, OnInit } from '@angular/core';

export const DEFAULT_INPUTS_O_DATATABLE_COLUMN = [
    
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
    
      'class'
    ];

    
@Component({
    selector: 'o-table-column',
    templateUrl: './o-table-column.component.html',
    styleUrls: ['./o-table-column.component.scss'],
    inputs: [
      ...DEFAULT_INPUTS_O_DATATABLE_COLUMN
    ]
})
export class OTableColumnComponent implements OnInit {

  public ngOnInit() {
    
  }

  ngAfterViewInit() {
    
  }

}