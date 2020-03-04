import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  ViewEncapsulation,
} from '@angular/core';

import { InputConverter } from '../../../../../decorators/input-converter';

const INPUTS_ARRAY = [
  'oattr: attr',
  'enabled',
  'icon',
  // show-active-icon [string][yes|no|true|false]: show icon when option is active. Default :no.
  'showActiveIcon : show-active-icon',
  'olabel: label',
  'active'
];

const OUTPUTS_ARRAY = [
  'onClick'
];

@Component({
  selector: 'o-table-option',
  templateUrl: './o-table-option.component.html',
  styleUrls: ['./o-table-option.component.scss'],
  inputs: INPUTS_ARRAY,
  outputs: OUTPUTS_ARRAY,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-option]': 'true',
  }
})

export class OTableOptionComponent {

  public static INPUTS_ARRAY = INPUTS_ARRAY;
  public static OUTPUTS_ARRAY = OUTPUTS_ARRAY;
  public static O_TABLE_OPTION_ACTIVE_CLASS = 'o-table-option-active';

  onClick: EventEmitter<object> = new EventEmitter<object>();

  oattr: string;
  @InputConverter()
  enabled: boolean = true;
  icon: string;
  olabel: string;
  @InputConverter()
  showActiveIcon: boolean = false;
  @InputConverter()
  active: boolean = false;

  cd: ChangeDetectorRef;

  constructor(
    protected injector: Injector,
    public elRef: ElementRef
  ) {
    try {
      this.cd = this.injector.get(ChangeDetectorRef);
    } catch (e) {
    }
  }

  innerOnClick() {
    this.onClick.emit();
    this.setActive(!this.active);
  }

  showActiveOptionIcon() {
    return this.showActiveIcon && this.active;
  }

  setActive(val: boolean) {
    this.active = val;
    this.cd.detectChanges();
  }

}
