import {
  Component, ElementRef, EventEmitter,
  forwardRef, Inject, Injector,
  OnInit, ViewChild, Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelect, MatOption } from '@angular/material';

import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService } from '../../services';
import { OSharedModule } from '../../shared';

import { InputConverter } from '../../decorators';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';
import { OFormServiceComponent } from '../o-form-service-component.class';

export const DEFAULT_INPUTS_O_COMBO = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'translate',
  'nullSelection: null-selection'
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
  /* End inputs*/

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
    this.initialize();
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

  ngAfterViewInit(): void {
    if (this.queryOnInit) {
      this.queryData();
    } else if (this.queryOnBind) {
      //TODO do it better. When changing tabs it is necessary to invoke new query
      this.syncDataIndex();
    }
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
        descTxt = (this.selectModel.selected as any).viewValue;
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
    if (((event === undefined || event === null) || (typeof event === 'string' && event.length === 0)) && this.nullSelection) {
      this.setValueOnChange(undefined);
    } else if (this.dataArray) {
      const record = this.dataArray.find(item => item[this.valueColumn] === event);
      if (record) {
        this.setValueOnChange(record[this.valueColumn]);
      }
    }
  }

  setValueOnChange(value: any) {
    this.ensureOFormValue(value);
    if (this._fControl && this._fControl.touched) {
      this._fControl.markAsDirty();
    }
    this.onChange.emit(value);
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
  imports: [OSharedModule, CommonModule],
  exports: [OComboComponent]
})
export class OComboModule {
}
