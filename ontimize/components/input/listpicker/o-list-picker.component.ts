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
import { ODialogModule } from '../../dialog/o-dialog.component';

import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
import { OTranslateModule } from '../../../pipes/o-translate.pipe';

import { OFormServiceComponent } from '../../o-form-service-component.class';

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
export class OListPickerComponent extends OFormServiceComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LIST_PICKER = DEFAULT_INPUTS_O_LIST_PICKER;
  public static DEFAULT_OUTPUTS_O_LIST_PICKER = DEFAULT_OUTPUTS_O_LIST_PICKER;

  /* Inputs */
  @InputConverter()
  protected filter: boolean = true;
  protected separator: string;
  /* End inputs */

  @ViewChild('dialog')
  protected dialog: MdDialog;

  @ViewChild('inputModel')
  protected inputModel: MdInput;

  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  ngOnInit(): any {
    this.initialize();
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if (value && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
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
