import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ActivatedRoute } from '@angular/router';
import { BooleanInputConverter } from '../../decorators/input-converter';
import { PermissionsService } from '../../services';
import { O_ACTION_STYLES_CONFIG, OActionImportance, OActionStyleProvider, OActionStylesConfig, OActionVariant, OPermissions, OResolvedActionStyle } from '../../types';
import { Codes } from '../../util/codes';
import { resolveActionStyle, Util } from '../../util';
import { OTranslatePipe } from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_BUTTON = [
  'oattr: attr',
  'olabel: label',
  // type [BASIC|RAISED|STROKED|FLAT|ICON|FAB|MINI-FAB]: The type of button. Default: STROKED.
  // @deprecated use `variant` instead (kept for backwards compatibility).
  'otype: type',
  // icon [string]: Name of google icon (see https://design.google.com/icons/)
  'icon',
  'svgIcon : svg-icon',
  'iconPosition: icon-position',
  'image',
  // enabled [yes|no|true|false]: Whether the button is enabled. Default: yes
  'enabled',
  // color: Theme color palette for the component.
  // @deprecated use `importance` instead (kept for backwards compatibility).
  'color',
  // variant [outline|flat|basic|raised|icon|fab|mini-fab]: visual variant / shape of the button. Default: outline.
  'variant',
  // importance [primary|warn|default]: semantic relevance (colours text + icon).
  'importance'
];
export const DEFAULT_OUTPUTS_O_BUTTON = [
  'onClick',
  'click'
];
@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, OTranslatePipe],
  selector: 'o-button',
  inputs: DEFAULT_INPUTS_O_BUTTON,
  outputs: DEFAULT_OUTPUTS_O_BUTTON,
  templateUrl: './o-button.component.html',
  styleUrls: ['./o-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-button]': 'true',
    '[class.o-button-icon-position-top]': 'iconPosition==="top"',
    '[class.o-button-icon-position-bottom]': 'iconPosition==="bottom"',
    '[class.o-action--importance-primary]': "appliesImportanceColor && resolvedImportance === 'primary'",
    '[class.o-action--importance-warn]': "appliesImportanceColor && resolvedImportance === 'warn'",
    '[class.o-action--importance-default]': "appliesImportanceColor && resolvedImportance === 'default'",
    // flat + default: neutral solid button instead of Material's primary fill.
    // (fab/mini-fab keep Material's default container.)
    '[class.o-action--filled-default]': "isFlat() && resolvedImportance === 'default'"
  }
})
export class OButtonComponent implements OnInit {

  protected static DEFAULT_TYPE = 'STROKED';

  protected static VARIANT_TO_TYPE: Record<OActionVariant, string> = {
    outline: 'STROKED',
    flat: 'FLAT',
    basic: 'BASIC',
    raised: 'RAISED',
    icon: 'ICON',
    fab: 'FAB',
    'mini-fab': 'FAB-MINI'
  };

  protected oattr: string;
  public olabel: string;
  /** @deprecated use `variant` instead. */
  protected otype: string;
  public icon: string;
  public svgIcon: string;
  public iconPosition: string = Codes.ICON_POSITION_LEFT; // left (default)
  public image: string;
  @BooleanInputConverter() enabled: boolean = true;
  /** @deprecated use `importance` instead. */
  public color: ThemePalette;
  public variant: OActionVariant;
  public importance: OActionImportance;
  public visible: boolean = true;

  /* Outputs */
  public onClick: EventEmitter<Event> = new EventEmitter<Event>();
  public click: EventEmitter<Event> = new EventEmitter<Event>();
  protected permissionsService = inject(PermissionsService);
  protected permissions: OPermissions;
  /**
   * Optional host action-style provider (the surrounding `o-table`, `o-grid`,
   * `o-list`, `o-tree` or `o-form`). When present, a button with no explicit
   * `variant`/`type` or `importance`/`color` resolves those from the host's
   * `action-styles` by its `attr`, so a projected custom button defaults to
   * `outline` + `default` and honours the host configuration automatically.
   */
  protected actionStyleProvider = inject(OActionStyleProvider, { optional: true });

  /**
   * App-wide action-style defaults (from `O_ACTION_STYLES_CONFIG`). Used to
   * resolve `variant` / `importance` when this button is NOT projected inside a
   * host provider; when it is, the host already folds this config in.
   */
  protected globalActionStylesConfig = inject(O_ACTION_STYLES_CONFIG, { optional: true });

