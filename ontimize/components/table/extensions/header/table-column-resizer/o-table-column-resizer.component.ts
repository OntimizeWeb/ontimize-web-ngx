import { Component, ChangeDetectionStrategy, Renderer2, ViewEncapsulation, forwardRef, Inject, ElementRef, OnInit } from '@angular/core';
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
export class OTableColumnResizerComponent implements OnInit {
  public static DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER = DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER;
  public static DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER = DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER;

  public static FIRST_LAST_CELL_PADDING = 24;

  column: OColumn;
  @InputConverter()
  disabled: boolean = false;

  // resizing = new EventEmitter<boolean>();
  // resized = new EventEmitter<number>();

  protected pressed: boolean = false;
  protected startX: any;
  protected startWidth: number;
  protected headerEl: any;

  protected nextOColumns: OColumn[];
  protected nextColumnsWidth: any = {};

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected elRef: ElementRef,
    public renderer: Renderer2
  ) {

  }

  ngOnInit(): void {
    this.headerEl = this.getHeaderEL();
    if (!this.table.horizontalScroll && this.headerEl) {
      this.nextOColumns = this.getFollowingOColumns();
    }
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
          }
        }
      });
      nextTh = nextTh.nextSibling;
    }
    return result;
  }

  protected updateFollowingColumnsWidth() {
    let nextTh: any = this.headerEl.nextSibling;
    const self = this;
    while (nextTh) {
      const classList: any = (nextTh as Element).classList || [];
      classList.forEach((className: string) => {
        if (className.startsWith('mat-column-')) {
          const attr = className.substr('mat-column-'.length);
          const oCol = self.table.getOColumn(attr);
          if (oCol) {
            self.nextColumnsWidth[attr] = nextTh.clientWidth;
          }
        }
      });
      nextTh = nextTh.nextSibling;
    }
  }

  onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!Util.isDefined(this.headerEl)) {
      return;
    }
    this.startWidth = this.headerEl.clientWidth;
    if (this.headerEl.isSameNode(this.headerEl.parentElement.firstElementChild)) {
      // substracting padding, only existing in the first column
      this.startWidth -= OTableColumnResizerComponent.FIRST_LAST_CELL_PADDING;
    }
    this.pressed = true;
    this.startX = event.x;
    this.updateFollowingColumnsWidth();
    this.setResizeListeners();
  }

  protected setResizeListeners() {
    this.renderer.listen('body', 'mousemove', this.onMouseMove.bind(this));
    const self = this;
    this.renderer.listen('body', 'mouseup', (event) => {
      if (self.pressed) {
        self.pressed = false;
        self.nextColumnsWidth = {};
      }
    });
  }

  protected onMouseMove(event) {
    const self = this;
    if (!self.pressed) {
      return;
    }
    const diff = (event.x - self.startX);
    const width = self.startWidth + diff;
    let minWidth = 0;
    if (width > minWidth) {
      self.column.width = width + 'px';
      if (!self.table.horizontalScroll) {
        const widthRatio = diff / self.nextOColumns.length;
        self.nextOColumns.forEach((oCol: OColumn, index: number) => {
          const lastCol = (index === self.nextOColumns.length - 1) ? OTableColumnResizerComponent.FIRST_LAST_CELL_PADDING : 0;
          const newWidth = (self.nextColumnsWidth[oCol.attr] - lastCol - widthRatio);
          oCol.width = newWidth + 'px';
        });
      }
    }
  }


}
