import {Component, ElementRef, EventEmitter, forwardRef, Inject, Injector,
  OnInit, ViewChild, Optional, ChangeDetectorRef, NgZone,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ValidatorFn } from '@angular/forms/src/directives/validators';

import { MdInputModule, MdInput, MdListModule, MdToolbarModule} from '@angular/material';
import { MdDialog, MdDividerModule } from '../../material/ng2-material/index';

import {
  IFormComponent, IFormControlComponent, IFormDataTypeComponent,
  IFormDataComponent
} from '../../../interfaces';
import {OntimizeService, OTranslateService, dataServiceFactory} from '../../../services';
import {ColumnsFilterPipe} from '../../../pipes';
import {InputConverter} from '../../../decorators';
import {OFormComponent, Mode} from '../../form/o-form.component';
import {OSearchInputModule} from '../../search-input/o-search-input.component';
import {OFormValue} from '../../form/OFormValue';
import {Util, SQLTypes} from '../../../utils';
import {ODialogModule} from '../../dialog/o-dialog.component';

import {OListPickerDialogComponent} from './o-list-picker-dialog.component';
import {OTranslateModule} from '../../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'oattr: attr',
  'olabel: label',
  'data',
  'autoBinding: automatic-binding',
  'oenabled: enabled',
  'orequired: required',

  'entity',
  'service',
  'columns',
  'valueColumn: value-column',
  'parentKeys: parent-keys',

  // Visible columns into selection dialog from parameter 'columns'. With empty parameter all columns are visible.
  'visibleColumns: visible-columns',

  // Visible columns in text field. By default, it is the parameter value of visible columns.
  'descriptionColumns: description-columns',

  'filter',
  'separator',

  'queryOnInit: query-on-init',
  'queryOnBind: query-on-bind',

   // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_LIST_PICKER = [
  'onChange'
];

@Component({
  selector: 'o-list-picker',
  templateUrl: '/input/listpicker/o-list-picker.component.html',
  styleUrls: ['/input/listpicker/o-list-picker.component.css'],
  providers: [
    {provide:OntimizeService,  useFactory:  dataServiceFactory, deps:[Injector]}
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_PICKER
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST_PICKER
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListPickerComponent implements IFormComponent, IFormControlComponent, IFormDataTypeComponent, IFormDataComponent, OnInit {

  public static DEFAULT_INPUTS_O_LIST_PICKER = DEFAULT_INPUTS_O_LIST_PICKER;
  public static DEFAULT_OUTPUTS_O_LIST_PICKER = DEFAULT_OUTPUTS_O_LIST_PICKER;

  /* Inputs */
  oattr: string;
  olabel: string;
  // data: any;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  orequired: boolean = false;
  @InputConverter()
  autoBinding: boolean = true;

  entity: string;
  service: string;
  columns: string;
  valueColumn: string;
  parentKeys: string;
  visibleColumns: string;
  descriptionColumns: string;

  @InputConverter()
  filter: boolean = true;
  separator: string;

  @InputConverter()
  queryOnInit :boolean = true;
  @InputConverter()
  queryOnBind: boolean = false;
  protected sqlType: string;
  /* End inputs */


  dataArray: any[] = [];
  colArray: string[] = [];
  visibleColArray: string[] = [];
  descriptionColArray: string[] = [];

  @ViewChild('dialog')
  protected dialog: MdDialog;

  @ViewChild('inputModel')
  protected inputModel: MdInput;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();

  protected value: OFormValue;
  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.OTHER;

  protected dataService: OntimizeService;
  protected cacheQueried: boolean = false;

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

  ngOnInit(): any {
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

    this.configureService();

  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if ( value && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(undefined);
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

  onFormDataBind(bindedData:Object) {
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

  queryData(filter?: Object): void {
    let kv = {};
    let self = this;
    if (filter) {
      kv = filter;
    }
    this.dataService.query(kv, this.colArray, this.entity)
      .subscribe(
        (res: any) => {
          if (res.code === 0) {
            self.cacheQueried = true;
            self.setDataArray(res.data);
          } else {
            console.log('error');
          }
        },
        (error: string) => {
          console.log(error);
        }
      );
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
        value: this.value ? this.value.value : undefined,
        disabled: this._disabled
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
        // this.cDetect.detectChanges();
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

  isAutomaticBinding(): Boolean {
    return this.autoBinding;
  }

  isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

  getValue() : any {
    if (this.value instanceof OFormValue) {
     if (this.value.value) {
        return this.value.value;
      }
    }
    return undefined;
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

  setValue(val: any): void {
    var self = this;
    window.setTimeout(() => {
      self.inputModel.value = val;
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
    // var self = this;
    // window.setTimeout(() => {
      this._disabled = value;
      // //TODO Provisional mientras en la version angular2-material no incluyan el método
      // // 'setDisabledState()' en la implementación de ControlValueAccessor
      // let input = self.elRef.nativeElement.getElementsByClassName('md-input-element');
      // if (self._disabled) {
      //   self.elRef.nativeElement.classList.add('md-disabled');
      //   if(input && input[1]) {
      //     input[1].setAttribute('disabled', self._disabled);
      //   }
      // } else {
      //   self.elRef.nativeElement.classList.remove('md-disabled');
      //   if(input && input[1]) {
      //     input[1].removeAttribute('disabled');
      //   }
      // }
    // }, 0);
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

  innerOnChange(e: any) {
    this.onChange.emit(e);
  }

  get isValid() {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }

  onClickClear(e: Event): void {
    e.stopPropagation();
    if (!this._isReadOnly) {
      this.setValue('');
    }
  }

  onClickListpicker(e: Event): void {
    if (!this._isReadOnly) {
      this.dialog.show();
    }
  }

  onDialogShow(evt: any) {
    if (evt.overlayRef._pane && evt.overlayRef._pane.children
      && evt.overlayRef._pane.children.length >= 0) {
      let el = evt.overlayRef._pane.children[0];
      if (el) {
        el.classList.add('md-dialog-custom');
      }
    }
  }

  onDialogClose(evt: Event) {
    if (!evt) {
      return;
    } else if (evt instanceof Object) {
      if (evt[this.valueColumn]) {
        this.setValue(evt[this.valueColumn]);
      }
    }
  }

  onFocus(evt: any) {
    //nothing to do...
  }

  onBlur(evt: any) {
     //nothing to do...
  }

}

@NgModule({
  declarations: [ColumnsFilterPipe, OListPickerDialogComponent, OListPickerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdInputModule, MdListModule, ODialogModule, MdDividerModule, MdToolbarModule, OSearchInputModule, OTranslateModule],
  exports: [OListPickerComponent],
})
export class OListPickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListPickerModule,
      providers: []
    };
  }
}
