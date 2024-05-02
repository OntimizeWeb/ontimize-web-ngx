import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'o-combo-search',
  templateUrl: './o-combo-search.component.html',
  styleUrls: ['./o-combo-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OComboSearchComponent),
      multi: true
    }
  ],
  host: {
    '[class.o-combo-search]': 'true'
  }
})
export class OComboSearchComponent implements OnInit, OnDestroy {

  public placeholder: string = 'SEARCH';

  /** Reference to the MatSelect options */
  public _options: QueryList<MatOption>;

  /** Current search value */
  get value(): string {
    return this._value;
  }
  protected _value: string;

  /** Previously selected values when using <mat-select [multiple]="true"> */
  protected previousSelectedValues: any[];

  /** Reference to the search input field */
  @ViewChild('searchSelectInput', { read: ElementRef })
  protected searchSelectInput: ElementRef;

  /** Event that emits when the current value changes */
  protected change = new EventEmitter<string>();

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    @Inject(MatSelect) public matSelect: MatSelect,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    // when the select dropdown panel is opened or closed, focus the search field when opening and clear it when closing
    this.matSelect.openedChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe(opened => opened ? this.focus() : this.reset());

    // set the first item active after the options changed
    this.matSelect.openedChange
      .pipe(take(1))
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        if (this.matSelect.multiple) {
          this.previousSelectedValues = this.matSelect.value;
        }
        this._options = this.matSelect.options;
        this._options.changes
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            const keyManager = this.matSelect._keyManager;
            if (keyManager && this.matSelect.panelOpen) {
              // avoid "expression has been changed" error
              setTimeout(() => keyManager.setFirstItemActive(), 0);
            }
          });
      });

    // detect changes when the input changes
    this.change
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.changeDetectorRef.detectChanges());

    this.initMultipleHandling();
  }

  public ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public onChange: Function = (_: any) => {
    // do nothing
  }

  public onTouched: Function = (_: any) => {
    // do nothing
  }

  /**
   * Handles the key down event with MatSelect.
   * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
   * @param event
   */
  public handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === 32) {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }
  }

  public onInputChange(value: any): void {
    const valueChanged = value !== this._value;
    if (valueChanged) {
      this._value = value;
      this.onChange(value);
      this.change.emit(value);
    }
  }

  public onBlur(value: string): void {
    this.writeValue(value);
    this.onTouched();
  }

  public writeValue(value: string): void {
    const valueChanged = value !== this._value;
    if (valueChanged) {
      this._value = value;
      this.change.emit(value);
    }
  }

  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  /**
   * Focuses the search input field
   */
  public focus(): void {
    if (!this.searchSelectInput) {
      return;
    }
    // save and restore scrollTop of panel, since it will be reset by focus()
    // note: this is hacky
    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;

    // focus
    this.searchSelectInput.nativeElement.focus();

    panel.scrollTop = scrollTop;
  }

  /**
   * Resets the current search value
   * @param focus whether to focus after resetting
   */
  public reset(focus?: boolean): void {
    if (!this.searchSelectInput) {
      return;
    }
    this.searchSelectInput.nativeElement.value = '';
    this.onInputChange('');
    if (focus) {
      this.focus();
    }
  }

  /**
   * Initializes handling <mat-select [multiple]="true">
   * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
   */
  protected initMultipleHandling(): void {
    // if <mat-select [multiple]="true">
    // store previously selected values and restore them when they are deselected
    // because the option is not available while we are currently filtering
    this.matSelect.valueChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe(values => {
        if (this.matSelect.multiple) {
          let restoreSelectedValues = false;
          if (this._value && this._value.length
            && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
            if (!values || !Array.isArray(values)) {
              values = [];
            }
            const optionValues = this.matSelect.options.map(option => option.value);
            this.previousSelectedValues.forEach(previousValue => {
              if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
                // if a value that was selected before is deselected and not found in the options, it was deselected
                // due to the filtering, so we restore it.
                values.push(previousValue);
                restoreSelectedValues = true;
              }
            });
          }

          if (restoreSelectedValues) {
            this.matSelect._onChange(values);
          }

          this.previousSelectedValues = values;
        }
      });
  }

  public resetSelectedValues() {
    this.previousSelectedValues = [];
  }

}
