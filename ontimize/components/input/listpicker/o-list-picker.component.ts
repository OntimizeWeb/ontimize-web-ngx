import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnChanges, OnInit, Optional, SimpleChange, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatInput } from '@angular/material';
import { InputConverter } from '../../../decorators';
import { OntimizeService } from '../../../services';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { OSharedModule } from '../../../shared';
import { ODialogModule } from '../../dialog/o-dialog.component';
import { IFormValueOptions } from '../../form/form-components';
import { OFormComponent } from '../../form/o-form.component';
import { OSearchInputModule } from '../../input/search-input/o-search-input.component';
import { OValueChangeEvent } from '../../o-form-data-component.class';
import { OFormControl } from '../o-form-control.class';
import { OFormServiceComponent } from '../o-form-service-component.class';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';


export const DEFAULT_INPUTS_O_LIST_PICKER = [
  ...OFormServiceComponent.DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  'filter',
  'dialogWidth : dialog-width',
  'dialogHeight : dialog-height',
  'queryRows: query-rows',
  'textInputEnabled: text-input-enabled',
  'dialogDisableClose: dialog-disable-close',
  'dialogClass: dialog-class'
];

export const DEFAULT_OUTPUTS_O_LIST_PICKER = [
  ...OFormServiceComponent.DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT,
  'onDialogAccept',
  'onDialogCancel'
];

@Component({
  moduleId: module.id,
  selector: 'o-list-picker',
  templateUrl: './o-list-picker.component.html',
  styleUrls: ['./o-list-picker.component.scss'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] },
    { provide: OFormServiceComponent, useExisting: forwardRef(() => OListPickerComponent) }
  ],
  inputs: DEFAULT_INPUTS_O_LIST_PICKER,
  outputs: DEFAULT_OUTPUTS_O_LIST_PICKER
})
export class OListPickerComponent extends OFormServiceComponent implements AfterViewInit, OnChanges, OnInit {

  public static DEFAULT_INPUTS_O_LIST_PICKER = DEFAULT_INPUTS_O_LIST_PICKER;
  public static DEFAULT_OUTPUTS_O_LIST_PICKER = DEFAULT_OUTPUTS_O_LIST_PICKER;

  /* Outputs */
  public onDialogAccept: EventEmitter<any> = new EventEmitter();
  public onDialogCancel: EventEmitter<any> = new EventEmitter();
  /* End outputs */

  public stateCtrl: FormControl;

  /* Inputs */
  @InputConverter()
  public textInputEnabled: boolean = true;
  @InputConverter()
  public dialogDisableClose: boolean = false;
  @InputConverter()
  protected filter: boolean = true;
  protected dialogWidth: string;
  protected dialogHeight: string = '55%';
  protected dialogClass: string;
  @InputConverter()
  protected queryRows: number;

  /*Override clearButton = true */
  // @InputConverter()
  // public clearButton: boolean = true;
  /* End inputs */

  protected matDialog: MatDialog;
  protected dialogRef: MatDialogRef<OListPickerDialogComponent>;

  @ViewChild('inputModel') protected inputModel: MatInput;
  @ViewChild('visibleInput') protected visibleInput: ElementRef;
  protected visibleInputValue: any;

