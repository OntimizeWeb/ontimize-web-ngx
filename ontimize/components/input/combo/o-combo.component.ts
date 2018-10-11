import { Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, Optional, ViewChild, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material';

import { Util } from '../../../util/util';
import { Codes } from '../../../util/codes';
import { OFormComponent } from '../../form/o-form.component';
import { OSharedModule } from '../../../shared/shared.module';
import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeService } from '../../../services/ontimize.service';
import { IFormValueOptions, OFormValue } from '../../form/OFormValue';
import { OFormServiceComponent } from '../o-form-service-component.class';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { OValueChangeEvent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_COMBO = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'translate',
  'multiple',
  'nullSelection: null-selection',
  'multipleTriggerLabel: multiple-trigger-label'
];

export const DEFAULT_OUTPUTS_O_COMBO = [
  ...OFormServiceComponent.DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT
];

@Component({
  moduleId: module.id,
  selector: 'o-combo',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_COMBO,
  outputs: DEFAULT_OUTPUTS_O_COMBO,
  templateUrl: './o-combo.component.html',
  styleUrls: ['./o-combo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-combo]': 'true'
  }
})
export class OComboComponent extends OFormServiceComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_COMBO = DEFAULT_INPUTS_O_COMBO;
  public static DEFAULT_OUTPUTS_O_COMBO = DEFAULT_OUTPUTS_O_COMBO;

  /* Inputs */
  @InputConverter()
  protected translate: boolean = false;
  @InputConverter()
  protected nullSelection: boolean = true;
  @InputConverter()
  multiple: boolean;
  @InputConverter()
  multipleTriggerLabel: boolean = false;
  /* End inputs*/

  value: OFormValue;

  @ViewChild('inputModel')
  protected inputModel: ElementRef;

  @ViewChild('selectModel')
  protected selectModel: MatSelect;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.defaultValue = '';
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.queryOnInit) {
      this.queryData();
    } else if (this.queryOnBind) {
      //TODO do it better. When changing tabs it is necessary to invoke new query
      this.syncDataIndex();
    }
  }

  initialize() {
    super.initialize();
    if (this.multiple) {
      this.nullSelection = false;
      this.defaultValue = [];
    }
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if ((value !== undefined || value !== null) && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else if ((value === undefined || value === null) && this.nullSelection) {
      this.value = new OFormValue(undefined);
    } else {
      this.value = new OFormValue(this.defaultValue);
    }
    this.syncDataIndex();
  }

  ngOnDestroy() {
    this.destroy();
  }

  hasNullSelection(): boolean {
    return this.nullSelection;
  }

  syncDataIndex() {
    super.syncDataIndex();
    if (this._currentIndex !== undefined && this.nullSelection) {
      // first position is for null selection that it is not included into dataArray
      this._currentIndex += 1;
    }
    if (this.selectModel && this.selectModel.options) {
      const self = this;
      let option = this.selectModel.options.find((item: MatOption) => item.value === self.getValue());
      if (option) {
        option.select();
      }
    }
  }

  getValue() {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return this.value.value;
      } else if (this.value.value === undefined) {
        return this.getEmptyValue();
      }
    }
    return '';
  }

  getEmptyValue() {
    if (this.multiple) {
      return [];
    } else {
      if (this.nullSelection) {
        return null;
      } else {
        return '';
      }
    }
  }

  clearValue(): void {
    if (this.multiple) {
      this.setValue(this.defaultValue);
    } else {
      super.clearValue();
    }
  }

  getMultiple(): boolean {
    return this.multiple;
  }

  protected parseByValueColumnType(val: any) {
    if (!Util.isDefined(this.multiple)) {
      return val;
    }
    let valueArr: any[] = this.multiple ? val : [val];
    if (this.valueColumnType === Codes.TYPE_INT) {
      valueArr.forEach((item, index) => {
        const parsed = parseInt(item);
        if (!isNaN(parsed)) {
          valueArr[index] = parsed;
        }
      });
    }
    return this.multiple ? valueArr : valueArr[0];
  }

  onSelectionChange(event: MatSelectChange): void {
    var newValue = event.value;
    this.setValue(newValue, { changeType: OValueChangeEvent.USER_CHANGE, emitModelToViewChange:false });
  }

  innerOnChange(event: any) {
    this.ensureOFormValue(event);
    if (this._fControl && this._fControl.touched) {
      this._fControl.markAsDirty();
    }
    this.onChange.emit(event);
  }

  getOptionDescriptionValue(item: any = {}) {
    let descTxt = '';
    if (this.descriptionColArray && this.descriptionColArray.length > 0) {
      var self = this;
      this.descriptionColArray.forEach((col, index) => {
        let txt = item[col];
        if (txt) {
          if (self.translate && self.translateService) {
            txt = self.translateService.get(txt);
          }
          descTxt += txt;
        }
        if (index < self.descriptionColArray.length - 1) {
          descTxt += self.separator;
        }
      });
    }
    return descTxt;
  }

  getValueColumn(item: any) {
    if (item && item.hasOwnProperty(this.valueColumn)) {
      let option = item[this.valueColumn];
      if (option === 'undefined') {
        option = null;
      }
      return option;
    }
    return '';
  }

  isSelected(item: any, rowIndex: number): boolean {
    let selected = false;
    if (item && item.hasOwnProperty(this.valueColumn)
      && this.value) {
      let val = item[this.valueColumn];
      if (val === this.value.value) {
        selected = true;
        this._currentIndex = rowIndex;
      }
    }
    return selected;
  }

  setValue(val: any, options?: IFormValueOptions): void {
    if (this.dataArray) {
      if (!this.multiple) {
        if (!Util.isDefined(val)) {
          if (this.nullSelection) {
            super.setValue(val, options);
          } else {
            console.warn('`o-combo` with attr ' + this.oattr + ' cannot be cleared. `null-selection` attribute is false.');
          }
        } else {
          const record = this.dataArray.find(item => item[this.valueColumn] === val);
          if (record) {
            super.setValue(val, options);
          }
        }
      } else {
        if (Util.isDefined(val)) {
          super.setValue(val, options);
        }
      }
    }
  }

  getSelectedItems(): any[] {
    return this.getValue();
  }

  setSelectedItems(values: any[]) {
    this.setValue(values);
  }

  getFirstSelectedValue() {
    return this.selectModel.selected[0].viewValue;
  }

  protected setIsReadOnly(value: boolean) {
    super.setIsReadOnly(value);
    let disabled = Util.isDefined(this.readOnly) ? this.readOnly : value;
    if (this._fControl && disabled) {
      this._fControl.disable();
    } else if (this._fControl) {
      this._fControl.enable();
    }
  }
}

@NgModule({
  declarations: [OComboComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OComboComponent]
})
export class OComboModule { }
