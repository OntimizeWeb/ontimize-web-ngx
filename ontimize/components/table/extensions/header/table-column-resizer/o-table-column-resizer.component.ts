import { Component, ChangeDetectionStrategy, Renderer2, ViewEncapsulation, forwardRef, Inject, ElementRef, OnInit, HostListener, NgZone, OnDestroy } from '@angular/core';
import { InputConverter } from '../../../../../decorators';
import { Util } from '../../../../../util/util';
import { OColumn, OTableComponent } from '../../../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER = [
  'column',
  'disabled'
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
    '[class.disabled]': 'disabled',
  }
})
export class OTableColumnResizerComponent implements OnInit, OnDestroy {
  public static DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER = DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER = DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER;

  public static FIRST_LAST_CELL_PADDING = 24;
  public static DEFAULT_COLUMN_MIN_WIDTH = 80;

  column: OColumn;
  @InputConverter()
  disabled: boolean = false;

  // resizing = new EventEmitter<boolean>();
  // resized = new EventEmitter<number>();

  protected startX: any;
  protected endX: any;

  protected startWidth: number;
  protected headerEl: any;

  protected nextOColumns: OColumn[];
  protected nextColumnsWidth: any = {};
  protected columnsMinWidth: any = {};
  protected newColumnsWidth: any = {};

  protected dragListeners: Array<Function> = [];
  protected isResizing: boolean = false;
  protected resizingWithoutMove: boolean = false;
  protected blockedCols = [];

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected elRef: ElementRef,
    protected ngZone: NgZone,
    protected renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.headerEl = this.getHeaderEL();
    if (!this.table.horizontalScroll && this.headerEl) {
      this.nextOColumns = this.getFollowingOColumns();
    }
    let minWidth = parseInt(this.column.minWidth);
    minWidth = isNaN(minWidth) ? OTableColumnResizerComponent.DEFAULT_COLUMN_MIN_WIDTH : minWidth;
    this.columnsMinWidth[this.column.attr] = minWidth;
  }

  ngOnDestroy(): void {
    this.stopDragging();
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('pointerdown', ['$event'])
  onmousedown(e: MouseEvent) {
    this.startResize(e);
  }

  startResize(startEvent: MouseEvent): void {
    startEvent.preventDefault();
    startEvent.stopPropagation();
    if (!Util.isDefined(this.headerEl)) {
      return;
    }

    this.startX = startEvent.x;
    this.endX = undefined;
    this.startWidth = this.headerEl.clientWidth;

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

    let moveDiff = (event.x - this.startX);
    if (Util.isDefined(this.endX)) {
      moveDiff = event.x - this.endX;
    }
    this.resizingWithoutMove = false;
    let newColumnWidth = this.startWidth + moveDiff;
    if ((moveDiff === 0) || (newColumnWidth < this.columnsMinWidth[this.column.attr])) {
      return;
    }
    this.startWidth = newColumnWidth;
    if (!this.table.horizontalScroll) {
      this.calculateFollowingColumnsWidth();
      this.calculateNewColumnsWidth(newColumnWidth, moveDiff);
      const self = this;
      newColumnWidth = this.newColumnsWidth[this.column.attr];
      this.nextOColumns.forEach((oCol: OColumn) => {
        oCol.width = self.newColumnsWidth[oCol.attr] + 'px';
        self.nextColumnsWidth[oCol.attr] = self.newColumnsWidth[oCol.attr];
      });
    }
    this.column.width = newColumnWidth + 'px';
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
    this.nextColumnsWidth = {};
    this.newColumnsWidth = {};
    this.blockedCols = [];

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
      const classList: any = (nextTh as Element).classList || [];
      classList.forEach((className: string) => {
        if (className.startsWith('mat-column-')) {
          const attr = className.substr('mat-column-'.length);
          const oCol = self.table.getOColumn(attr);
          if (oCol) {
            result.push(oCol);
            let minWidth = parseInt(oCol.minWidth);
            minWidth = isNaN(minWidth) ? OTableColumnResizerComponent.DEFAULT_COLUMN_MIN_WIDTH : minWidth;
            const colPadding = (nextTh.nextSibling) ? 0 : OTableColumnResizerComponent.FIRST_LAST_CELL_PADDING;
            self.columnsMinWidth[attr] = minWidth - colPadding;
          }
        }
      });
      nextTh = nextTh.nextSibling;
    }
    return result;
  }

  protected calculateFollowingColumnsWidth() {
    let nextTh: any = this.headerEl.nextSibling;
    const self = this;
    while (nextTh) {
      const classList: any = (nextTh as Element).classList || [];
      classList.forEach((className: string) => {
        if (className.startsWith('mat-column-')) {
          const attr = className.substr('mat-column-'.length);
          const oCol = self.table.getOColumn(attr);
          if (oCol) {
            const colPadding = (nextTh.nextSibling) ? 0 : OTableColumnResizerComponent.FIRST_LAST_CELL_PADDING;
            self.nextColumnsWidth[attr] = nextTh.clientWidth - colPadding;
          }
        }
      });
      nextTh = nextTh.nextSibling;
    }
  }

  protected calculateNewColumnsWidth(newColumnWidth: number, diff: number) {
    const positive = (diff > 0);
    if (positive) {
      this.calculateUsingNextColumnsRestrictions(newColumnWidth, diff);
    } else {
      this.calculateUsingOwnColumnRestriction(newColumnWidth, diff);
    }
  }

  protected calculateUsingOwnColumnRestriction(newColumnWidth: number, moveDiff: number) {
    let widthRatio = Math.floor(moveDiff / this.nextOColumns.length);
    if (widthRatio === 0) {
      return;
    }
    this.nextOColumns.forEach((oCol: OColumn, index: number) => {
      let newWidth = (this.nextColumnsWidth[oCol.attr] + widthRatio);
      this.newColumnsWidth[oCol.attr] = newWidth;
    });
    this.newColumnsWidth[this.column.attr] = newColumnWidth;
  }

  protected calculateUsingNextColumnsRestrictions(newColumnWidth: number, moveDiff: number) {
    let widthRatio = Math.floor(moveDiff / this.nextOColumns.length);
    let remainWidth = Math.abs(moveDiff);
    while (remainWidth > 0 && this.blockedCols.length < this.nextOColumns.length) {
      let cols = this.nextOColumns.filter((oCol: OColumn) => this.blockedCols.indexOf(oCol.attr) === -1);
      let acum = 0;
      cols.forEach((oCol: OColumn, index: number) => {
        let newWidth = (this.nextColumnsWidth[oCol.attr] - widthRatio);
        let minWidth = this.columnsMinWidth[oCol.attr];
        if (newWidth <= minWidth) {
          acum += minWidth - newWidth;
          newWidth = minWidth;
          this.blockedCols.push(oCol.attr);
          widthRatio += Math.floor(acum / (this.nextOColumns.length - this.blockedCols.length));
        }
        remainWidth -= newWidth;
        this.newColumnsWidth[oCol.attr] = newWidth;
      });
    }
    // this.newColumnsWidth[this.column.attr] = newColumnWidth;
  }
}
