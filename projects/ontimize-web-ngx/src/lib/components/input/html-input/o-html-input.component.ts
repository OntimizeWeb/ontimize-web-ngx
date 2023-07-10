import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, Type, ViewChild } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { MatLegacyTab as MatTab, MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';

import { NumberConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { CKEditorComponent } from '../../material/ckeditor/ck-editor.component';
import { OFormDataComponent } from '../../o-form-data-component.class';

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
  'onFocus',
  'onBlur'
];

@Component({
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
export class OHTMLInputComponent extends OFormDataComponent implements OnInit, AfterViewInit {

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
    this._changeDetectorRef = this.injector.get<ChangeDetectorRef>(ChangeDetectorRef as Type<ChangeDetectorRef>);
    try {
      this.tabGroupContainer = this.injector.get<MatTabGroup>(MatTabGroup as Type<MatTabGroup>);
      this.tabContainer = this.injector.get<MatTab>(MatTab as Type<MatTab>);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }
  }

  ngOnInit() {
    super.ngOnInit();
    const self = this;
    if (this.form) {
      this.form.beforeCloseDetail.subscribe(() => this.destroyCKEditor());
      this.form.beforeUpdateMode.subscribe(() => this.destroyCKEditor());
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
    const result = super.hasError(error);
    this._subscriptAnimationState = result ? 'enter' : 'void';
    return result;
  }

  isInActiveTab(): boolean {
    let result: boolean = !(this.tabGroupContainer && this.tabContainer);
    if (!result) {
      const self = this;
      this.tabGroupContainer._tabs.forEach((tab, index) => {
        if (tab === self.tabContainer) {
          result = (self.tabGroupContainer.selectedIndex === index);
        }
      });
    }
    return result;
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
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
