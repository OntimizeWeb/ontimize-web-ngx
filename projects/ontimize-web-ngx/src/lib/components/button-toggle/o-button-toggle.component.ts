import { Component, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material/button-toggle';
import { Util } from '../../util/util';

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

  public name: string;
  /* End inputs */

  /* Outputs */
  public onChange: EventEmitter<MatButtonToggleChange> = new EventEmitter();
  /* End outputs */

  @ViewChild('bt', { static: true }) public _innerButtonToggle: MatButtonToggle;

  public _checked: boolean = false;;
  public _enabled: boolean = true;
  public _value: any;


  get checked(): boolean {
    return this._innerButtonToggle.checked;
  }

  set checked(val: boolean) {
    this._checked = Util.parseBoolean(String(val));
  }

  get enabled(): boolean {
    return !this._innerButtonToggle.disabled;
  }

  set enabled(val: boolean) {
    this._enabled = Util.parseBoolean(String(val));
  }

  get value(): any {
    return this._innerButtonToggle.value;
  }

  set value(val: any) {
    this._value = val;
  }
}