  constructor(protected actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.permissions = this.permissionsService.getOButtonPermissions(this.oattr, this.actRoute);
    if (Util.isDefined(this.permissions)) {
      this.enabled = this.permissions.enabled;
      this.visible = this.permissions.visible;
    }
  }

  /**
   * Effective legacy button type driving the template branches, resolved as:
   * explicit `variant` > legacy `type` > host `action-styles` variant (by `attr`)
   * > `STROKED` (= outline). Keeps the existing template working unchanged.
   */
  /**
   * Action style resolved from the host provider when this button is projected
   * inside one (the host already folds in `action-styles` and the app-wide
   * config), or directly from `O_ACTION_STYLES_CONFIG` when used standalone.
   * Always fully resolved (defaults to `outline` + `default`).
   */
  protected get hostOrGlobalActionStyle(): OResolvedActionStyle {
    return this.actionStyleProvider
      ? this.actionStyleProvider.getResolvedActionStyle(this.oattr)
      : resolveActionStyle(this.oattr, undefined, undefined, this.globalActionStylesConfig ?? undefined);
  }

  get effectiveType(): string {
    if (Util.isDefined(this.variant)) {
      return OButtonComponent.VARIANT_TO_TYPE[this.variant] ?? OButtonComponent.DEFAULT_TYPE;
    }
    if (Util.isDefined(this.otype)) {
      return this.otype.toUpperCase();
    }
    const variant = this.hostOrGlobalActionStyle.variant;
    return OButtonComponent.VARIANT_TO_TYPE[variant] ?? OButtonComponent.DEFAULT_TYPE;
  }

  /**
   * Resolved importance used to toggle the shared `.o-action--importance-*`
   * class. Precedence: explicit `importance` > legacy `color` (primary/warn) >
   * host `action-styles` importance (by `attr`) > `default`. A legacy `color`
   * with no importance equivalent (e.g. `accent`) returns `undefined` so the
   * button keeps Material's rendering.
   */
  get resolvedImportance(): OActionImportance {
    if (Util.isDefined(this.importance)) {
      return this.importance;
    }
    if (this.color === 'primary' || this.color === 'warn') {
      return this.color;
    }
    if (Util.isDefined(this.color)) {
      return undefined;
    }
    return this.hostOrGlobalActionStyle.importance;
  }

  /**
   * Whether the importance colour applies to the label/icon. Shapes with a light
   * or transparent container (outline, basic, icon and the elevated `raised`)
   * colour the text/icon directly via the shared `.o-action--importance-*` class.
   * The truly filled shapes (flat, fab, mini-fab) instead route the importance to
   * the container colour (see `resolvedColor`), keeping the label on its legible
   * on-container colour.
   */
  get appliesImportanceColor(): boolean {
    const type = this.effectiveType;
    return type === 'STROKED' || type === 'BASIC' || type === 'ICON' || type === 'RAISED';
  }

  /**
   * Material colour palette bound to the button. On the filled shapes (flat, fab,
   * mini-fab) the importance (primary/warn) drives the container colour, so e.g. a
   * `flat` + `warn` button gets the warn background with a legible label. On the
   * text-coloured shapes (and for `default` importance) it falls back to the
   * legacy `color` input.
   */
  get resolvedColor(): ThemePalette {
    if (!this.appliesImportanceColor) {
      const importance = this.resolvedImportance;
      if (importance === 'primary' || importance === 'warn') {
        return importance;
      }
    }
    return this.color;
  }

  onButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.enabled) {
      this.click.emit(event);
      this.onClick.emit(event);
    }
  }

  get needsIconButtonClass(): boolean {
    return (this.icon !== undefined || this.svgIcon !== undefined) && (this.olabel === undefined || this.olabel === '');
  }

  isFab(): boolean {
    return this.effectiveType === 'FAB';
  }

  isRaised(): boolean {
    return this.effectiveType === 'RAISED';
  }

  isFlat(): boolean {
    return this.effectiveType === 'FLAT';
  }

  isStroked(): boolean {
    return this.effectiveType === 'STROKED';
  }

  isBasic(): boolean {
    return this.effectiveType === 'BASIC';
  }

  isMiniFab(): boolean {
    return this.effectiveType === 'FAB-MINI';
  }

  isIconButton(): boolean {
    return this.effectiveType === 'ICON';
  }
  isVisible(): boolean {
    return this.visible;
  }
}
