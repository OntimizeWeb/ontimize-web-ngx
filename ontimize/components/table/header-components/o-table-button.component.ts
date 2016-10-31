import { Component, OnInit, Inject, forwardRef } from '@angular/core';


import { OTableComponent } from '../o-table.component';


export const DEFAULT_INPUTS_O_TABLE_BUTTON = [

  'icon',

  'text : text'
];

@Component({
  selector: 'o-table-button',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_BUTTON
  ]
})
export class OTableButtonComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_BUTTON = DEFAULT_INPUTS_O_TABLE_BUTTON;

  protected table: OTableComponent;
  protected icon: string;
  protected text: string;


  constructor( @Inject(forwardRef(() => OTableComponent)) table: OTableComponent) {
    this.table = table;
  }

  public ngOnInit() {
    this.table.registerHeaderButton(this);
  }

  public getText() {
    return this.text;
  }
}
