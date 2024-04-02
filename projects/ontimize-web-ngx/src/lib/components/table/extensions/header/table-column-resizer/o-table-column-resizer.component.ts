import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { InputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../column/o-column.class';
import { OTableComponent } from '../../../o-table.component';

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

  protected dragListeners: Array<() => void> = [];
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
  @HostListener('touchstart', ['$event'])
  onMousedown(e: MouseEvent | TouchEvent) {
    if (!this.isDisabled) {
      this.startResize(e);
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
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

  startResize(startEvent: MouseEvent | TouchEvent): void {
    startEvent.preventDefault();
    startEvent.stopPropagation();
    if (!Util.isDefined(this.headerEl)) {
      return;
    }
    const DOMWidth = this.table.getClientWidthColumn(this.column);
    this.startX = (startEvent instanceof MouseEvent) ? startEvent.screenX : startEvent.touches[0].screenX;
    this.startWidth = DOMWidth;
    this.minWidth = this.column.getMinWidthValue();
    this.initializeWidthData();
    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(this.renderer.listen('document', 'mouseup', () => this.stopDragging()));
      this.dragListeners.push(this.renderer.listen('document', 'touchend', () => this.stopDragging()));
    });

    const moveEvent = (startEvent instanceof MouseEvent) ? 'mousemove' : 'touchmove';
    const endEvent = (startEvent instanceof MouseEvent) ? 'mouseup' : 'touchend';
    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(this.renderer.listen('document', moveEvent, (e: MouseEvent | TouchEvent) => this.resizeEvent(e)));
    });
    this.isResizing = true;
  }

  protected resizeEvent(event: MouseEvent | TouchEvent): void {
    if (!this.isResizing) {
      return;
    }
    const movementX = (event instanceof MouseEvent) ? (event.screenX - this.startX) : (event.touches[0].screenX - this.startX);
    if (movementX === 0) {
      return;
    }
    const newColumnWidth = this.startWidth + movementX;

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
    const result: OColumn[] = [];
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
      const DOMWidth = this.table.getClientWidthColumn(oCol);
      if (DOMWidth <= oCol.getMinWidthValue()) {
        self.blockedMinCols.push(oCol.attr);
      }
      const maxW = oCol.getMaxWidthValue();
      if (Util.isDefined(maxW) && DOMWidth >= maxW) {
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
    const widthRatio = movementX / availableCols;
    const cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedMinCols.indexOf(oCol.attr) === -1);
    cols.forEach(oCol => {
      let newWidth = (this.columnsStartWidth[oCol.attr] - widthRatio);
      const minWidth = oCol.getMinWidthValue();
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
      const cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedMaxCols.indexOf(oCol.attr) === -1);
      cols.forEach(oCol => {
        let newWidthValue = (this.columnsStartWidth[oCol.attr] + widthRatio);
        const maxWidth = oCol.getMaxWidthValue();
        if (maxWidth && newWidthValue > maxWidth) {
          const diff = newWidthValue - maxWidth;
          newWidthValue = maxWidth;
          this.blockedMaxCols.push(oCol.attr);
          const notBlocked = this.nextOColumns.length - this.blockedMaxCols.length;
          widthRatio += notBlocked > 0 ? Math.floor(diff / notBlocked) : 0;
        }
        const DOMWidth = this.table.getClientWidthColumn(oCol);
        widthDifference += newWidthValue - DOMWidth;
        oCol.setWidth(newWidthValue);
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
      const DOMWidth = this.table.getClientWidthColumn(col);
      nextColWidthAcum += DOMWidth;
      this.columnsStartWidth[col.attr] = DOMWidth;
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
