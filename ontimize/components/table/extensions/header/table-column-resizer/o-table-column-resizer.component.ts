import { Component, ChangeDetectionStrategy, Renderer2, ViewEncapsulation, forwardRef, Inject, ElementRef, OnInit, HostListener, NgZone, OnDestroy } from '@angular/core';
import { InputConverter } from '../../../../../decorators';
import { Util } from '../../../../../util/util';
import { OColumn, OTableComponent } from '../../../o-table.component';

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

  protected startX: any;
  protected endX: any;

  protected headerEl: any;

  protected nextOColumns: OColumn[];

  protected dragListeners: Array<Function> = [];
  protected isResizing: boolean = false;
  protected resizingWithoutMove: boolean = false;
  protected blockedMinCols = [];
  protected blockedMaxCols = [];

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected renderer: Renderer2
  ) { }

  ngOnInit(): void {
    if (!this.isDisabled) {
      this.headerEl = this.getHeaderEL();
      if (!this.table.horizontalScroll && this.headerEl) {
        this.nextOColumns = this.getFollowingOColumns();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopDragging();
  }

  get isDisabled(): boolean {
    return this.column && !this.column.resizable;
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('pointerdown', ['$event'])
  onmousedown(e: MouseEvent) {
    if (!this.isDisabled) {
      this.startResize(e);
    }
  }

  startResize(startEvent: MouseEvent): void {
    startEvent.preventDefault();
    startEvent.stopPropagation();
    if (!Util.isDefined(this.headerEl)) {
      return;
    }
    this.startX = startEvent.x;
    this.endX = undefined;

    this.resizingWithoutMove = true;
    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(this.renderer.listen('document', 'mouseup', (e: MouseEvent) => this.stopDragging()));
      this.dragListeners.push(this.renderer.listen('document', 'pointerup', (e: MouseEvent) => this.stopDragging()));
    });

    if (!(startEvent instanceof MouseEvent)) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(this.renderer.listen('document', 'mousemove', (e: MouseEvent) => this.resizeEvent(e)));
      this.dragListeners.push(this.renderer.listen('document', 'pointermove', (e: MouseEvent) => this.resizeEvent(e)));
    });

    this.isResizing = true;
  }

  protected resizeEvent(event: MouseEvent): void {
    if (!this.isResizing) {
      return;
    }

    if (!(event instanceof MouseEvent)) {
      return;
    }
    this.resizingWithoutMove = false;

    const colPadding = (this.headerEl.previousElementSibling) ? 0 : OTableComponent.FIRST_LAST_CELL_PADDING;
    let startWidth = this.headerEl.clientWidth - colPadding;

    let moveDiff = (event.x - this.startX);
    if (Util.isDefined(this.endX)) {
      moveDiff = event.x - this.endX;
    }
    let newColumnWidth = startWidth + moveDiff;
    const lessThanMin = (newColumnWidth < this.column.getMinWidthValue());
    const maxW = this.column.getMaxWidthValue();
    const moreThanMax = maxW && (newColumnWidth > maxW);
    if (moveDiff === 0 || lessThanMin || moreThanMax) {
      return;
    }
    if (!this.table.horizontalScroll) {
      this.updateBlockedCols();
      this.calculateNewColumnsWidth(startWidth, newColumnWidth, moveDiff);
    } else {
      this.column.setWidth(newColumnWidth);
    }
    this.table.cd.detectChanges();
    this.endX = event.x - 1;
  }

  protected stopDragging(): void {
    if (this.isResizing === false && this.resizingWithoutMove === false) {
      return;
    }

    while (this.dragListeners.length > 0) {
      const fct = this.dragListeners.pop();
      if (fct) {
        fct();
      }
    }
    this.isResizing = false;
    this.resizingWithoutMove = false;
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
    this.nextOColumns.forEach(oCol => {
      if (oCol.DOMWidth <= oCol.getMinWidthValue()) {
        self.blockedMinCols.push(oCol.attr);
      }
    });
    this.table.oTableOptions.columns.forEach(oCol => {
      const maxW = oCol.getMaxWidthValue();
      if (Util.isDefined(maxW) && oCol.DOMWidth >= maxW) {
        self.blockedMaxCols.push(oCol.attr);
      }
    });
  }

  protected calculateNewColumnsWidth(startWidth: number, newColumnWidth: number, diff: number) {
    const positive = (diff > 0);
    if (positive) {
      this.calculateUsingNextColumnsRestrictions(startWidth, newColumnWidth, diff);
    } else {
      this.calculateUsingOwnColumnRestriction(startWidth, newColumnWidth, diff);
    }
  }

  protected calculateUsingNextColumnsRestrictions(startWidth: number, newColumnWidth: number, moveDiff: number) {
    let widthRatio = Math.floor(moveDiff / this.nextOColumns.length);
    let remainWidth = Math.abs(moveDiff);
    if (widthRatio > 0) {
      let widthDifference = 0;
      while (remainWidth > 0 && this.blockedMinCols.length < this.nextOColumns.length) {
        let cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedMinCols.indexOf(oCol.attr) === -1);
        cols.forEach(oCol => {
          let newWidth = (oCol.DOMWidth - widthRatio);
          let minWidth = oCol.getMinWidthValue();
          if (newWidth <= minWidth) {
            newWidth = minWidth;
            this.blockedMinCols.push(oCol.attr);
          }
          remainWidth -= newWidth;
          widthDifference += oCol.DOMWidth - newWidth;

          oCol.setWidth(newWidth);
        });
      }
      const newWidth = Math.min(startWidth + widthDifference, newColumnWidth);
      this.column.setWidth(newWidth);
    }
  }

  protected calculateUsingOwnColumnRestriction(startWidth: number, newColumnWidth: number, moveDiff: number) {
    let remainWidth = Math.abs(moveDiff);
    let widthRatio = Math.floor(remainWidth / this.nextOColumns.length);

    if (widthRatio > 0) {
      let widthDifference = 0;
      while (remainWidth > 0 && this.blockedMaxCols.length < this.nextOColumns.length) {
        let cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedMaxCols.indexOf(oCol.attr) === -1);

        cols.forEach(oCol => {
          let newWidth = (oCol.DOMWidth + widthRatio);
          let maxWidth = oCol.getMaxWidthValue();
          if (maxWidth && newWidth > maxWidth) {
            const diff = newWidth - maxWidth;
            newWidth = maxWidth;
            this.blockedMaxCols.push(oCol.attr);
            const notBlocked = this.nextOColumns.length - this.blockedMaxCols.length;
            widthRatio += notBlocked > 0 ? Math.floor(diff / notBlocked) : 0;
          }
          remainWidth -= newWidth;
          widthDifference += newWidth - oCol.DOMWidth;

          oCol.setWidth(newWidth);
        });
      }
      const newWidth = Math.min(startWidth - widthDifference, newColumnWidth);
      this.column.setWidth(newWidth);
    }
  }
}
