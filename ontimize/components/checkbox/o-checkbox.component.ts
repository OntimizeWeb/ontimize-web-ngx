import {
  Component, Inject, Injector, OnInit,
  forwardRef, ElementRef, EventEmitter,
  Optional,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdInputModule, MdCheckboxModule } from '@angular/material';

import { OSharedModule } from '../../shared.module';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';
import { OTranslateModule } from '../../pipes/o-translate.pipe';
import { OFormDataComponent } from '../o-form-data-component.class';


export const DEFAULT_INPUTS_O_CHECKBOX = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',
  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_CHECKBOX = [
  'onChange'
];

@Component({
  selector: 'o-checkbox',
  inputs: [
    ...DEFAULT_INPUTS_O_CHECKBOX
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_CHECKBOX
  ],
  templateUrl: 'o-checkbox.component.html',
  styleUrls: ['o-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OCheckboxComponent extends OFormDataComponent implements OnInit {

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
    this.initialize();
  }

  ngOnDestroy() {
    this.destroy();
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OSharedModule, MdInputModule, MdCheckboxModule ],
  exports: [OCheckboxComponent],
})
export class OCheckboxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OCheckboxModule,
      providers: []
    };
  }
}
