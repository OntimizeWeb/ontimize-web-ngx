import { Component, Inject, forwardRef, EventEmitter, Injector, ViewEncapsulation, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { OTableComponent } from '../../../o-table.component';
import { InputConverter } from '../../../../../decorators';

export const DEFAULT_INPUTS_O_TABLE_OPTION = [
  'oattr: attr',
  'enabled',
  'icon',
  // show-active-icon [string][yes|no|true|false]: show icon when option is active. Default :no.
  'showActiveIcon : show-active-icon',
  'olabel: label',
  'active'
];

export const DEFAULT_OUTPUTS_O_TABLE_OPTION = [
  'onClick'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-option',
  templateUrl: './o-table-option.component.html',
  styleUrls: ['./o-table-option.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_OPTION,
  outputs: DEFAULT_OUTPUTS_O_TABLE_OPTION,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-option]': 'true',
  }
})

export class OTableOptionComponent {

  public static DEFAULT_INPUTS_O_TABLE_OPTION = DEFAULT_INPUTS_O_TABLE_OPTION;
  public static DEFAULT_OUTPUTS_O_TABLE_OPTION = DEFAULT_OUTPUTS_O_TABLE_OPTION;
  public static O_TABLE_OPTION_ACTIVE_CLASS = 'o-table-option-active';

  onClick: EventEmitter<Object> = new EventEmitter<Object>();

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
    public elRef: ElementRef,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    try {
      this.cd = this.injector.get(ChangeDetectorRef);
    } catch (e) {
      // no parent form
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
