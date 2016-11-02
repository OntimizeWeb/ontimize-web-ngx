import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector } from '@angular/core';
import { OTranslateService } from '../../../services';
import { OTableComponent } from '../o-table.component';


export const DEFAULT_INPUTS_O_TABLE_BUTTON = [

  'icon',

  'text'
];

export const DEFAULT_OUTPUTS_O_TABLE_BUTTON = [
  'click'
];

@Component({
  selector: 'o-table-button',
  template: '',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_BUTTON
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_TABLE_BUTTON
  ]
})
export class OTableButtonComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_BUTTON = DEFAULT_INPUTS_O_TABLE_BUTTON;
  public static DEFAULT_OUTPUTS_O_TABLE_BUTTON = DEFAULT_OUTPUTS_O_TABLE_BUTTON;

  public click: EventEmitter<Object> = new EventEmitter<Object>();

  protected table: OTableComponent;
  protected translateService: OTranslateService;
  protected icon: string;
  protected text: string;


  constructor(protected injector: Injector, @Inject(forwardRef(() => OTableComponent)) table: OTableComponent) {
    this.table = table;
    this.translateService = injector.get(OTranslateService);
  }

  public ngOnInit() {
    this.table.registerHeaderButton(this);
    if (typeof this.text !== 'undefined' && this.text.length > 0) {
      this.text = this.translateService.get(this.text);
    }
    if (typeof this.icon === 'undefined') {
      this.icon = 'priority_high';
    }
  }

  public getText() {
    return this.text;
  }

  public getIcon() {
    return this.icon;
  }

  innerOnClick() {
    this.click.emit();
  }
}
