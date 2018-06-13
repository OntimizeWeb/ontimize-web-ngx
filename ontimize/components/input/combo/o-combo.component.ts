import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Injector, NgModule, OnInit, Optional, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material';
import { InputConverter } from '../../../decorators/input-converter';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { OntimizeService } from '../../../services/ontimize.service';
import { OSharedModule } from '../../../shared/shared.module';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { IFormValueOptions, OFormValue } from '../../form/OFormValue';
import { OFormComponent } from '../../form/o-form.component';
import { OFormServiceComponent } from '../o-form-service-component.class';

export const DEFAULT_INPUTS_O_COMBO = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'translate',
  'multiple',
  'nullSelection: null-selection',
  'multipleTriggerLabel: multiple-trigger-label'
];

export const DEFAULT_OUTPUTS_O_COMBO = [
  'onChange'
];

@Component({
  selector: 'o-combo',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_COMBO,
  outputs: DEFAULT_OUTPUTS_O_COMBO,
  templateUrl: './o-combo.component.html',
  styleUrls: ['./o-combo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OComboComponent extends OFormServiceComponent implements OnInit {

  public static DEFAULT_INPUTS_O_COMBO = DEFAULT_INPUTS_O_COMBO;
  public static DEFAULT_OUTPUTS_O_COMBO = DEFAULT_OUTPUTS_O_COMBO;

  /* Inputs */
  @InputConverter()
  protected translate: boolean = false;
  @InputConverter()
  protected nullSelection: boolean = true;
  @InputConverter()
  protected multiple: boolean;
  @InputConverter()
  protected multipleTriggerLabel: boolean = false;
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
    injector: Injector) {
    super(form, elRef, injector);
    this.defaultValue = '';
  }

  ngOnInit() {
    super.initialize();
    this.initialize();
  }

  ngAfterViewInit(): void {
    if (this.queryOnInit) {
      this.queryData();
    } else if (this.queryOnBind) {
      //TODO do it better. When changing tabs it is necessary to invoke new query
      this.syncDataIndex();
    }
  }

  initialize() {
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
  }

  getDescriptionValue() {
    let descTxt = '';
    if (this._currentIndex !== undefined && this.selectModel) {
      if (this.selectModel.selected) {
        if (this.selectModel.selected instanceof Array) {
          if (this.multipleTriggerLabel && this.selectModel.selected.length > 1) {
            descTxt = this.getFirstSelectedValue();
            descTxt += this.translateService.get('INPUT.COMBO.MESSAGE_TRIGGER', [this.selectModel.selected.length - 1]);
          } else {
            this.selectModel.selected.forEach(function (item) {
              if (descTxt !== '') {
                descTxt += this.separator;
              }
              descTxt += item.viewValue;
            });
          }
        } else {
          descTxt = (this.selectModel.selected as any).viewValue;
        }
      } else if (this.selectModel.options) {
        let option: MatOption = this.selectModel.options.toArray()[this._currentIndex];
        if (option) {
          option.select();
          descTxt = option.viewValue;
        }
      }

    }
    /*
    * Temporary code
    * I do not understand the reason why MatInput is not removing 'mat-empty' clase despite of the fact that
    * the input element of the description is binding value attribute
    */
    let placeHolderLbl = this.elRef.nativeElement.querySelectorAll('label.mat-input-placeholder');
    if (placeHolderLbl.length) {
      // Take only first, nested element does not matter.
      let element = placeHolderLbl[0];
      if (descTxt && descTxt.length > 0) {
        element.classList.remove('mat-empty');
      }
    }
    return descTxt;
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
    this.innerOnChange(event.value);
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
      if (!Util.isDefined(val) && this.nullSelection) {
        super.setValue(val, options);
      } else if (this.multiple && val) {
        super.setValue(val, options);
      } else {
        const record = this.dataArray.find(item => item[this.valueColumn] === val);
        if (record) {
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
}

@NgModule({
  declarations: [OComboComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OComboComponent]
})
export class OComboModule {
}
