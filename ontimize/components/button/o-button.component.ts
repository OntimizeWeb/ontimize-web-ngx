import {
  Component,
  OnInit,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
// import { MdIconModule, MdButtonModule } from '@angular/material';

import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_BUTTON = [
  'oattr: attr',
  'olabel: label',

  // type [FLAT|RAISED|ICON|FAB|MINI-FAB]: The type of button. Default: FLAT.
  'otype: type',

  //icon [string]: Name of google icon (see https://design.google.com/icons/)
  'icon',
  'iconPosition : icon-position',
  'image'
];

@Component({
  selector: 'o-button',
  inputs: [
    ...DEFAULT_INPUTS_O_BUTTON
  ],
  template: require('./o-button.component.html'),
  styles: [require('./o-button.component.scss')],
  encapsulation: ViewEncapsulation.None
})

export class OButtonComponent implements OnInit {

  public static DEFAULT_INPUTS_O_BUTTON = DEFAULT_INPUTS_O_BUTTON;

  protected static DEFAULT_TYPE = 'RAISED';

  protected oattr: string;
  protected olabel: string;
  protected otype: string;
  protected icon: string;
  protected iconPosition: string; // left (default), top, TODO: right, bottom?
  protected image: string;

  constructor() {
    this.otype = OButtonComponent.DEFAULT_TYPE;
  }

  ngOnInit(): void {
    if (this.otype) {
      this.otype = this.otype.toUpperCase();
    }
  }

}

@NgModule({
  declarations: [OButtonComponent],
  // imports: [OSharedModule, MdIconModule, MdButtonModule],
  imports: [OSharedModule],
  exports: [OButtonComponent],
})
export class OButtonModule {
}
