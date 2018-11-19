import { Component, EventEmitter, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggle } from '@angular/material';

import { Util } from '../../utils';

export const DEFAULT_INPUTS_O_BUTTON_TOGGLE = [
  'oattr: attr',
  'label',
  // icon [string]: Name of google icon (see https://design.google.com/icons/)
  'icon',
  'iconPosition: icon-position',
  'checked',
  'enabled',
  'value',
  'name'
];

export const DEFAULT_OUTPUTS_O_BUTTON_TOGGLE = [
  'onChange'
];

@Component({
  moduleId: module.id,
  selector: 'o-button-toggle',
  templateUrl: './o-button-toggle.component.html',
  styleUrls: ['./o-button-toggle.component.scss'],
  inputs: DEFAULT_INPUTS_O_BUTTON_TOGGLE,
  outputs: DEFAULT_OUTPUTS_O_BUTTON_TOGGLE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-button-toggle]': 'true'
  }
})
export class OButtonToggleComponent {

  public DEFAULT_INPUTS_O_BUTTON_TOGGLE = DEFAULT_INPUTS_O_BUTTON_TOGGLE;
  public DEFAULT_OUTPUTS_O_BUTTON_TOGGLE = DEFAULT_OUTPUTS_O_BUTTON_TOGGLE;

  /* Inputs */
  public oattr: string;
  public label: string;
  public icon: string;
  public iconPosition: 'before' | 'after' = 'before';
  get checked(): boolean {
    return this._innerButtonToggle.checked;
  }
  set checked(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._innerButtonToggle.checked = val;
  }
  protected _checked: boolean = false;
  get enabled(): boolean {
    return !this._innerButtonToggle.disabled;
  }
  set enabled(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._innerButtonToggle.disabled = !val;
  }
  protected _enabled: boolean = true;
  get value(): any {
    return this._innerButtonToggle.value;
  }
  set value(val: any) {
    this._innerButtonToggle.value = val;
  }
  public name: string;
  /* End inputs */

  /* Outputs */
  public onChange: EventEmitter<MatButtonToggleChange> = new EventEmitter();
  /* End outputs */

  @ViewChild('bt') public _innerButtonToggle: MatButtonToggle;

  constructor(public viewContainerRef: ViewContainerRef) { }

}
