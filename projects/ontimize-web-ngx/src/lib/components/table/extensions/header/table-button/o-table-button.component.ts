import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { InputConverter } from '../../../../../decorators/input-converter';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
import { OTableButton } from '../../../../../interfaces/o-table-button.interface';

export const DEFAULT_INPUTS_O_TABLE_BUTTON = [
  'oattr: attr',
  'enabled',
  'icon',
  'svgIcon: svg-icon',
  'iconPosition: icon-position',
  'olabel: label'
];

export const DEFAULT_OUTPUTS_O_TABLE_BUTTON = [
  'onClick'
];

@Component({
  selector: 'o-table-button',
  templateUrl: './o-table-button.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_BUTTON,
  outputs: DEFAULT_OUTPUTS_O_TABLE_BUTTON,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-button]': 'true',
    '[class.text]': 'table.showButtonsText',
    '[class.no-text]': '!table.showButtonsText',
  }
})
export class OTableButtonComponent implements OTableButton, OnInit {

  public onClick: EventEmitter<object> = new EventEmitter<object>();

  public oattr: string;
  @InputConverter()
  public enabled: boolean = true;
  public icon: string;
  public svgIcon: string;
  public olabel: string;
  public iconPosition: string;

  constructor(
    protected injector: Injector,
    public elRef: ElementRef,
    @Inject(forwardRef(() => OTableComponent)) protected _table: OTableComponent
  ) { }

  public ngOnInit(): void {
    if (!Util.isDefined(this.icon) && !Util.isDefined(this.svgIcon)) {
      this.icon = 'priority_high';
    }
    this.iconPosition = Util.parseIconPosition(this.iconPosition);
  }

  public innerOnClick(event): void {
    event.stopPropagation();
    this.onClick.emit();
  }

  public isIconPositionLeft(): boolean {
    return this.iconPosition === Codes.ICON_POSITION_LEFT;
  }

  get table(): OTableComponent {
    return this._table;
  }

}
