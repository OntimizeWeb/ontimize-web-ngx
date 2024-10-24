import { Directive, ElementRef, forwardRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Util } from '../util/util';

@Directive({
  selector: '[oInputRegulate]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputRegulateDirective),
    multi: true
  }]
})
export class InputRegulateDirective implements ControlValueAccessor, OnInit {
  private onChange: (val: string) => void;
  private onTouched: () => void;
  private value: string;

  @Input()
  oInputRegulatePattern: string;
  regExpattern: RegExp;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {

  }
  ngOnInit(): void {
    if (Util.isDefined(this.oInputRegulatePattern)) {
      this.regExpattern = new RegExp(this.oInputRegulatePattern);
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    if (Util.isDefined(this.regExpattern)) {
      const filterValue = this.regExpattern.test(value) ? value : this.value;
      this.updateTextInput(filterValue, filterValue !== this.value);
    }
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  private updateTextInput(value: string, propagateChange: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    if (propagateChange) {
      this.onChange(value);
    }
    this.value = value;
  }

  // ControlValueAccessor Interface
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  writeValue(value: any): void {
    value = value ? String(value) : '';
    this.updateTextInput(value, false);
  }

}

