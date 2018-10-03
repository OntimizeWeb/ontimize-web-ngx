import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { Util, Codes } from '../../../../../utils';
import { OTableComponent } from '../../../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_BUTTON = [
  'icon',
  'svgIcon: svg-icon',
  'iconPosition: icon-position',
  'olabel: label'
];

export const DEFAULT_OUTPUTS_O_TABLE_BUTTON = [
  'onClick'
];

@Component({
  moduleId: module.id,
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

  public onClick: EventEmitter<Object> = new EventEmitter<Object>();

  public icon: string;
  public svgIcon: string;
  public olabel: string;
  public iconPosition: string;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected _table: OTableComponent
  ) {

  }

  public ngOnInit() {
    if (!Util.isDefined(this.icon) && !Util.isDefined(this.svgIcon)) {
      this.icon = 'priority_high';
    }
    this.iconPosition = Util.parseIconPosition(this.iconPosition);
  }

  innerOnClick() {
    this.onClick.emit();
  }

  isIconPositionLeft() {
    return this.iconPosition === Codes.ICON_POSITION_LEFT;
  }

  get table() {
    return this._table;
  }
}
