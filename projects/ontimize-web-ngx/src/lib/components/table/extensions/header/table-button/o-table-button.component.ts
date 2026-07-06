import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { OTableButton } from '../../../../../interfaces/o-table-button.interface';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableBase } from '../../../o-table-base.class';

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
  standalone: true,
  imports: [NgClass, MatButtonModule, MatIconModule, OTranslatePipe],
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
  @BooleanInputConverter()
  public enabled: boolean = true;
  public icon: string;
  public svgIcon: string;
  public olabel: string;
  public iconPosition: string;

  constructor(
    protected injector: Injector,
    public elRef: ElementRef,
    @Inject(forwardRef(() => OTableBase)) protected _table: OTableBase
  ) { }

  public ngOnInit(): void {
    if (!Util.isDefined(this.icon) && !Util.isDefined(this.svgIcon)) {
      this.icon = 'priority_high';
    }
    this.iconPosition = Util.parseIconPosition(this.iconPosition);
  }

  public innerOnClick(event): void {
    event.stopPropagation();
    if (!this.isReadOnly()) {
      this.onClick.emit();
    } else if (this._table.showNotificationOfReadOnly) {
        this.table.getSnackService().open('MESSAGES.OPERATION_NOT_ALLOWED_READONLY');

    }
  }

  isReadOnly(): boolean {
    return this._table.isComponentReadOnly('o-table-button', this.oattr)
  }

  public isIconPositionLeft(): boolean {
    return this.iconPosition === Codes.ICON_POSITION_LEFT;
  }

  /**
   * Style of this action, resolved by the table from its `attr` (explicit
   * `action-styles` > component auto-rules > default `outline` + `default`). A
   * custom `o-table-button` projected into the table therefore defaults to
   * `outline` + `default` and honours any `action-styles` keyed by its `attr`.
   */
  get variant(): string {
    return this.table.getActionVariant(this.oattr);
  }

  /** Resolved `o-button--importance-*` class for this action (see `variant`). */
  get importanceClass(): string {
    return this.table.getActionImportanceClass(this.oattr);
  }

  /** Material container colour for filled variants of this action (see `variant`). */
  get color(): ThemePalette {
    return this.table.getActionColor(this.oattr);
  }

  get table(): OTableBase {
    return this._table;
  }

}
