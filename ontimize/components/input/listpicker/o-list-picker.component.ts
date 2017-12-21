import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnInit,
  OnChanges,
  SimpleChange,
  ViewChild,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MdInput,
  MdDialog,
  MdDialogRef,
  MdDialogConfig
} from '@angular/material';

import { dataServiceFactory } from '../../../services/data-service.provider';
import { OntimizeService } from '../../../services';

import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OSearchInputModule } from '../../search-input/o-search-input.component';
import { OFormValue } from '../../form/OFormValue';

import { OSharedModule } from '../../../shared';
import { ODialogModule } from '../../dialog/o-dialog.component';

import { OListPickerDialogComponent } from './o-list-picker-dialog.component';

import { OFormServiceComponent } from '../../o-form-service-component.class';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'filter',
  'dialogWidth : dialog-width',
  'dialogHeight : dialog-height'
];

export const DEFAULT_OUTPUTS_O_LIST_PICKER = [
  'onChange',
  'onFocus',
  'onBlur'
];

@Component({
  selector: 'o-list-picker',
  templateUrl: './o-list-picker.component.html',
  styleUrls: ['./o-list-picker.component.scss'],
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
export class OListPickerComponent extends OFormServiceComponent implements OnInit, OnChanges {

  public static DEFAULT_INPUTS_O_LIST_PICKER = DEFAULT_INPUTS_O_LIST_PICKER;
  public static DEFAULT_OUTPUTS_O_LIST_PICKER = DEFAULT_OUTPUTS_O_LIST_PICKER;

  /* Inputs */
  @InputConverter()
  protected filter: boolean = true;
  protected dialogWidth: string;
  protected dialogHeight: string;
  /* End inputs */

  protected ng2Dialog: MdDialog;
  protected dialogRef: MdDialogRef<OListPickerDialogComponent>;

  @ViewChild('inputModel')
  protected inputModel: MdInput;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this.ng2Dialog = this.injector.get(MdDialog);
  }

  ngOnInit(): any {
    this.initialize();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (typeof (changes['staticData']) !== 'undefined') {
      this.cacheQueried = true;
      this.setDataArray(changes['staticData'].currentValue);
    }
  }

  ensureOFormValue(value: any) {
    if (value instanceof OFormValue) {
      this.value = new OFormValue(value.value);
    } else if ((value !== undefined || value !== null) && !(value instanceof OFormValue)) {
      this.value = new OFormValue(value);
    } else {
      this.value = new OFormValue(this.defaultValue);
    }
    this.syncDataIndex();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  onClickClear(e: Event): void {
    e.stopPropagation();
    if (!this._isReadOnly && !this.isDisabled) {
      this.setValue(undefined);
    }
  }

  onClickListpicker(e: Event): void {
    if (!this._isReadOnly && !this.isDisabled) {
      this.openDialog();
    }
  }

  protected openDialog() {
    let cfg: MdDialogConfig = {
      role: 'dialog',
      disableClose: false,
      panelClass: 'cdk-overlay-pane-custom',
      data: {
        data: this.dataArray,
        filter: this.filter,
        visibleColumns: this.visibleColArray
      }
    };
    if (this.dialogWidth !== undefined) {
      cfg.width = this.dialogWidth;
    }
    if (this.dialogHeight !== undefined) {
      cfg.height = this.dialogHeight;
    }
    this.dialogRef = this.ng2Dialog.open(OListPickerDialogComponent, cfg);
    this.dialogRef.afterClosed().subscribe(result => {
      this.onDialogClose(result);
    });
  }

  onDialogClose(evt: any) {
    this.dialogRef = null;
    if (evt instanceof Object && typeof evt[this.valueColumn] !== 'undefined') {
      var self = this;
      window.setTimeout(() => {
        self.setValue(evt[self.valueColumn]);
        if (self._fControl) {
          this._fControl.markAsTouched();
        }
      }, 0);
    }
  }

  innerOnFocus(evt: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  innerOnBlur(evt: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this._fControl.markAsTouched();
      this.onBlur.emit(event);
    }
  }

}

@NgModule({
  declarations: [
    OListPickerDialogComponent,
    OListPickerComponent
  ],
  imports: [
    OSharedModule,
    CommonModule,
    ODialogModule,
    OSearchInputModule
  ],
  exports: [
    OListPickerComponent
  ],
  entryComponents: [
    OListPickerDialogComponent
  ]
})
export class OListPickerModule {
}
