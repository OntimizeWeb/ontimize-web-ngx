// Imports
import {
  Component,
  Input,
  Output,
  ContentChild,
  ContentChildren,
  ElementRef,
  ViewChild,
  EventEmitter,
  NgZone,
  forwardRef,
  QueryList,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

import {
  MdInputModule,
  MdPlaceholder,
  MdHint
} from '@angular2-material/input';
import {Observable} from 'rxjs/Observable';

import {InputConverter} from '../../../decorators';


const noop = () => {
  //nothing to do
 };

// Control Value accessor provider
const CKEDITOR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CKEditor),
  multi: true
};

let nextUniqueId = 0;

/**
 * CKEditor component
 * Usage :
 *  <ckeditor [(ngModel)]="data" [config]="{...}" debounce="500"></ckeditor>
 */
@Component({
  selector: 'ckeditor',
  providers: [CKEDITOR_CONTROL_VALUE_ACCESSOR],
  templateUrl: '/material/ckeditor/ckeditor.component.html',
  styleUrls: ['/material/ckeditor/ckeditor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CKEditor implements ControlValueAccessor {

  /**
   * Bindings.
   */
  @Input() config;
  @Input() debounce;

  @Input() id: string = `ckeditor-${nextUniqueId++}`;
  @Input() @InputConverter() floatingPlaceholder: boolean = true;
  @Input() hintLabel: string = '';
  @Input() @InputConverter() readonly: boolean = false;
  @Input() placeholder: string = null;
  @Input() dividerColor: 'primary' | 'accent' | 'warn' = 'primary';

  /**
   * Content directives.
   */
  @ContentChild(MdPlaceholder) _placeholderChild: MdPlaceholder;
  @ContentChildren(MdHint) _hintChildren: QueryList<MdHint>;

  /** Readonly properties. */
  get focused() { return this._focused; }
  get empty() { return this._value === null || this._value === ''; }
  get characterCount(): number {
    return this.empty ? 0 : ('' + this._value).length;
  }
  get inputId(): string { return `${this.id}-input`; }

  // @Output('change') change = new EventEmitter();
  @Output('change')
  get onChange(): Observable<any> {
    return this._changeEmitter.asObservable();
  }

  @Output('blur')
  get onBlur(): Observable<FocusEvent> {
    return this._blurEmitter.asObservable();
  }

  @Output('focus')
  get onFocus(): Observable<FocusEvent> {
    return this._focusEmitter.asObservable();
  }


  @ViewChild('host') host;
  instance;
  debounceTimeout;
  elementRef;
  zone;

  private _focused: boolean = false;
  private _value: any = '';
  private _isReadOnly: boolean = false;

  private _blurEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  private _focusEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  private _changeEmitter: EventEmitter<any> = new EventEmitter<any>();

      /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void = noop;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void = noop;


  /**
   * Constructor
   */
  constructor(elementRef: ElementRef, zone: NgZone) {
    this.elementRef = elementRef;
    this.zone = zone;
  }

  get value(): any {
    return this._value;
  };

  @Input()
  set value(v) {
    if (v !== this._value) {
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  /**
   * On component destroy
   */
  ngOnDestroy() {
    this.destroyCKEditor();
  }

  public destroyCKEditor() {
    if (this.instance) {
      this.instance.removeAllListeners();
      this.instance.destroy();
      this.instance = null;
    }
  }

  /**
   * On component view init
   */
  ngAfterViewInit() {
    // Configuration
    var config = this.config || {};
    this.ckeditorInit(config);
  }

  /**
   * Value update process
   */
  updateValue(value) {
    this.zone.run(() => {
      this.value = value;

      // this.onChange(value);

      this._onTouchedCallback();
      this._changeEmitter.emit(value);
    });
  }

  /**
   * CKEditor init
   */
  ckeditorInit(config) {
    if (!window['CKEDITOR']) {
      console.error('Please include CKEditor in your page');
      return;
    }

    // CKEditor replace textarea
    this.instance = window['CKEDITOR'].replace(this.host.nativeElement, config);

    // Set initial value
    // this.instance.setData(this._value);
    this.setInstanceData('');

    // CKEditor events
    this.instance.on('change', (evt:any) => this._handleChange(evt));
    this.instance.on('blur', (evt:any) => this._handleBlur(evt));
    this.instance.on('focus', (evt:any) => this._handleFocus(evt));

  }

  /**
   * Implements ControlValueAccessor
   */
  writeValue(value) {
    this._value = value;
    // if (this.instance) {
      // this.instance.setData(value);
      this.setInstanceData(value);
    // }
  }

    /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  /** Set focus on input */
  focus() {
    this.host.nativeElement.focus();
  }

  _handleFocus(event: FocusEvent) {
    this._focused = true;
    this._focusEmitter.emit(event);
  }

  _handleBlur(event: FocusEvent) {
    this._focused = false;
    this._onTouchedCallback();
    this._blurEmitter.emit(event);
  }

  _handleChange(event: Event) {
      this._onTouchedCallback();
      let value = this.instance.getData();

      // Debounce update
      if (this.debounce) {
        if(this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.updateValue(value);
          this.debounceTimeout = null;
        }, parseInt(this.debounce));

      // Live update
      } else {
        this.updateValue(value);
      }
  }

  _hasPlaceholder(): boolean {
    return !!this.placeholder || this._placeholderChild !== null;
  }

  setReadOnlyState(value: boolean) {
    this._isReadOnly = value;
    if (this.instance) {
      var self = this;
      var retryCount = 0;
      var delayedSetReadOnly = function () {
         var status = self.instance.status;
          if (status !== 'loaded' && retryCount++ < 10) {
              setTimeout(delayedSetReadOnly, retryCount * 10); //Wait a while longer each iteration
          } else {
              self.instance.setReadOnly(self._isReadOnly);
          }
      };
      setTimeout(delayedSetReadOnly, 50);
    }
  }

  protected setInstanceData(data: any) {
    if (this.instance) {
      var self = this;
      var retryCount = 0;
      var delayedSetData = function () {
         var status = self.instance.status;
          if (status !== 'loaded' && retryCount++ < 10) {
              setTimeout(delayedSetData, retryCount * 10); //Wait a while longer each iteration
          } else {
              self.instance.setData(self._value);
          }
      };
      setTimeout(delayedSetData, 50);
    }
  }


}

@NgModule({
  declarations: [CKEditor],
  imports: [CommonModule, MdInputModule],
  exports: [CKEditor],
})
export class MdCKEditorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdCKEditorModule,
      providers: []
    };
  }
}
