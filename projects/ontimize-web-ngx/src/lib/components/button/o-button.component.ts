import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { OSharedModule } from '../../shared';


export const DEFAULT_INPUTS_O_BUTTON = [
  'oattr: attr',
  'olabel: label',
  // type [BASIC|RAISED|STROKED|FLAT|ICON|FAB|MINI-FAB]: The type of button. Default: STROKED.
  'otype: type',
  // icon [string]: Name of google icon (see https://design.google.com/icons/)
  'icon',
  'svgIcon : svg-icon',
  'iconPosition: icon-position',
  'image'
];

@Component({
  moduleId: module.id,
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

  public static DEFAULT_INPUTS_O_BUTTON = DEFAULT_INPUTS_O_BUTTON;

  protected static DEFAULT_TYPE = 'STROKED';

  protected oattr: string;
  olabel: string;
  protected otype: string;
  icon: string;
  svgIcon: string;
  iconPosition: string; // left (default), top, TODO: right, bottom?
  image: string;

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

@NgModule({
  declarations: [OButtonComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OButtonComponent]
})
export class OButtonModule { }
