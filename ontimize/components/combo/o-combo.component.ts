import {Component, ElementRef, EventEmitter,
  forwardRef, Inject, Injector,
  OnInit, ViewChild, Optional,
  NgZone, ChangeDetectorRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

import { MdInputModule } from '@angular2-material/input';
import { MdComboModule } from '../material/combo/combo';

import { IFormComponent, IFormControlComponent, IFormDataTypeComponent} from '../../interfaces';
import {dataServiceFactory} from '../../services/data-service.provider';
import {OTranslateService, OntimizeService} from '../../services';
import {InputConverter} from '../../decorators';
import {OFormComponent, Mode} from '../form/o-form.component';
import {OFormValue} from '../form/OFormValue';
import {Util, SQLTypes} from '../../utils';
import {OTranslateModule} from '../../pipes/o-translate.pipe';


export const DEFAULT_INPUTS_O_COMBO = [
  'oattr: attr',
  'olabel: label',
  //data [any] : sets selected value of the combo
  'data',
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
    { provide: OntimizeService, useFactory: dataServiceFactory, deps:[Injector] }
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
export class OComboComponent implements IFormComponent, IFormControlComponent, IFormDataTypeComponent, OnInit {

  public static DEFAULT_INPUTS_O_COMBO = DEFAULT_INPUTS_O_COMBO;
  public static DEFAULT_OUTPUTS_O_COMBO = DEFAULT_OUTPUTS_O_COMBO;

  /* Inputs */
  protected oattr: string;
  protected olabel: string;
  @InputConverter()
  protected oenabled: boolean = true;
  @InputConverter()
  protected orequired: boolean = false;

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
  protected sqlType: string;
  /* End inputs*/

  @ViewChild('inputModel')
  protected inputModel: ElementRef;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  protected dataArray: any[] = [];
  protected colArray: string[] = [];
  protected visibleColArray: string[] = [];
  protected descriptionColArray: string[] = [];
  protected oColumns: Object = {};

  protected  value: OFormValue;
  protected dataService: any;
  protected cacheQueried: boolean = false;

  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.OTHER;

  protected _disabled: boolean;
  protected _isReadOnly: boolean;
  protected _placeholder: string;
  protected _fControl: FormControl;

  protected _pKeysEquiv = {};

  protected _formDataSubcribe;

  protected _currentIndex;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected cd: ChangeDetectorRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this.cacheQueried = false;
    this.disabled = !this.oenabled;
    this._placeholder = this.olabel ? this.olabel : this.oattr;

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
      this.form.registerFormComponent(this);
      this.form.registerFormControlComponent(this);
      this.form.registerSQLTypeFormComponent(this);

      var self = this;
      if (self.queryOnBind) {
        this._formDataSubcribe = this.form.onFormDataLoaded.subscribe(data => {
          self.onFormDataBind(data);
        });
      }

      this._isReadOnly = this.form.mode === Mode.INITIAL ? true : false;
    } else {
      this._isReadOnly = this._disabled;
    }

    if (this.staticData) {
      this.dataArray = this.staticData;
    } else {
      this.configureService();
    }

  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if ( value && !(value instanceof OFormValue)) {
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
    if (this.form) {
      this.form.unregisterFormComponent(this);
      this.form.unregisterFormControlComponent(this);
      this.form.unregisterSQLTypeFormComponent(this);
    }

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

  getAttribute() {
    if (this.oattr) {
      return this.oattr;
    } else if (this.elRef && this.elRef.nativeElement.attributes['attr']) {
      return this.elRef.nativeElement.attributes['attr'].value;
    }
  }

  getControl(): FormControl {
    if (!this._fControl) {
      let validators: ValidatorFn[] = this.resolveValidators();
      let cfg = {
        value: this.value ? this.value.value : undefined
      };
      this._fControl = new FormControl(cfg, validators);
    }
    return this._fControl;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = [];

    if (this.orequired) {
      validators.push(Validators.required);
    }
    return validators;
  }

  setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataArray = data;
      this.syncDataIndex();
    } else if (Util.isObject(data)) {
      this.dataArray = [data];
    } else {
      console.warn('Form has received not supported service data. Supported data are Array or Object');
      this.dataArray = [];
    }
  }

  syncDataIndex() {
    this._currentIndex = undefined;
    if (this.value && this.value.value && this.dataArray) {
      let self = this;
      this.dataArray.forEach((item, index) => {
        if (item[self.valueColumn] === this.value.value) {
          self._currentIndex = index;
        }
      });

      if (this._currentIndex === undefined) {
        if (this.queryOnBind && this.dataArray && this.dataArray.length === 0
          && !this.cacheQueried && !this.isEmpty()) {
          this.queryData();
        }
        return;
      }

      if (this._currentIndex !== undefined) {
        // Force change detection on hidden md-input...
        this.cd.detectChanges();
      }

    }
  }

  getSQLType(): number {
    let sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : 'OTHER';
    this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
    return this._SQLType;
  }

  set data(value: any) {
    this.ensureOFormValue(value);
  }

  isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

  getDescriptionValue() {
    let descTxt = '';
    if (this.descriptionColArray && this._currentIndex !== undefined ) {
      var self = this;
      this.descriptionColArray.forEach((item, index) => {
        let txt = self.dataArray[self._currentIndex][item];
        if (txt) {
          descTxt += txt;
        }
        if (index < self.descriptionColArray.length - 1) {
          descTxt += self.separator;
        }
      });
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

  setValue(val: any): void {
    var self = this;
    window.setTimeout(() => {
      self.ensureOFormValue(val);
    }, 0);
  }

  get placeHolder(): string {
    if (this.translateService) {
      return this.translateService.get(this._placeholder);
    }
    return this._placeholder;
  }

  set placeHolder(value: string) {
    var self = this;
    window.setTimeout(() => {
      self._placeholder = value;
    }, 0);
  }

  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  set isReadOnly(value: boolean) {
    if (this._disabled) {
      return;
    }
    var self = this;
    window.setTimeout(() => {
      self._isReadOnly = value;
    }, 0);
  }

  get isDisabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    var self = this;
    window.setTimeout(() => {
      self._disabled = value;
      //TODO Provisional mientras en la version angular2-material no incluyan el método
      // 'setDisabledState()' en la implementación de ControlValueAccessor
      let input = self.elRef.nativeElement.getElementsByClassName('md-input-element');
      if (self._disabled) {
        self.elRef.nativeElement.classList.add('md-disabled');
        if(input && input[0]) {
          input[0].setAttribute('disabled', self._disabled);
        }
      } else {
        self.elRef.nativeElement.classList.remove('md-disabled');
        if(input && input[0]) {
          input[0].removeAttribute('disabled');
        }
      }
    }, 0);
  }

  get isRequired(): boolean {
    return this.orequired;
  }

  set required(value: boolean) {
    var self = this;
    window.setTimeout(() => {
      self.orequired = value;
    }, 0);
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

  get isValid() {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }
}

@NgModule({
  declarations: [OComboComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdInputModule, MdComboModule, OTranslateModule],
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
