import { Component, ElementRef, forwardRef, Inject, Injector, NgModule, Optional, ViewChild, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelect, MatSelectChange } from '@angular/material';

import { InputConverter } from '../../../decorators/input-converter';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { OntimizeService } from '../../../services/ontimize.service';
import { OSharedModule } from '../../../shared/shared.module';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { IFormValueOptions, OFormValue } from '../../form/OFormValue';
import { OValueChangeEvent } from '../../o-form-data-component.class';
import { OFormServiceComponent } from '../o-form-service-component.class';

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
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] },
    { provide: OFormServiceComponent, useExisting: forwardRef(() => OComboComponent) }
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
      // TODO do it better. When changing tabs it is necessary to invoke new query
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
    } else if (Util.isDefined(value) && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else if (!Util.isDefined(value) && this.nullSelection) {
      this.value = new OFormValue(undefined);
    } else {
      this.value = new OFormValue(this.defaultValue);
    }
    // This call make the component querying its data multiple times
    // this.syncDataIndex();
  }

  ngOnDestroy() {
    this.destroy();
  }

  hasNullSelection(): boolean {
    return this.nullSelection;
  }

  syncDataIndex(queryIfNotFound: boolean = true) {
    super.syncDataIndex(queryIfNotFound);
    if (this._currentIndex !== undefined && this.nullSelection) {
      // first position is for null selection that it is not included into dataArray
      this._currentIndex += 1;
    }
  }

  onFormControlChange(value: any) {
    if (this.oldValue === value) {
      return;
    }
    super.onFormControlChange(value);
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
        return undefined;
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
    if (!this.selectModel.panelOpen) {
      return;
    }
    const newValue = event.value;
    this.setValue(newValue, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  getOptionDescriptionValue(item: any = {}) {
    let descTxt = '';
    if (this.descriptionColArray && this.descriptionColArray.length > 0) {
      const self = this;
      this.descriptionColArray.forEach((col, index) => {
        let txt = item[col];
        if (Util.isDefined(txt)) {
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
    if (item && item.hasOwnProperty(this.valueColumn) && this.value) {
      let val = item[this.valueColumn];
      if (val === this.value.value) {
        selected = true;
        this._currentIndex = rowIndex;
      }
    }
    return selected;
  }

  setValue(val: any, options?: IFormValueOptions) {
    if (!this.dataArray) {
      return;
    }
    const isDefinedVal = Util.isDefined(val);
    if (this.multiple && !isDefinedVal) {
      return;
    }

    if (!isDefinedVal && !this.nullSelection) {
      console.warn('`o-combo` with attr ' + this.oattr + ' cannot be set. `null-selection` attribute is false.');
      return;
    }

    if (isDefinedVal) {
      const record = this.dataArray.find(item => item[this.valueColumn] === val);
      if (!Util.isDefined(record)) {
        return;
      }
    } else {
      if (Util.isDefined(val)) {
        super.setValue(val, options);
      }
    }
    super.setValue(val, options);
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
  imports: [CommonModule, OSharedModule],
  exports: [OComboComponent]
})
export class OComboModule { }
