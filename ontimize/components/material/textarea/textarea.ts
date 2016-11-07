import {
  forwardRef,
  Component,
  HostBinding,
  Input,
  Directive,
  AfterContentInit,
  ContentChild,
  SimpleChange,
  ContentChildren,
  ViewChild,
  ElementRef,
  QueryList,
  OnChanges,
  EventEmitter,
  Output,
  Injector,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule, ReactiveFormsModule
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MdError} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import {InputConverter} from '../../../decorators';
import {OTranslateService} from '../../../services';


const noop = () => {
  //nothing to do
};

export const MD_TEXTAREA_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdTextarea),
  multi: true
};

let nextUniqueId = 0;


export class MdInputPlaceholderConflictError extends MdError {
  constructor() {
    super('Placeholder attribute and child element were both specified.');
  }
}

export class MdInputUnsupportedTypeError extends MdError {
  constructor(type: string) {
    super(`Input type "${type}" isn't supported by md-input.`);
  }
}

export class MdInputDuplicatedHintError extends MdError {
  constructor(align: string) {
    super(`A hint was already declared for 'align="${align}"'.`);
  }
}



/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
@Directive({
  selector: 'md-placeholder'
})
export class MdPlaceholder {}


/** The hint directive, used to tag content as hint labels (going under the select). */
@Directive({
  selector: 'md-hint',
  host: {
    '[class.md-right]': 'align == "end"',
    '[class.md-hint]': 'true'
  }
})
export class MdHint {
  // Whether to align the hint label at the start or end of the line.
  @Input() align: 'start' | 'end' = 'start';
}


/**
 * Component that represents a select input. It encapsulates the <select> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
@Component({
  selector: 'md-textarea',
  templateUrl: '/material/textarea/textarea.html',
  styleUrls: ['/material/textarea/textarea.css'],
  providers: [MD_TEXTAREA_CONTROL_VALUE_ACCESSOR],
  host: { '(click)': 'focus()' },
  encapsulation: ViewEncapsulation.None
})
export class MdTextarea implements ControlValueAccessor, AfterContentInit, OnChanges {

  /**
   * Aria related inputs.
   */
  @Input('aria-label') ariaLabel: string;
  @Input('aria-labelledby') ariaLabelledBy: string;
  @Input('aria-disabled') @InputConverter() ariaDisabled: boolean;
  @Input('aria-required') @InputConverter() ariaRequired: boolean;
  @Input('aria-invalid') @InputConverter() ariaInvalid: boolean;

  /**
   * Content directives.
   */
  @ContentChild(MdPlaceholder) _placeholderChild: MdPlaceholder;
  @ContentChildren(MdHint) _hintChildren: QueryList<MdHint>;

  /** Readonly properties. */
  get focused() { return this._focused; }
  get empty() {
    return this._value === null || this._value === undefined || this._value === '';
  }
  get characterCount(): number {
    return this.empty ? 0 : ('' + this._value).length;
  }
  get inputId(): string { return `${this.id}-input`; }

  /**
   * Bindings.
   */
  @Input() align: 'start' | 'end' = 'start';
  @Input() dividerColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() @InputConverter() floatingPlaceholder: boolean = true;
  @Input() hintLabel: string = '';

  @Input() autocomplete: string;
  @Input() autocorrect: string;
  @Input() autocapitalize: string;
  @Input() @InputConverter() autofocus: boolean = false;
  @Input() @InputConverter() disabled: boolean = false;
  @Input() id: string = `md-textarea-${nextUniqueId++}`;
  @Input() list: string = null;
  @Input() max: string | number = null;
  @Input() maxlength: number = null;
  @Input() min: string | number = null;
  @Input() minlength: number = null;
  @Input() placeholder: string = null;
  @Input() @InputConverter() readonly: boolean = false;
  @Input() @InputConverter() required: boolean = false;
  @Input() @InputConverter() spellcheck: boolean = false;
  @Input() columns: number = null;
  @Input() rows: number = null;
  @Input() tabindex: number = null;
  @Input() name: string = null;

  @ViewChild('textarea') _textareaElement: ElementRef;

  protected translateService: OTranslateService;
  private _injector;

  private _blurEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  private _focusEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  private _focused: boolean = false;
  private _value: any = '';

  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void = noop;
  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void = noop;

  constructor(injector: Injector) {
    this._injector = injector;
    if (this._injector) {
      this.translateService = this._injector.get(OTranslateService);
    }
  }

  @Output('blur')
  get onBlur(): Observable<FocusEvent> {
    return this._blurEmitter.asObservable();
  }

  @Output('focus')
  get onFocus(): Observable<FocusEvent> {
    return this._focusEmitter.asObservable();
  }

  get value(): any { return this._value; };
  @Input() set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  // This is to remove the `align` property of the `md-input` itself. Otherwise HTML5
  // might place it as RTL when we don't want to. We still want to use `align` as an
  // Input though, so we use HostBinding.
  @HostBinding('attr.align') get _align(): any { return null; }



  /** Set focus on input */
  focus() {
    this._textareaElement.nativeElement.focus();
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
    this.value = (<HTMLInputElement>event.target).value;
    this._onTouchedCallback();
  }

  _hasPlaceholder(): boolean {
    return !!this.placeholder || this._placeholderChild !== null;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  writeValue(value: any) {
    this._value = value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  /** TODO: internal */
  ngAfterContentInit() {
    this._validateConstraints();

    // Trigger validation when the hint children change.
    this._hintChildren.changes.subscribe(() => {
      this._validateConstraints();
    });
  }

  /** TODO: internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    this._validateConstraints();
  }

  /**
   * Ensure that all constraints defined by the API are validated, or throw errors otherwise.
   * Constraints for now:
   *   - placeholder attribute and <md-placeholder> are mutually exclusive.
   *   - type attribute is not one of the forbidden types (see constant at the top).
   *   - Maximum one of each `<md-hint>` alignment specified, with the attribute being
   *     considered as align="start".
   * @private
   */
  private _validateConstraints() {
    if (this.placeholder !== '' && this.placeholder !== null
      && this._placeholderChild ) {
      throw new MdInputPlaceholderConflictError();
    }

    if (this._hintChildren) {
      // Validate the hint labels.
      let startHint: MdHint = null;
      let endHint: MdHint = null;
      this._hintChildren.forEach((hint: MdHint) => {
        if (hint.align === 'start') {
          if (startHint || this.hintLabel) {
            throw new MdInputDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw new MdInputDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

}

@NgModule({
  declarations: [MdTextarea],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [MdTextarea],
})
export class MdTextareaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdTextareaModule,
      providers: []
    };
  }
}
