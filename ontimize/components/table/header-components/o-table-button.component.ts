import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector } from '@angular/core';
import { OTranslateService } from '../../../services';
import { OTableComponent } from '../o-table.component';


export const DEFAULT_INPUTS_O_TABLE_BUTTON = [
  'icon',
  'olabel: label'
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
  protected olabel: string;


  constructor(protected injector: Injector, @Inject(forwardRef(() => OTableComponent)) table: OTableComponent) {
    this.table = table;
    this.translateService = injector.get(OTranslateService);
  }

  public ngOnInit() {
    this.table.registerHeaderButton(this);
    if (typeof this.olabel !== 'undefined' && this.olabel.length > 0) {
      this.olabel = this.translateService.get(this.olabel);
    }
    if (typeof this.icon === 'undefined') {
      this.icon = 'priority_high';
    }
  }

  public getLabel() {
    return this.olabel;
  }

  public getIcon() {
    return this.icon;
  }

  innerOnClick() {
    this.click.emit();
  }
}