  protected blurTimer;
  protected blurDelay = 200;
  protected blurPrevent = false;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
    this.matDialog = this.injector.get(MatDialog);
    this.stateCtrl = new FormControl();
    /* overwritte clearButton to true */
    this.clearButton = true;
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    super.ngOnChanges(changes);
    if (typeof (changes['staticData']) !== 'undefined') {
      this.cacheQueried = true;
      this.setDataArray(changes['staticData'].currentValue);
    }
  }

  public createFormControl(): OFormControl {
    this._fControl = super.createFormControl();
    this._fControl.fControlChildren = [this.stateCtrl];
    return this._fControl;
  }

  public ensureOFormValue(value: any): void {
    super.ensureOFormValue(value);
    // This call make the component querying its data multiple times, but getting description value is needed
    this.syncDataIndex(false);
  }

  public setEnabled(value: boolean): void {
    super.setEnabled(value);
    value ? this.stateCtrl.enable() : this.stateCtrl.disable();
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

  public getDescriptionValue(): string {
    let descTxt = '';
    if (this.descriptionColArray && this._currentIndex !== undefined) {
      const self = this;
      this.descriptionColArray.forEach((descCol, index) => {
        const txt = self.dataArray[self._currentIndex][descCol];
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

  public onClickClear(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isReadOnly && this.enabled) {
      clearTimeout(this.blurTimer);
      this.blurPrevent = true;
      this.setValue(undefined);
    }
  }

  public onClickInput(e: Event): void {
    if (!this.textInputEnabled) {
      this.onClickListpicker(e);
    }
  }

  public onClickListpicker(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isReadOnly && this.enabled) {
      clearTimeout(this.blurTimer);
      this.openDialog();
    }
  }

  public onDialogClose(evt: any): void {
    this.dialogRef = null;
    this.visibleInputValue = undefined;
    if (evt instanceof Object && typeof evt[this.valueColumn] !== 'undefined') {
      const self = this;
      window.setTimeout(() => {
        self.setValue(evt[self.valueColumn], { changeType: OValueChangeEvent.USER_CHANGE });
        if (self._fControl) {
          self._fControl.markAsTouched();
          self._fControl.markAsDirty();
        }
        self.onDialogAccept.emit();
      }, 0);
    } else {
      this.onDialogCancel.emit();
    }
  }

  public innerOnBlur(evt: any): void {
    if (!this.isReadOnly && this.enabled) {
      const self = this;
      this.blurTimer = setTimeout(() => {
        if (!self.blurPrevent) {
          self._fControl.markAsTouched();
          self.onBlur.emit(evt);
          if (self.visibleInputValue !== undefined && self.visibleInputValue.length > 0) {
            self.openDialog();
          } else if (self.visibleInputValue !== undefined) {
            self.setValue(undefined);
            self.visibleInputValue = undefined;
          } else {
            self._fControl.markAsTouched();
          }
        }
        self.blurPrevent = false;
      }, this.blurDelay);
    }
  }

  public onVisibleInputChange(event: any): void {
    this.visibleInputValue = event.target.value;
  }

  public onKeydownEnter(val: any): void {
    clearTimeout(this.blurTimer);
    this.blurPrevent = true;
    this.visibleInputValue = val;
    this.openDialog();
  }

  protected setFormValue(val: any, options?: IFormValueOptions, setDirty: boolean = false): void {
    super.setFormValue(val, options, setDirty);
    this.stateCtrl.setValue(this.getDescriptionValue());
  }

  protected openDialog(): void {
    const cfg: MatDialogConfig = {
      role: 'dialog',
      disableClose: this.dialogDisableClose,
      panelClass: ['cdk-overlay-list-picker', 'o-dialog-class', this.dialogClass],
      data: {
        data: this.getDialogDataArray(this.dataArray),
        filter: this.filter,
        searchVal: this.visibleInputValue,
        menuColumns: this.visibleColumns, // TODO: improve this, this is passed to `o-search-input` of the dialog
        visibleColumns: this.visibleColArray,
        queryRows: this.queryRows
      }
    };
    if (this.dialogWidth !== undefined) {
      cfg.width = this.dialogWidth;
    }
    if (this.dialogHeight !== undefined) {
      cfg.height = this.dialogHeight;
    }
    this.dialogRef = this.matDialog.open(OListPickerDialogComponent, cfg);

    this.dialogRef.afterClosed().subscribe(result => {
      this.onDialogClose(result);
    });
  }

  protected getDialogDataArray(dataArray: any[]): any[] {
    const result: any[] = [];
    const self = this;
    dataArray.forEach((item, itemIndex) => {
      let element = '';
      self.visibleColArray.forEach((visibleCol, index) => {
        element += item[visibleCol];
        if ((index + 1) < self.visibleColArray.length) {
          element += self.separator;
        }
      });
      const newItem = Object.assign({}, item);
      newItem['_parsedVisibleColumnText'] = element;
      newItem['_parsedIndex'] = itemIndex;
      result.push(newItem);
    });
    return result;
  }

}

@NgModule({
  declarations: [OListPickerDialogComponent, OListPickerComponent],
  imports: [CommonModule, ODialogModule, OSearchInputModule, OSharedModule],
  exports: [OListPickerComponent],
  entryComponents: [OListPickerDialogComponent]
})
export class OListPickerModule { }
