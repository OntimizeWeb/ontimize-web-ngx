import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, EventEmitter, forwardRef, Input, KeyValueDiffer, KeyValueDiffers, NgZone, Output, ViewContainerRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as _moment from 'moment';
import { merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DaterangepickerComponent } from './o-daterange-picker.component';
const moment = _moment;

@Directive({
  selector: 'input[o-daterange-input]',
  host: {
    '(keyup.esc)': 'close()',
    '(blur)': 'onBlur()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ODaterangepickerDirective), multi: true
    }
  ]
})
export class ODaterangepickerDirective implements OnDestroy {

  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  public _validatorChange = Function.prototype;
  private _value: any;

  public localeDiffer: KeyValueDiffer<string, any>;

  @Input()
  minDate: _moment.Moment = null;
  @Input()
  maxDate: _moment.Moment = null;
  @Input()
  showCustomRangeLabel: boolean;
  @Input()
  linkedCalendars: boolean;
  @Input()
  dateLimit: number = null;
  @Input()
  singleDatePicker: boolean;
  @Input()
  showWeekNumbers: boolean;
  @Input()
  showISOWeekNumbers: boolean;
  @Input()
  showDropdowns: boolean;
  @Input()
  isInvalidDate: () => boolean;
  @Input()
  isCustomDate: () => boolean;
  // @Input()
  // showClearButton: boolean;


  @Input()
  opens: string;
  @Input()
  drops: string;
  firstMonthDayClass: string;
  @Input()
  lastMonthDayClass: string;
  @Input()
  emptyWeekRowClass: string;
  @Input()
  firstDayOfNextMonthClass: string;
  @Input()
  lastDayOfPreviousMonthClass: string;
  @Input()
  keepCalendarOpeningWithRange: boolean;
  @Input()
  showRangeLabelOnInput: boolean;
  @Input()
  showCancel: boolean = false;
  // timepicker variables
  @Input()
  timePicker: boolean = false;
  @Input()
  showRanges: boolean = false;
  @Input()
  timePicker24Hour: boolean = false;
  @Input()
  timePickerIncrement: number = 1;
  @Input()
  timePickerSeconds: boolean = false;
  _locale: any;
  _separator: string;

  @Input() set separator(value) {
    if (value !== null) {
      this._separator = value;
      if (this._locale) {
        this._locale.separator = value;
      }
    }
  }

  @Input() set locale(value) {
    if (value !== null) {
      this._locale = value;
      if (this._separator) {
        this._locale.separator = this._separator;
      }
    }
  }
  get locale(): any {
    return this._locale;
  }

  @Input()
  private _endKey: string = 'endDate';
  private _startKey: string = 'startDate';

  public ranges: any = {
    'DATERANGE.today': [moment(), moment()],
    'DATERANGE.yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'DATERANGE.last_7days': [moment().subtract(6, 'days'), moment()],
    'DATERANGE.last_30days': [moment().subtract(29, 'days'), moment()],
    'DATERANGE.this_month': [moment().startOf('month'), moment().endOf('month')],
    'DATERANGE.last_month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'DATERANGE.this_year': [moment().startOf('year'), moment().endOf('year')]
  };

  @Input()
  oTouchUi: boolean = false;

  @Input() set startKey(value) {
    if (value && value !== null) {
      this._startKey = value;
    } else {
      this._startKey = 'startDate';
    }
  }
  get startKey(): string {
    return this._startKey;
  }
  @Input() set endKey(value) {
    if (value && value !== null) {
      this._endKey = value;
    } else {
      this._endKey = 'endDate';
    }
  }
  get endKey(): string {
    return this._endKey;
  }
  notForChangesProperty: Array<string> = [
    'locale',
    'endKey',
    'startKey'
  ];

