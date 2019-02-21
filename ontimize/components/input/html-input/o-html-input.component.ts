import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, NgModule, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ValidatorFn, Validators } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material';

import { OSharedModule } from '../../../shared/shared.module';
import { NumberConverter } from '../../../decorators';
import { OFormComponent } from '../../form/form-components';
import { CKEditorComponent, CKEditorModule } from '../../material/ckeditor/ck-editor.component';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_HTML_INPUT = [
  'oattr: attr',
  'data',
  'autoBinding: automatic-binding',
  'autoRegistering: automatic-registering',
  'orequired: required',
  'minLength: min-length',
  'maxLength: max-length',
  'readOnly: read-only',
  'sqlType: sql-type'
];

export const DEFAULT_OUTPUTS_O_HTML_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'onFocus',
  'onBlur'
];

@Component({
  moduleId: module.id,
  selector: 'o-html-input',
  templateUrl: './o-html-input.component.html',
  styleUrls: ['./o-html-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_HTML_INPUT,
  outputs: DEFAULT_OUTPUTS_O_HTML_INPUT,
  animations: [
    trigger('transitionMessages', [
      state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
      transition('void => enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ]),
    ])
  ]
})
export class OHTMLInputComponent extends OFormDataComponent implements AfterViewInit {

  public static DEFAULT_INPUTS_O_HTML_INPUT = DEFAULT_INPUTS_O_HTML_INPUT;
  public static DEFAULT_OUTPUTS_O_HTML_INPUT = DEFAULT_OUTPUTS_O_HTML_INPUT;

  protected _minLength: number = -1;
  protected _maxLength: number = -1;

  @ViewChild('ckEditor') ckEditor: CKEditorComponent;

  protected tabGroupContainer: MatTabGroup;
  protected tabContainer: MatTab;

  /** State of the mat-hint and mat-error animations. */
  _subscriptAnimationState: string = '';

  protected _changeDetectorRef: ChangeDetectorRef;

  constructor(
    form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.form = form;
    this.elRef = elRef;
    this._changeDetectorRef = this.injector.get(ChangeDetectorRef);
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
          self.ckEditor.initCKEditor(self.oattr);
        }
      });
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // Avoid animations on load.
    this._subscriptAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }


  hasError(error: string): boolean {
    let result = super.hasError(error);
    this._subscriptAnimationState = result ? 'enter' : 'void';
    return result;
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

  clearValue(): void {
    super.clearValue();
    this.ckEditor.instance.updateElement();
    this.ckEditor.instance.setData('');
  }

  destroyCKEditor() {
    if (this.ckEditor) {
      this.ckEditor.destroyCKEditor();
    }
  }

  getCKEditor(): any {
    return this.ckEditor.instance;
  }

  set minLength(val: number) {
    const old = this._minLength;
    this._minLength = NumberConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  get minLength(): number {
    return this._minLength;
  }

  set maxLength(val: number) {
    const old = this._maxLength;
    this._maxLength = NumberConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  get maxLength(): number {
    return this._maxLength;
  }
}

@NgModule({
  declarations: [OHTMLInputComponent],
  imports: [CKEditorModule, CommonModule, OSharedModule],
  exports: [OHTMLInputComponent]
})
export class OHTMLInputModule { }
