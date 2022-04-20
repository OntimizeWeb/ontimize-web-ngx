import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Util } from '../../../util/util';

declare var CKEDITOR: any;

const defaults = {
  contentsCss: [''],
  customConfig: ''
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ck-editor',
  template: `<textarea #ck></textarea>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CKEditorComponent),
    multi: true
  }],
  exportAs: 'ckEditor'
})
export class CKEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  protected ckIns: any;
  protected identifier: string;
  protected innerValue: string = '';

  public get instance() {
    return this.ckIns;
  }

  protected _readonly: boolean = false;

  @Input()
  set readonly(value: boolean) {
    this._readonly = value;
    setTimeout(() => {
      if (Util.isDefined(this.ckIns) && Util.isDefined(this.ckIns.editable())) {
        this.ckIns.setReadOnly(this.readonly);
      }
    });
  }

  get readonly(): boolean {
    return this._readonly;
  }

  @Input() public config: any = {};
  @Input() public skin: string = 'moono-lisa';
  @Input() public language: string = 'en';
  @Input() public fullPage: boolean = false;
  @Input() public inline: boolean = false;
  @Input() public id: string;

  @Output() change = new EventEmitter();
  @Output() ready = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() focus = new EventEmitter();

  @ViewChild('ck', { static: false }) public ck: ElementRef;

  constructor(
    protected ngZone: NgZone
  ) { }

  protected static getRandomIdentifier(id: string = '') {
    var randomArray = new Uint32Array(10);
    window.crypto.getRandomValues(randomArray);
    return 'editor-' + (id !== '' ? id : Math.round(randomArray[0] * 100000000));
  }

  ngOnDestroy() {
    this.destroyCKEditor();
  }

  ngAfterViewInit() {
    this.destroyCKEditor();
    this.initCKEditor(CKEditorComponent.getRandomIdentifier(this.id));
  }

  public initCKEditor(identifier: string) {
    if (typeof CKEDITOR === 'undefined') {
      return console.warn('CKEditor 4.x is missing (http://ckeditor.com/)');
    }

    this.identifier = identifier;
    this.ck.nativeElement.setAttribute('name', this.identifier);

    const opt = Object.assign({}, defaults, this.config, {
      readOnly: this.readonly,
      skin: this.skin,
      language: this.language,
      fullPage: this.fullPage,
      inline: this.inline,
      width: '100%'
    });
    this.ckIns = this.inline
      ? CKEDITOR.inline(this.ck.nativeElement, opt)
      : CKEDITOR.replace(this.ck.nativeElement, opt);
    this.ckIns.setData(this.innerValue);

    this.ckIns.on('change', () => {
      const val = this.ckIns.getData();
      this.updateValue(val);
    });

    this.ckIns.on('instanceReady', (evt: any) => {
      this.ngZone.run(() => {
        this.ready.emit(evt);
      });
    });

    this.ckIns.on('blur', (evt: any) => {
      this.ngZone.run(() => {
        this.blur.emit(evt);
        this.propagateTouch();
      });
    });

    this.ckIns.on('focus', (evt: any) => {
      this.ngZone.run(() => {
        this.focus.emit(evt);
      });
    });
  }

  public destroyCKEditor() {
    if (this.ckIns) {
      this.ckIns.removeAllListeners();
      if (CKEDITOR.instances.hasOwnProperty(this.ckIns.name)) {
        CKEDITOR.remove(CKEDITOR.instances[this.ckIns.name]);
      }
      this.ckIns.destroy();
      this.ckIns = null;
      const editorEl = document.querySelector('#cke_' + this.identifier);
      if (Util.isDefined(editorEl) && Util.isDefined(editorEl.parentElement)) {
        editorEl.parentElement.removeChild(editorEl);
      }
    }
  }

  protected updateValue(value: string) {
    this.ngZone.run(() => {
      this.innerValue = value;
      this.propagateChange(value);
      this.propagateTouch();
      this.change.emit(value);
    });
  }

  writeValue(value: any): void {
    this.innerValue = value || '';
    if (this.ckIns) {
      // Fix bug that can't emit change event when set non-html tag value twice in fullpage mode.
      this.ckIns.setData(this.innerValue);
      const val = this.ckIns.getData();
      this.ckIns.setData(val);
    }
  }

  protected propagateChange(_: any) {
    // do nothing
  }

  protected propagateTouch() {
    // do nothing
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

}