  get value() {
    return this._value || null;
  }
  set value(val) {
    this._value = val;
    this._onChange(val);
    this._changeDetectorRef.markForCheck();
  }
  @Output() onChange: EventEmitter<object> = new EventEmitter();
  @Output() rangeClicked: EventEmitter<object> = new EventEmitter();
  @Output() datesUpdated: EventEmitter<object> = new EventEmitter();

  private _popupComponentRef: ComponentRef<DaterangepickerComponent> | null;
  private _calendarPortal: ComponentPortal<DaterangepickerComponent>;
  _popupRef: OverlayRef;
  private _dialogRef: MatDialogRef<DaterangepickerComponent> | null;

  constructor(
    private _dialog: MatDialog,
    private _ngZone: NgZone,
    private _overlay: Overlay,
    public _viewContainerRef: ViewContainerRef,
    public _changeDetectorRef: ChangeDetectorRef,
    public _el: ElementRef,
    private differs: KeyValueDiffers,
    private scrollStrategy: ScrollStrategyOptions
  ) {
    this.drops = 'down';
    this.opens = 'right';
  }

  initializeListeners(instance) {
    instance.rangeClicked.asObservable().subscribe((range: any) => {
      this.rangeClicked.emit(range);
    });
    instance.datesUpdated.asObservable().subscribe((range: any) => {
      this.datesUpdated.emit(range);
    });
    instance.choosedDate.asObservable().subscribe((change: any) => {
      if (change) {
        const value = {};
        value[this._startKey] = change.startDate;
        value[this._endKey] = change.endDate;
        this.value = value;
        this.onChange.emit(value);
        if (typeof change.chosenLabel === 'string') {
          this._el.nativeElement.value = change.chosenLabel;
        }
      }
    });
    instance.firstMonthDayClass = this.firstMonthDayClass;
    instance.lastMonthDayClass = this.lastMonthDayClass;
    instance.emptyWeekRowClass = this.emptyWeekRowClass;
    instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
    instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
    instance.drops = this.drops;
    instance.opens = this.opens;
    instance.minDate = this.minDate;
    instance.maxDate = this.maxDate;
    instance.locale = this.locale;
    instance.showWeekNumbers = this.showWeekNumbers;
    instance.singleDatePicker = this.singleDatePicker;

    if (this.showRanges) {
      instance.ranges = this.ranges;
      instance.keepCalendarOpeningWithRange = true;
      instance.alwaysShowCalendars = true;
    }
    this.localeDiffer = this.differs.find(this.locale).create();
  }

  // ngOnChanges(changes: SimpleChanges): void  {
  //   for (let change in changes) {
  //     if (changes.hasOwnProperty(change)) {
  //       if (this.notForChangesProperty.indexOf(change) === -1) {
  //         this.picker[change] = changes[change].currentValue;
  //       }
  //     }
  //   }
  // }

  // ngDoCheck() {
  //   if (this.localeDiffer) {
  //     const changes = this.localeDiffer.diff(this.locale);
  //     if (changes) {
  //       this.picker.updateLocale(this.locale);
  //     }
  //   }
  // }

  onBlur() {
    this._onTouched();
  }

  open() {
    if (!this.oTouchUi) {
      this.openAsPopup();

    } else {
      this.openAsDialog();
    }
  }

