import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject, NgZone, OnDestroy, OnInit, Renderer2, ViewEncapsulation, forwardRef } from '@angular/core';
import { OColumn, OTableComponent } from '../../../o-table.component';

import { InputConverter } from '../../../../../decorators';
import { Util } from '../../../../../util/util';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER = [
  'column'
];

export const DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER = [
  // 'resizing',
  // 'resized'
];

@Component({
  selector: 'o-table-column-resizer',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER,
  templateUrl: './o-table-column-resizer.component.html',
  styleUrls: ['./o-table-column-resizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-column-resizer]': 'true',
    '[class.disabled]': 'isDisabled',
  }
})
export class OTableColumnResizerComponent implements OnInit, OnDestroy {
  public static DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER = DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER = DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER;

  column: OColumn;
  @InputConverter()
  disabled: boolean = false;

  // resizing = new EventEmitter<boolean>();
  // resized = new EventEmitter<number>();
  protected startWidth: any;
  protected minWidth: any;
  protected maxWidth: any;

  protected startX: any;

  protected headerEl: any;

  protected nextOColumns: OColumn[];

  protected dragListeners: Array<Function> = [];
  protected isResizing: boolean = false;
  protected blockedMinCols = [];
  protected blockedMaxCols = [];

  protected columnsStartWidth = {};

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected renderer: Renderer2
  ) { }

  ngOnInit(): void {
    if (!this.isDisabled) {
      this.headerEl = this.getHeaderEL();
      if (this.headerEl) {
        this.nextOColumns = this.getFollowingOColumns();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopDragging();
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  get isDisabled(): boolean {
    return this.column && !this.column.resizable;
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(e: MouseEvent) {
    if (!this.isDisabled) {
      this.startResize(e);
    }
  }

  onMouseup() {
    this.isResizing = false;
    this.stopDragging();
    // this.resize.emit(this.element.clientWidth);
  }

  protected stopDragging() {
    this.isResizing = false;
    this.columnsStartWidth = {};
    while (this.dragListeners.length > 0) {
      const fct = this.dragListeners.pop();
      if (fct) {
        fct();
      }
    }
  }

  startResize(startEvent: MouseEvent): void {
    startEvent.preventDefault();
    startEvent.stopPropagation();
    if (!Util.isDefined(this.headerEl)) {
      return;
    }
    this.startX = startEvent.screenX;
    this.startWidth = this.column.DOMWidth;
    this.minWidth = this.column.getMinWidthValue();
    this.initializeWidthData();
    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(this.renderer.listen('document', 'mouseup', (e: MouseEvent) => this.stopDragging()));
    });

    if (!(startEvent instanceof MouseEvent)) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(this.renderer.listen('document', 'mousemove', (e: MouseEvent) => this.resizeEvent(e)));
    });
    this.isResizing = true;
  }

  protected resizeEvent(event: MouseEvent): void {
    if (!this.isResizing || !(event instanceof MouseEvent)) {
      return;
    }
    const movementX = (event.screenX - this.startX);
    if (movementX === 0) {
      return;
    }
    let newColumnWidth = this.startWidth + movementX;

    const lessThanMin = newColumnWidth < this.minWidth;
    const moreThanMax = newColumnWidth > this.maxWidth;
    if (lessThanMin || moreThanMax) {
      return;
    }
    if (!this.table.horizontalScroll) {
      this.calculateNewColumnsWidth(movementX, newColumnWidth);
      this.updateBlockedCols();
    } else {
      this.column.setWidth(newColumnWidth);
    }
    this.table.cd.detectChanges();
  }

  protected getHeaderEL(): Node {
    let element;
    let currentEl: Node = this.elRef.nativeElement.parentElement;
    while (!element && currentEl) {
      if (currentEl.nodeName === 'TH') {
        element = currentEl;
      } else {
        currentEl = currentEl.parentElement;
      }
    }
    return currentEl;
  }

  protected getFollowingOColumns(): OColumn[] {
    let result: OColumn[] = [];
    let nextTh: any = this.headerEl.nextSibling;
    const self = this;
    while (nextTh) {
      const oCol: OColumn = self.table.getOColumnFromTh(nextTh);
      if (Util.isDefined(oCol)) {
        result.push(oCol);
      }
      nextTh = nextTh.nextSibling;
    }
    return result;
  }

  protected updateBlockedCols() {
    const self = this;
    this.blockedMinCols = [];
    this.blockedMaxCols = [];
    const columns = [this.column, ...this.nextOColumns];
    columns.forEach(oCol => {
      if (oCol.DOMWidth <= oCol.getMinWidthValue()) {
        self.blockedMinCols.push(oCol.attr);
      }
      const maxW = oCol.getMaxWidthValue();
      if (Util.isDefined(maxW) && oCol.DOMWidth >= maxW) {
        self.blockedMaxCols.push(oCol.attr);
      }
    });
  }

  protected calculateNewColumnsWidth(movementX: number, newColumnWidth: number) {
    const positive = (movementX > 0);
    if (positive) {
      this.calculateUsingNextColumnsRestrictions(movementX, newColumnWidth);
    } else {
      this.calculateUsingOwnColumnRestriction(movementX, newColumnWidth);
    }
  }

  protected calculateUsingNextColumnsRestrictions(movementX: number, newColumnWidth: number) {
    const availableCols = this.nextOColumns.length - this.blockedMinCols.length;
    if (availableCols <= 0) {
      return;
    }
    let widthRatio = movementX / availableCols;
    let cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedMinCols.indexOf(oCol.attr) === -1);
    cols.forEach(oCol => {
      let newWidth = (this.columnsStartWidth[oCol.attr] - widthRatio);
      let minWidth = oCol.getMinWidthValue();
      if (newWidth <= minWidth) {
        newWidth = minWidth;
        this.blockedMinCols.push(oCol.attr);
      }
      oCol.setWidth(newWidth);
    });
    this.column.setWidth(newColumnWidth);
  }

  protected calculateUsingOwnColumnRestriction(movementX: number, newColumnWidth: number) {
    let widthRatio = Math.abs(movementX) / this.nextOColumns.length;
    let widthDifference = 0;
    if (widthRatio > 0 && this.blockedMaxCols.length < this.nextOColumns.length) {
      let cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedMaxCols.indexOf(oCol.attr) === -1);
      cols.forEach(oCol => {
        let newWidth = (this.columnsStartWidth[oCol.attr] + widthRatio);
        let maxWidth = oCol.getMaxWidthValue();
        if (maxWidth && newWidth > maxWidth) {
          const diff = newWidth - maxWidth;
          newWidth = maxWidth;
          this.blockedMaxCols.push(oCol.attr);
          const notBlocked = this.nextOColumns.length - this.blockedMaxCols.length;
          widthRatio += notBlocked > 0 ? Math.floor(diff / notBlocked) : 0;
        }
        widthDifference += newWidth - oCol.DOMWidth;
        oCol.setWidth(newWidth);
      });
    }
    const newWidth = Math.min(this.startWidth - widthDifference, newColumnWidth);
    this.column.setWidth(newWidth);
  }

  protected initializeWidthData() {
    let maxWidth = this.column.getMaxWidthValue();
    let nextColMinWidthAcum = 0;
    let nextColWidthAcum = 0;
    this.nextOColumns.forEach((col: OColumn) => {
      nextColMinWidthAcum += col.getMinWidthValue();
      nextColWidthAcum += col.DOMWidth;
      this.columnsStartWidth[col.attr] = col.DOMWidth;
    });
    const calcMaxWidth = this.headerEl.clientWidth + (nextColWidthAcum - nextColMinWidthAcum);
    if (Util.isDefined(maxWidth)) {
      maxWidth = Math.min(maxWidth, calcMaxWidth);
    } else {
      maxWidth = calcMaxWidth;
    }
    this.maxWidth = maxWidth;
  }
}
