import {
  Component, ElementRef, EventEmitter,
  forwardRef, Inject, Injector,
  OnInit, ViewChild, Optional,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdInputModule, MdSelectModule, MdSelect, MdOption } from '@angular/material';

import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService } from '../../services';
import { OSharedModule } from '../../shared.module';
import { InputConverter } from '../../decorators';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';
import { OTranslateModule } from '../../pipes/o-translate.pipe';

import { OFormServiceComponent } from '../o-form-service-component.class';


export const DEFAULT_INPUTS_O_COMBO = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  //data [any] : sets selected value of the combo
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',
  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data',

  'entity',
  'service',
  'columns',
  'valueColumn: value-column',
  'parentKeys: parent-keys',

  // Visible columns into selection dialog from parameter 'columns'. With empty parameter all columns are visible.
  'visibleColumns: visible-columns',

  // Visible columns in text field. By default, it is the parameter value of visible columns.
  'descriptionColumns: description-columns',

  'separator',
  'translate',
  'nullSelection: null-selection',

  'queryOnInit: query-on-init',
  'queryOnBind: query-on-bind',

  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type',

  'serviceType : service-type'
];

export const DEFAULT_OUTPUTS_O_COMBO = [
  'onChange'
];

@Component({
  selector: 'o-combo',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_COMBO
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_COMBO
  ],
  templateUrl: 'o-combo.component.html',
  styleUrls: ['o-combo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OComboComponent extends OFormServiceComponent implements OnInit {

  public static DEFAULT_INPUTS_O_COMBO = DEFAULT_INPUTS_O_COMBO;
  public static DEFAULT_OUTPUTS_O_COMBO = DEFAULT_OUTPUTS_O_COMBO;

  /* Inputs */
  protected separator: string;
  @InputConverter()
  protected translate: boolean = false;
  @InputConverter()
  protected nullSelection: boolean = true;
  /* End inputs*/

  @ViewChild('inputModel')
  protected inputModel: ElementRef;

  @ViewChild('selectModel')
  protected selectModel: MdSelect;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this.defaultValue = '';
  }

  ngOnInit() {
    this.initialize();
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value && !(value instanceof OFormValue)) {
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

  ngAfterViewInit(): void {
    if (this.queryOnInit) {
      this.queryData();
    } else if (this.queryOnBind) {
      //TODO do it better. When changing tabs it is necessary to invoke new query
      this.syncDataIndex();
    }
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
        descTxt = (this.selectModel.selected as any).viewValue;
      } else if (this.selectModel.options) {
        let option: MdOption = this.selectModel.options.toArray()[this._currentIndex];
        if (option) {
          option.select();
          descTxt = option.viewValue;
        }
      }

    }
    /*
    * Temporary code
    * I do not understand the reason why MdInput is not removing 'mat-empty' clase despite of the fact that
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
      } else if (this.value.value === undefined && this.nullSelection) {
        return null;
      }
    }
    if (this.nullSelection) {
      return null;
    }
    return '';
  }

  innerOnChange(event: any) {

    /*
    * It is neccessary to modify this.value to advice ngControl
    */
    if (event && event.length > 0 && this.dataArray && this.dataArray.length > 0) {
      //event is always a string...
      var self = this;
      this.dataArray.forEach((item, index) => {
        if (item.hasOwnProperty(self.valueColumn)) {
          let val = item[self.valueColumn];
          val = val ? val.toString() : '';
          if (val === event) {
            self.setValue(item[self.valueColumn]);
          }
        }
      });

    } else if (event === null && this.nullSelection) {
      this.setValue(undefined);
    } else if (typeof event === 'string' && event.length === 0 && this.nullSelection) {
      this.setValue(undefined);
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

}

@NgModule({
  declarations: [OComboComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OSharedModule, MdInputModule, MdSelectModule ],
  exports: [OComboComponent],
})
export class OComboModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OComboModule,
      providers: []
    };
  }
}
