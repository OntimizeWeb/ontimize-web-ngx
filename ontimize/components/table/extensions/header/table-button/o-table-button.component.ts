import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { OTableComponent } from '../../../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_BUTTON = [
  'icon',
  'iconPosition : icon-position',
  'olabel: label'
];

export const DEFAULT_OUTPUTS_O_TABLE_BUTTON = [
  'onClick'
];

@Component({
  selector: 'o-table-button',
  templateUrl: './o-table-button.component.html',
  styleUrls: ['./o-table-button.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_BUTTON,
  outputs: DEFAULT_OUTPUTS_O_TABLE_BUTTON,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-button]': 'true',
  }
})

export class OTableButtonComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_BUTTON = DEFAULT_INPUTS_O_TABLE_BUTTON;
  public static DEFAULT_OUTPUTS_O_TABLE_BUTTON = DEFAULT_OUTPUTS_O_TABLE_BUTTON;
  public static ICON_POSITION_LEFT = 'left';
  public static ICON_POSITION_RIGHT = 'right';

  public onClick: EventEmitter<Object> = new EventEmitter<Object>();

  public icon: string;
  public olabel: string;
  public iconPosition: string;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected _table: OTableComponent
  ) {

  }

  public ngOnInit() {
    if (typeof this.icon === 'undefined') {
      this.icon = 'priority_high';
    }
    const availablePos = [OTableButtonComponent.ICON_POSITION_LEFT, OTableButtonComponent.ICON_POSITION_RIGHT];
    if (this.iconPosition) {
      this.iconPosition = this.iconPosition.toLowerCase();
    }
    if (availablePos.indexOf(this.iconPosition) === -1) {
      this.iconPosition = OTableButtonComponent.ICON_POSITION_LEFT;
    }
    // this.table.registerHeaderButton(this);
  }

  innerOnClick() {
    this.onClick.emit();
  }

  isIconPositionLeft() {
    return this.iconPosition === OTableButtonComponent.ICON_POSITION_LEFT;
  }

  get table() {
    return this._table;
  }
}
