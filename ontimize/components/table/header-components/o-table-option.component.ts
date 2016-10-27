import { Component, OnInit, Inject, forwardRef } from '@angular/core';


import { OTableComponent } from '../o-table.component';


export const DEFAULT_INPUTS_O_TABLE_OPTION = [

  //.
  'icon',
  //
  'text'
];

@Component({
  selector: 'o-table-option',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_OPTION
  ]
})
export class OTableOptionComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_OPTION = DEFAULT_INPUTS_O_TABLE_OPTION;

  protected table: OTableComponent;
  protected icon: string;
  protected text: string;

  constructor( @Inject(forwardRef(() => OTableComponent)) table: OTableComponent) {
    this.table = table;
  }

  public ngOnInit() {
    this.table.registerHeaderOption(this);
  }
}
