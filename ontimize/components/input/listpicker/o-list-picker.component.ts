import {
  Component, ElementRef, EventEmitter, forwardRef, Inject, Injector,
  OnInit, ViewChild, Optional,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdInputModule, MdInput, MdListModule, MdToolbarModule } from '@angular/material';
import { MdDialog, MdDividerModule } from '../../material/ng2-material/index';

import { OntimizeService, dataServiceFactory } from '../../../services';
import { ColumnsFilterPipe } from '../../../pipes';
import { OSharedModule } from '../../../shared.module';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OSearchInputModule } from '../../search-input/o-search-input.component';
import { OFormValue } from '../../form/OFormValue';
import { Util } from '../../../utils';
import { ODialogModule } from '../../dialog/o-dialog.component';

import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
import { OTranslateModule } from '../../../pipes/o-translate.pipe';

import { OFormDataComponent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
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
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_PICKER
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST_PICKER
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListPickerComponent extends OFormDataComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LIST_PICKER = DEFAULT_INPUTS_O_LIST_PICKER;
  public static DEFAULT_OUTPUTS_O_LIST_PICKER = DEFAULT_OUTPUTS_O_LIST_PICKER;

  /* Inputs */
  protected staticData: Array<any>;

  protected entity: string;
  protected service: string;
  protected columns: string;
  protected valueColumn: string;
  protected parentKeys: string;
  protected visibleColumns: string;
  protected descriptionColumns: string;

  @InputConverter()
  protected filter: boolean = true;
  protected separator: string;

  @InputConverter()
  protected queryOnInit: boolean = true;
  @InputConverter()
  protected queryOnBind: boolean = false;
  /* End inputs */

  protected dataArray: any[] = [];
  protected colArray: string[] = [];
  protected visibleColArray: string[] = [];
  protected descriptionColArray: string[] = [];

  @ViewChild('dialog')
  protected dialog: MdDialog;

  @ViewChild('inputModel')
  protected inputModel: MdInput;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  protected dataService: OntimizeService;
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

  ngOnInit(): any {
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

  queryData(filter?: Object): void {
    let kv = {};
    let self = this;
    if (filter) {
      kv = filter;
    }
    if (this.dataService === undefined) {
      console.warn('No service configured! aborting query');
      return;
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

  setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataArray = data;
      this.syncDataIndex();
    } else if (Util.isObject(data)) {
      this.dataArray = [data];
    } else {
      console.warn('ListPicker has received not supported service data. Supported data are Array or Object');
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
    }
  }

  getDescriptionValue() {
    let descTxt = '';
    if (this.descriptionColArray && this._currentIndex !== undefined) {
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

  innerOnChange(e: any) {
    this.ensureOFormValue(e);
    if (this._fControl && this._fControl.touched) {
      this._fControl.markAsDirty();
    }
    this.onChange.emit(e);
  }

  onClickClear(e: Event): void {
    e.stopPropagation();
    if (!this._isReadOnly) {
      this.setValue('');
    }
    if (this._fControl) {
      this._fControl.markAsTouched();
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
        if (this._fControl) {
          this._fControl.markAsTouched();
        }
      }
    }
  }

  onFocus(evt: any) {
    //nothing to do...
  }

  onBlur(evt: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this._fControl.markAsTouched();
    }
  }

}

@NgModule({
  declarations: [ColumnsFilterPipe, OListPickerDialogComponent, OListPickerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    MdInputModule, MdListModule, ODialogModule,
    MdDividerModule, MdToolbarModule,
    OSharedModule, OSearchInputModule, OTranslateModule],
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
