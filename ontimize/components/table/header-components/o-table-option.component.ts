import { Component, OnInit, Inject, forwardRef, EventEmitter } from '@angular/core';


import { OTableComponent } from '../o-table.component';


export const DEFAULT_INPUTS_O_TABLE_OPTION = [
  'icon',
  'olabel: label'
];

export const DEFAULT_OUTPUTS_O_TABLE_OPTION = [
  'click'
];

@Component({
  selector: 'o-table-option',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_OPTION
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TABLE_OPTION
  ]
})
export class OTableOptionComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_OPTION = DEFAULT_INPUTS_O_TABLE_OPTION;
  public static DEFAULT_OUTPUTS_O_TABLE_OPTION = DEFAULT_OUTPUTS_O_TABLE_OPTION;

  public click: EventEmitter<Object> = new EventEmitter<Object>();

  protected table: OTableComponent;
  protected icon: string;
  protected olabel: string;

  constructor( @Inject(forwardRef(() => OTableComponent)) table: OTableComponent) {
    this.table = table;
  }

  public ngOnInit() {
    this.table.registerHeaderOption(this);
  }

  innerOnClick(event: any) {
    this.click.emit(event);
  }

}
