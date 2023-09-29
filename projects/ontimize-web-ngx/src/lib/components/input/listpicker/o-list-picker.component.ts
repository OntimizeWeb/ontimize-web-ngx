import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnChanges,
  OnInit,
  Optional,
  SimpleChange,
  ViewChild
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

import { BooleanInputConverter, NumberInputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFormControl } from '../o-form-control.class';
import { OFormServiceComponent } from '../o-form-service-component.class';
import { OListPickerCustomRenderer } from './listpicker-renderer/o-list-picker-renderer.class';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';

export const DEFAULT_INPUTS_O_LIST_PICKER = [
  'filter',
  'dialogWidth : dialog-width',
  'dialogHeight : dialog-height',
  'queryRows: query-rows',
  'textInputEnabled: text-input-enabled',
  'dialogDisableClose: dialog-disable-close',
  'dialogClass: dialog-class'
];

export const DEFAULT_OUTPUTS_O_LIST_PICKER = [
  'onDialogAccept',
  'onDialogCancel'
];

@Component({
  selector: 'o-list-picker',
  templateUrl: './o-list-picker.component.html',
  styleUrls: ['./o-list-picker.component.scss'],
  providers: [
    OntimizeServiceProvider,
    { provide: OFormServiceComponent, useExisting: forwardRef(() => OListPickerComponent) }
  ],
  inputs: DEFAULT_INPUTS_O_LIST_PICKER,
  outputs: DEFAULT_OUTPUTS_O_LIST_PICKER
})
export class OListPickerComponent extends OFormServiceComponent implements AfterViewInit, OnChanges, OnInit {

  /* Outputs */
  public onDialogAccept: EventEmitter<any> = new EventEmitter();
  public onDialogCancel: EventEmitter<any> = new EventEmitter();
  /* End outputs */

  public stateCtrl: UntypedFormControl;

  /* Inputs */
  @BooleanInputConverter()
  public textInputEnabled: boolean = true;
  @BooleanInputConverter()
  public dialogDisableClose: boolean = false;
  @BooleanInputConverter()
  protected filter: boolean = true;
  protected dialogWidth: string;
  protected dialogHeight: string = '55%';
  protected dialogClass: string;
  @NumberInputConverter()
  protected queryRows: number;


  public renderer: OListPickerCustomRenderer;

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
    this.matDialog = this.injector.get<MatDialog>(MatDialog);
    this.stateCtrl = new UntypedFormControl();
    /* overwritte clearButton to true */
    this.clearButton = true;
  }

  public ngOnInit(): void {
    this.initialize();
    // Ensuring value in the stateCtrl
    // (just in case it was created with a empty value before the fControl data initialization)
    if (!Util.isDefined(this.stateCtrl.value)) {
      this.setStateCtrlValue();
    }
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    super.ngOnChanges(changes);
    if (typeof (changes.staticData) !== 'undefined') {
      this.cacheQueried = true;
      this.setDataArray(changes.staticData.currentValue);
    }
  }

  public createFormControl(cfg?, validators?): OFormControl {
    this._fControl = super.createFormControl(cfg, validators);
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
    if (this.stateCtrl && this.hasEnabledPermission() || this.hasVisiblePermission()) {
      value ? this.stateCtrl.enable() : this.stateCtrl.disable();
    }
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
    if (!Util.isDefined(this.descriptionColArray) || !Util.isDefined(this._currentIndex)) {
      return '';
    }
    if (Util.isDefined(this.renderer)) {
      return this.renderer.getListPickerValue(this.dataArray[this._currentIndex]);
    } else {
      return this.getOptionDescriptionValue(this.dataArray[this._currentIndex]);
    }
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

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    super.setFormValue(val, options, setDirty);
    this.setStateCtrlValue();
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
        queryRows: this.queryRows,
        renderer: this.renderer
      }
    };
    if (this.dialogWidth !== undefined) {
      cfg.width = this.dialogWidth;
    }
    if (this.dialogHeight !== undefined) {
      cfg.height = this.dialogHeight;
    }
    this.dialogRef = this.matDialog.open(OListPickerDialogComponent, cfg);

    this.dialogRef.afterClosed().subscribe(result => this.onDialogClose(result));
  }

  protected getDialogDataArray(dataArray: any[]): any[] {
    const result: any[] = [];
    dataArray.forEach((item, itemIndex) => {
      const newItem = Object.assign({}, item);
      if (!this.renderer) {
        newItem._parsedVisibleColumnText = this.getOptionDescriptionValue(item);
      }
      newItem._parsedIndex = itemIndex;
      result.push(newItem);
    });
    return result;
  }

  public registerRenderer(renderer: any) {
    this.renderer = renderer;
    this.renderer.initialize();
  }

  protected setStateCtrlValue() {
    let descriptionValue = this.getDescriptionValue();
    if (typeof descriptionValue === 'string' && descriptionValue.length === 0) {
      descriptionValue = null;
    }
    this.stateCtrl.setValue(descriptionValue);
  }

  public selectValue() {
    const inputEl = document.getElementById('desc_' + this.oattr);
    if (inputEl) {
      (inputEl as HTMLInputElement).select();
    }
  }

}
