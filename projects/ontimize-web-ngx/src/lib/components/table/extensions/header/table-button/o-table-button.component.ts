import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, OnInit, ViewEncapsulation } from '@angular/core';

import { InputConverter } from '../../../../../decorators';
import { Codes, Util } from '../../../../../utils';
import { OTableComponent } from '../../../o-table.component';

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
  moduleId: module.id,
  selector: 'o-table-button',
  templateUrl: './o-table-button.component.html',
  styleUrls: ['./o-table-button.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_BUTTON,
  outputs: DEFAULT_OUTPUTS_O_TABLE_BUTTON,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-button]': 'true',
  }
})
export class OTableButtonComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_BUTTON = DEFAULT_INPUTS_O_TABLE_BUTTON;
  public static DEFAULT_OUTPUTS_O_TABLE_BUTTON = DEFAULT_OUTPUTS_O_TABLE_BUTTON;

  public onClick: EventEmitter<Object> = new EventEmitter<Object>();

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