  ngOnDestroy() {
    this.close();

    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupComponentRef = null;
    }
  }

  clear() {
    this._popupComponentRef.instance.clear();
  }

  writeValue(value) {
    this.setValue(value);
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }

  setValueInDateComponent(instance, val) {
    if (val) {
      if (val[this._startKey]) {
        instance.setStartDate(val[this._startKey]);
      }
      if (val[this._endKey]) {
        instance.setEndDate(val[this._endKey]);
      }
      instance.calculateChosenLabel();
      if (instance.chosenLabel) {
        this._el.nativeElement.value = instance.chosenLabel;
      }
    } else {
      instance.clear();
    }

  }
  private setValue(val: any) {
    if (val) {
      this.value = val;

    }
  }
  /**
   * Set position of the calendar
   */
  // setPosition() {
  //   let style;
  //   let containerTop;
  //   const container = this.picker.pickerContainer.nativeElement;
  //   const element = this._el.nativeElement;
  //   if (this.drops && this.drops == 'up') {
  //     containerTop = (element.offsetTop - container.clientHeight) + 'px';
  //   } else {
  //     containerTop = 'auto';
  //   }
  //   if (this.opens == 'left') {
  //     style = {
  //         top: containerTop,
  //         left: (element.offsetLeft - container.clientWidth + element.clientWidth) + 'px',
  //         right: 'auto'
  //     };
  //   } else if (this.opens == 'center') {
  //       style = {
  //         top: containerTop,
  //         left: (element.offsetLeft  +  element.clientWidth / 2
  //                 - container.clientWidth / 2) + 'px',
  //         right: 'auto'
  //       };
  //   } else {
  //       style = {
  //         top: containerTop,
  //         left: element.offsetLeft  + 'px',
  //         right: 'auto'
  //       }
  //   }
  //   if (style) {
  //     this._renderer.setStyle(container, 'top', style.top);
  //     this._renderer.setStyle(container, 'left', style.left);
  //     this._renderer.setStyle(container, 'right', style.right);
  //     this._renderer.setStyle(container, 'position', 'fixed');
  //   }
  // }
  /**
   * For click outside of the calendar's container
   * @param event event object
   * @param targetElement target element object
   */
  // @HostListener('document:click', ['$event', '$event.target'])
  // outsideClick(event, targetElement: HTMLElement): void {
  //     if (!targetElement) {
  //       return;
  //     }
  //     if (targetElement.classList.contains('ngx-daterangepicker-action')) {
  //       return;
  //     }
  //     const clickedInside = this._el.nativeElement.contains(targetElement);
  //     if (!clickedInside) {
  //        this.hide()
  //     }
  // }



  /** */
  public openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<DaterangepickerComponent>(DaterangepickerComponent,
        this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }


    if (!this._popupRef.hasAttached()) {
      this._popupComponentRef = this._popupRef.attach(this._calendarPortal);
      this.initializeListeners(this._popupComponentRef.instance);
      if (this.value) {
        this.setValueInDateComponent(this._popupComponentRef.instance, this.value);
      }

      // Update the position once the calendar has rendered.
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }
  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: 'ltr',
      panelClass: 'o-daterangepicker-popup',
      scrollStrategy: this.scrollStrategy.close()
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(filter(event => {
        // Closing on alt + up is only valid when there's an input associated with the datepicker.
        return event.keyCode === ESCAPE ||
          (this._el && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(() => this.close());
  }

  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this._el)
      // .withTransformOriginOn('.mat-datepicker-content')
      // .withFlexibleDimensions(false)
      .withViewportMargin(8)
      // .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }


  /** Open the calendar as a dialog. */
  public openAsDialog(): void {
    // Usually this would be handled by `open` which ensures that we can only have one overlay
    // open at a time, however since we reset the variables in async handlers some overlays
    // may slip through if the user opens and closes multiple times in quick succession (e.g.
    // by holding down the enter key).
    if (this._dialogRef) {
      this._dialogRef.close();
    }

    this._dialogRef = this._dialog.open<DaterangepickerComponent>(DaterangepickerComponent, {
      direction: 'ltr',
      viewContainerRef: this._viewContainerRef,
      panelClass: 'mat-datepicker-dialog',
    });

    this.initializeListeners(this._dialogRef.componentInstance);
    if (this.value) {
      this.setValueInDateComponent(this._dialogRef.componentInstance, this.value);
    }
    this._dialogRef.afterClosed().subscribe(() => this.close());
    // this._dialogRef.componentInstance. = this;

  }

  close(): void {
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }

    if (this._dialogRef) {
      this._dialogRef.close();
    }

    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }
  }
}
