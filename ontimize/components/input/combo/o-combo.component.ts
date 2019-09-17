import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, NgModule, OnDestroy, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material';
import { Subscription } from 'rxjs';
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
import { OComboSearchComponent } from './combo-search/o-combo-search.component';


export const DEFAULT_INPUTS_O_COMBO = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'translate',
  'multiple',
  'nullSelection: null-selection',
  'multipleTriggerLabel: multiple-trigger-label',
  'searchable'
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

  public value: OFormValue;
  public searchControl: FormControl = new FormControl();

  /* Inputs */
  @InputConverter()
  public multiple: boolean;
  @InputConverter()
  public multipleTriggerLabel: boolean = false;
  @InputConverter()
  public searchable: boolean = false;
  @InputConverter()
  protected translate: boolean = false;
  @InputConverter()
  protected nullSelection: boolean = true;
  /* End inputs*/

  @ViewChild('inputModel')
  protected inputModel: ElementRef;

  @ViewChild('selectModel')
  protected selectModel: MatSelect;

  protected filteredDataArray: any[] = [];
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
    return this.filteredDataArray;
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

  public clearValue(): void {
    if (this.multiple) {
      this.setValue(this.defaultValue);
    } else {
      super.clearValue();
    }
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

  public getOptionDescriptionValue(item: any = {}): string {
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

  public setValue(val: any, options?: IFormValueOptions): void {
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
        this._fControl.disable();
      } else if (this._fControl) {
        this._fControl.enable();
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
        const parsed = parseInt(item);
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
      this.filteredDataArray = this.dataArray.filter(item => this.getOptionDescriptionValue(item).toLowerCase().indexOf(search) > -1);
    }
  }

}

@NgModule({
  declarations: [OComboComponent, OComboSearchComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OComboComponent, OComboSearchComponent]
})
export class OComboModule { }
