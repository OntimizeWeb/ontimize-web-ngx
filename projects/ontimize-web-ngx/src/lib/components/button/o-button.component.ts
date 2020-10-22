import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { InputConverter } from '../../decorators/input-converter';


export const DEFAULT_INPUTS_O_BUTTON = [
  'oattr: attr',
  'olabel: label',
  // type [BASIC|RAISED|STROKED|FLAT|ICON|FAB|MINI-FAB]: The type of button. Default: STROKED.
  'otype: type',
  // icon [string]: Name of google icon (see https://design.google.com/icons/)
  'icon',
  'svgIcon : svg-icon',
  'iconPosition: icon-position',
  'image',
  // enabled [yes|no|true|false]: Whether the button is enabled. Default: yes
  'enabled',
  // color: Theme color palette for the component.
  'color'
];

@Component({
  selector: 'o-button',
  inputs: DEFAULT_INPUTS_O_BUTTON,
  templateUrl: './o-button.component.html',
  styleUrls: ['./o-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-button]': 'true'
  }
})
export class OButtonComponent implements OnInit {

  protected static DEFAULT_TYPE = 'STROKED';

  protected oattr: string;
  public olabel: string;
  protected otype: string;
  public icon: string;
  public svgIcon: string;
  public iconPosition: string; // left (default), top, TODO: right, bottom?
  public image: string;
  @InputConverter() enabled: boolean = true;
  public color: ThemePalette;

  constructor() {
    this.otype = OButtonComponent.DEFAULT_TYPE;
  }

  ngOnInit(): void {
    if (this.otype) {
      this.otype = this.otype.toUpperCase();
    }
  }

  get needsIconButtonClass(): boolean {
    return this.icon !== undefined && (this.olabel === undefined || this.olabel === '');
  }

  isFab(): boolean {
    return this.otype === 'FAB';
  }

  isRaised(): boolean {
    return this.otype === 'RAISED';
  }

  isFlat(): boolean {
    return this.otype === 'FLAT';
  }

  isStroked(): boolean {
    return (this.otype === 'STROKED' || !this.otype);
  }

  isBasic(): boolean {
    return this.otype === 'BASIC';
  }

  isMiniFab(): boolean {
    return this.otype === 'FAB-MINI';
  }

  isIconButton(): boolean {
    return this.otype === 'ICON';
  }
}
