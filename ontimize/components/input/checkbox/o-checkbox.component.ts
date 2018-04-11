import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  EventEmitter,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../../shared';

import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_CHECKBOX = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_CHECKBOX = [
  'onChange'
];

@Component({
  selector: 'o-checkbox',
  inputs: DEFAULT_INPUTS_O_CHECKBOX,
  outputs: DEFAULT_OUTPUTS_O_CHECKBOX,
  templateUrl: './o-checkbox.component.html',
  styleUrls: ['./o-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OCheckboxComponent extends OFormDataComponent {

  public static DEFAULT_INPUTS_O_CHECKBOX = DEFAULT_INPUTS_O_CHECKBOX;
  public static DEFAULT_OUTPUTS_O_CHECKBOX = DEFAULT_OUTPUTS_O_CHECKBOX;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'BOOLEAN';
    this.defaultValue = false;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      if (value.value === undefined) {
        value.value = false;
      }
      this.value = new OFormValue(value.value);
    } else if (typeof value === 'boolean') {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(false);
    }
  }

  getValue(): any {
    if (this.value instanceof OFormValue) {
      if (typeof this.value.value === 'boolean') {
        return this.value.value;
      }
    }
    return false;
  }

  isChecked(): boolean {
    if (this.value instanceof OFormValue
      && typeof this.value.value === 'boolean') {
      return this.value.value;
    }
    return false;
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue(false);
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  onClickBlocker(evt: Event) {
    evt.stopPropagation();
  }

}

@NgModule({
  declarations: [OCheckboxComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OCheckboxComponent]
})
export class OCheckboxModule {
}
