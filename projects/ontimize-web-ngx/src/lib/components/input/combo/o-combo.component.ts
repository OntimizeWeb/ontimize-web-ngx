import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import {
  OFormServiceComponent
} from '../o-form-service-component.class';
import { OComboCustomRenderer } from './combo-renderer/o-combo-renderer.class';

export const DEFAULT_INPUTS_O_COMBO = [
  'multiple',
  'nullSelection: null-selection',
  'multipleTriggerLabel: multiple-trigger-label',
  'searchable',
  // text to none selection in a combo
  'nullSelectionLabel: null-selection-label'
];

@Component({
  selector: 'o-combo',
  providers: [
    OntimizeServiceProvider,
    { provide: OFormServiceComponent, useExisting: forwardRef(() => OComboComponent) }
  ],
  inputs: DEFAULT_INPUTS_O_COMBO,
  templateUrl: './o-combo.component.html',
  styleUrls: ['./o-combo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-combo]': 'true'
  }
})
export class OComboComponent extends OFormServiceComponent implements OnInit, AfterViewInit, OnDestroy {

  public value: OFormValue;
  public searchControl: UntypedFormControl = new UntypedFormControl();
  public renderer: OComboCustomRenderer;

  /* Inputs */
  @InputConverter()
  public multiple: boolean;
  @InputConverter()
  public multipleTriggerLabel: boolean = false;
  @InputConverter()
  public searchable: boolean = false;
  @InputConverter()
  protected nullSelection: boolean = true;
  public nullSelectionLabel: string;
  /* End inputs*/

  @ViewChild('inputModel')
  protected inputModel: ElementRef;

  @ViewChild('selectModel')
  protected selectModel: MatSelect;

  protected _filteredDataArray: any[] = [];

  set filteredDataArray(data: any) {
    if (Util.isArray(data)) {
      this._filteredDataArray = data;
    } else if (Util.isObject(data) && Object.keys(data).length > 0) {
      this._filteredDataArray = [data];
    } else {
      console.warn('Component has received not supported service data. Supported data are Array or not empty Object');
      this._filteredDataArray = [];
    }
  }

  get filteredDataArray(): any {
    return this._filteredDataArray;
  }

  protected subscription: Subscription = new Subscription();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.defaultValue = '';
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.subscription.add(this.searchControl.valueChanges.subscribe(() => this.searchFilter()));
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.queryOnInit) {
      this.queryData();
    } else if (this.queryOnBind) {
      // TODO do it better. When changing tabs it is necessary to invoke new query
      this.syncDataIndex();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy();
  }

  public initialize(): void {
    super.initialize();
    if (this.multiple) {
      this.nullSelection = false;
      this.defaultValue = [];
    }
  }

  public ensureOFormValue(value: any): void {
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

  public setDataArray(data: any): void {
    super.setDataArray(data);
    this.filteredDataArray = data;
  }

  public getDataArray(): any[] {
    return this.dataArray;
  }

  public getFilteredDataArray(): any[] {
    return this._filteredDataArray;
  }

  public hasNullSelection(): boolean {
    return this.nullSelection;
  }

  public syncDataIndex(queryIfNotFound: boolean = true): void {
    super.syncDataIndex(queryIfNotFound);
    if (this._currentIndex !== undefined && this.nullSelection) {
      // first position is for null selection that it is not included into dataArray
      this._currentIndex += 1;
    }
  }

  public getValue(): any {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return this.value.value;
      } else if (this.value.value === undefined) {
        return this.getEmptyValue();
      }
    }
    return '';
  }

  public getEmptyValue(): any {
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

  public isEmpty(): boolean {
    if (!(this.value instanceof OFormValue)) {
      return true;
    }
    return this.value.value === undefined || (this.multiple && this.value.value.length === 0);
  }

  public clearValue(options?: FormValueOptions, setDirty: boolean = false): void {
    if (this.multiple) {
      this.setValue(this.defaultValue, options, setDirty);
      this.value.value = [];
    } else {
      super.clearValue(options, setDirty);
    }
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && this.enabled && !this.isEmpty();
  }

  public getMultiple(): boolean {
    return this.multiple;
  }

  public onSelectionChange(event: MatSelectChange): void {
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

  public getValueColumn(item: any): any {
    if (item && item.hasOwnProperty(this.valueColumn)) {
      let option = item[this.valueColumn];
      if (option === 'undefined') {
        option = null;
      }
      return option;
    }
    return '';
  }

  public isSelected(item: any, rowIndex: number): boolean {
    let selected = false;
    if (item && item.hasOwnProperty(this.valueColumn) && this.value) {
      const val = item[this.valueColumn];
      if (val === this.value.value) {
        selected = true;
        this._currentIndex = rowIndex;
      }
    }
    return selected;
  }

  public setValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
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

    super.setValue(val, options);
  }

  public getSelectedItems(): any[] {
    return this.getValue();
  }

  public setSelectedItems(values: any[]): void {
    this.setValue(values);
  }

  public getFirstSelectedValue(): void {
    return this.selectModel.selected[0].viewValue;
  }

  protected setIsReadOnly(value: boolean): void {
    super.setIsReadOnly(value);
    const readOnly = Util.isDefined(this.readOnly) ? this.readOnly : value;
    if (this.enabled) {
      if (this._fControl && readOnly) {
        this._fControl.disable({ emitEvent: false });
      } else if (this._fControl) {
        this._fControl.enable({ emitEvent: false });
      }
    }
  }
  protected parseByValueColumnType(val: any): any {
    if (!Util.isDefined(this.multiple)) {
      return val;
    }
    const valueArr: any[] = this.multiple ? val : [val];
    if (this.valueColumnType === Codes.TYPE_INT) {
      valueArr.forEach((item, index) => {
        const parsed = parseInt(item, 10);
        if (!isNaN(parsed)) {
          valueArr[index] = parsed;
        }
      });
    }
    return this.multiple ? valueArr : valueArr[0];
  }

  protected searchFilter(): void {
    if (this.dataArray || this.dataArray.length) {

      // get the search keyword
      let search = this.searchControl.value;
      if (!search) {
        this.filteredDataArray = this.dataArray.slice();
        return;
      } else {
        search = search.toLowerCase();
      }

      // filter
      if (this.renderer) {
        this.filteredDataArray = this.dataArray.filter(item => this.renderer.getComboData(item).toLowerCase().indexOf(search) > -1);
      } else {
        this.filteredDataArray = this.dataArray.filter(item => this.getOptionDescriptionValue(item).toLowerCase().indexOf(search) > -1);
      }
    }
  }

  public registerRenderer(renderer: any) {
    this.renderer = renderer;
    this.renderer.initialize();
  }

}
