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
import { Util } from '../../utils';
import { OTranslateModule } from '../../pipes/o-translate.pipe';

import { OFormDataComponent } from '../o-form-data-component.class';


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
  'sqlType: sql-type'
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
  templateUrl: '/combo/o-combo.component.html',
  styleUrls: ['/combo/o-combo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OComboComponent extends OFormDataComponent implements OnInit {

  public static DEFAULT_INPUTS_O_COMBO = DEFAULT_INPUTS_O_COMBO;
  public static DEFAULT_OUTPUTS_O_COMBO = DEFAULT_OUTPUTS_O_COMBO;

  /* Inputs */
  protected staticData: Array<any>;

  protected entity: string;
  protected service: string;
  protected columns: string;
  protected valueColumn: string;
  protected parentKeys: string;
  protected visibleColumns: string;
  protected descriptionColumns: string;

  protected separator: string;
  @InputConverter()
  protected translate: boolean = false;
  @InputConverter()
  protected nullSelection: boolean = true;

  @InputConverter()
  protected queryOnInit: boolean = true;
  @InputConverter()
  protected queryOnBind: boolean = false;
  /* End inputs*/

  @ViewChild('inputModel')
  protected inputModel: ElementRef;

  @ViewChild('selectModel')
  protected selectModel: MdSelect;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  protected dataArray: any[] = [];
  protected colArray: string[] = [];
  protected visibleColArray: string[] = [];
  protected descriptionColArray: string[] = [];
  protected oColumns: Object = {};
  protected dataService: any;
  protected cacheQueried: boolean = false;
  protected _pKeysEquiv = {};
  protected _formDataSubcribe;
  protected _currentIndex;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    this.cacheQueried = false;
    this.initialize();

    this.colArray = Util.parseArray(this.columns);

    this.visibleColArray = Util.parseArray(this.visibleColumns);
    if (Util.isArrayEmpty(this.visibleColArray)) {
      //It is necessary to assing value to visibleColumns to propagate the parameter to dialog component.
      this.visibleColumns = this.columns;
      this.visibleColArray = this.colArray;
    }

    this.descriptionColArray = Util.parseArray(this.descriptionColumns);
    if (Util.isArrayEmpty(this.descriptionColArray)) {
      this.descriptionColArray = this.visibleColArray;
    }

    let pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);

    if (this.form) {
      var self = this;
      if (self.queryOnBind) {
        this._formDataSubcribe = this.form.onFormDataLoaded.subscribe(data => {
          self.onFormDataBind(data);
        });
      }
    }

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
    }

  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else if ((value === undefined || value === null) && this.nullSelection) {
      this.value = new OFormValue(undefined);
    } else {
      this.value = new OFormValue('');
    }
    this.syncDataIndex();
  }

  configureService() {
    this.dataService = this.injector.get(OntimizeService);

    if (Util.isDataService(this.dataService)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }
  }

  ngOnDestroy() {
    this.destroy();

    if (this._formDataSubcribe) {
      this._formDataSubcribe.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.queryOnInit) {
      this.queryData();
    } else if (this.queryOnBind) {
      //TODO do it better. When changing tabs it is necessary to invoke new query
      this.syncDataIndex();
    }
  }

  onFormDataBind(bindedData: Object) {
    let filter = {};
    let keys = Object.keys(this._pKeysEquiv);
    if (keys && keys.length > 0 && bindedData) {
      keys.forEach(item => {
        let value = bindedData[item];
        if (value) {
          filter[this._pKeysEquiv[item]] = value;
        }
      });
    }
    this.queryData(filter);
  }

  queryData(filter: Object = {}) {
    var that = this;
    if (this.dataService === undefined) {
      console.warn('No service configured! aborting query');
      return;
    }
    this.dataService.query(filter, this.colArray, this.entity)
      .subscribe(resp => {
        if (resp.code === 0) {
          that.cacheQueried = true;
          that.setDataArray(resp.data);
        } else {
          console.log('error');
        }
      }, err => {
        console.log(err);
      });
  }

  setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataArray = data;
      this.syncDataIndex();
    } else if (Util.isObject(data)) {
      this.dataArray = [data];
    } else {
      console.warn('Combo has received not supported service data. Supported data are Array or Object');
      this.dataArray = [];
    }
  }

  syncDataIndex() {
    this._currentIndex = undefined;
    if (this.value && this.value.value && this.dataArray) {
      let self = this;
      this.dataArray.forEach((item, index) => {
        if (item[self.valueColumn] === this.value.value) {
          if (self.nullSelection) {
            // first position is for null selection that it is not included into dataArray
            self._currentIndex = index + 1;
          } else {
            self._currentIndex = index;
          }
        }
      });

      if (this._currentIndex === undefined) {
        if (this.queryOnBind && this.dataArray && this.dataArray.length === 0
          && !this.cacheQueried && !this.isEmpty()) {
          this.queryData();
        }
        return;
      }
    }
  }

  getDescriptionValue() {
    let descTxt = '';
    if (this._currentIndex !== undefined && this.selectModel) {
      if (this.selectModel.selected) {
        descTxt = this.selectModel.selected.viewValue;
      } else if(this.selectModel.options) {
        let option: MdOption = this.selectModel.options.toArray()[this._currentIndex];
        if (option) {
          option.select();
          descTxt = option.viewValue;
        }
      }

    }
    /*
    * Temporary code
    * I do not understand the reason why MdInput is not removing 'md-empty' clase despite of the fact that
    * the input element of the description is binding value attribute
    */
    let placeHolderLbl = this.elRef.nativeElement.querySelectorAll('label.md-input-placeholder');
    if (placeHolderLbl.length) {
      // Take only first, nested element does not matter.
      let element = placeHolderLbl[0];
      if (descTxt && descTxt.length > 0) {
        element.classList.remove('md-empty');
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OSharedModule, MdInputModule, MdSelectModule, OTranslateModule],
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
