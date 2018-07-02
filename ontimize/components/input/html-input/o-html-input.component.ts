import { Component, ElementRef, EventEmitter, Injector, OnInit, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { CKEditor, MdCKEditorModule } from '../../material/ckeditor/ckeditor.component';
import { MatTabGroup, MatTab } from '@angular/material';
import { OSharedModule } from '../../../shared';
import { IFormDataComponent, IFormDataTypeComponent, OFormDataComponent } from '../../o-form-data-component.class';
import { IComponent } from '../../o-component.class';
import { InputConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OTranslateService } from '../../../services';
import { SQLTypes } from '../../../utils';

export const DEFAULT_INPUTS_O_HTML_INPUT = [
  'oattr: attr',
  'olabel: label',
  'data',
  'autoBinding: automatic-binding',
  'autoRegistering: automatic-registering',
  'oenabled: enabled',
  'orequired: required',
  'minLength: min-length',
  'maxLength: max-length',

  // sqltype[string]: Data type according to Java standard. See SQLType class. Default: 'OTHER'
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_HTML_INPUT = [
  'onChange',
  'onFocus',
  'onBlur'
];

@Component({
  selector: 'o-html-input',
  templateUrl: './o-html-input.component.html',
  styleUrls: ['./o-html-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_HTML_INPUT,
  outputs: DEFAULT_OUTPUTS_O_HTML_INPUT
})
export class OHTMLInputComponent extends OFormDataComponent implements OnInit, IComponent, IFormDataComponent, IFormDataTypeComponent {

  public static DEFAULT_INPUTS_O_HTML_INPUT = DEFAULT_INPUTS_O_HTML_INPUT;
  public static DEFAULT_OUTPUTS_O_HTML_INPUT = DEFAULT_OUTPUTS_O_HTML_INPUT;

  oattr: string;
  olabel: string;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  orequired: boolean = true;
  @InputConverter()
  autoBinding: boolean = true;
  @InputConverter()
  autoRegistering: boolean = true;
  @InputConverter()
  minLength: number = -1;
  @InputConverter()
  maxLength: number = -1;
  sqlType: string;

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('ckEditor') ckEditor: CKEditor;

  protected value: OFormValue;
  protected translateService: OTranslateService;
  protected _SQLType: number = SQLTypes.OTHER;

  protected _fControl: FormControl;

  protected _disabled: boolean;
  protected _isReadOnly: boolean;
  protected _placeholder: string;
  protected _tooltip: string;
  protected _tooltipPosition: string = 'below';
  protected _tooltipShowDelay: number = 500;

  protected tabGroupContainer: MatTabGroup;
  protected tabContainer: MatTab;

  constructor(
    form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.form = form;
    this.elRef = elRef;
    try {
      this.tabGroupContainer = this.injector.get(MatTabGroup);
      this.tabContainer = this.injector.get(MatTab);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.form) {
      var self = this;
      this.form.beforeCloseDetail.subscribe((evt: any) => {
        self.destroyCKEditor();
      });
      this.form.beforeGoEditMode.subscribe((evt: any) => {
        self.destroyCKEditor();
      });
    }

    if (this.tabGroupContainer) {
      this.tabGroupContainer.selectedTabChange.subscribe((evt: any) => {
        self.destroyCKEditor();
        if (self.isInActiveTab()) {
          self.ckEditor.initializeCkEditor(self.getValue());
        }
      });
    }
  }

  isInActiveTab(): boolean {
    var result: boolean = !(this.tabGroupContainer && this.tabContainer);
    if (!result) {
      var self = this;
      this.tabGroupContainer._tabs.forEach(function (tab, index) {
        if (tab === self.tabContainer) {
          result = (self.tabGroupContainer.selectedIndex === index);
        }
      });
    }
    return result;
  }

  isLoaded(): boolean {
    var result = true;
    if (this.tabGroupContainer && this.tabContainer) {
      result = this.isInActiveTab();
    }
    return result;
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();

    if (this.minLength >= 0) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength >= 0) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    return validators;
  }

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
  }

  innerOnFocus(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  innerOnBlur(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onBlur.emit(event);
    }
  }

  get isValid() {
    if (this._fControl) {
      return this._fControl.valid;
    }
    return false;
  }

  clearValue(): void {
    super.clearValue();
    this.ckEditor.instance.updateElement();
    this.ckEditor.instance.setData('');
  }

  /*
  * When ckEditor is inside a TabGroup it is necessary to destroy the component before
  * Angular detaches mat-tab-content from DOM
  */
  destroyCKEditor() {
    if (this.ckEditor) {
      this.ckEditor.destroyCKEditor();
    }
  }

}

@NgModule({
  declarations: [OHTMLInputComponent],
  imports: [OSharedModule, CommonModule, MdCKEditorModule],
  exports: [OHTMLInputComponent]
})
export class OHTMLInputModule {
}
