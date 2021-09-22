import { CdkVirtualScrollViewport, VirtualScrollStrategy } from "@angular/cdk/scrolling";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export class OTableVirtualScrollStrategy implements VirtualScrollStrategy {
  private viewport: CdkVirtualScrollViewport;

  private rowHeight!: number;
  private headerHeight!: number;
  private footerHeight!: number;
  public readonly indexChange = new Subject<number>();
  public scrolledIndexChange: Observable<number>;
  public stickyChange = new Subject<number>();
  buffer: number;
  bufferMultiplier: number = 1;

  constructor() {
    this.scrolledIndexChange = this.indexChange.asObservable().pipe(distinctUntilChanged());
  }

  get dataLength(): number {
    return this._dataLength;
  }

  set dataLength(value: number) {
    this._dataLength = value;
    this.onDataLengthChanged();
  }

  private _dataLength = 0;

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.onDataLengthChanged();
    this.updateContent();
  }

  public detach(): void {
    //no-op
  }

  public destroy(): void {
    this.indexChange.complete();
    this.stickyChange.complete();
  }

  public onContentRendered(): void {
    // no-op
  }

  public onRenderedOffsetChanged(): void {
    // no-op
  }

  public scrollToIndex(index: number, behavior?: ScrollBehavior): void {
    // no-op
  }

  public onContentScrolled(): void {
    this.updateContent();
  }

  public setConfig(rowHeight: number, headerHeight: number, footerHeight: number) {
    if (
      (this.rowHeight === rowHeight
        && this.headerHeight === headerHeight
        && this.footerHeight === footerHeight) || rowHeight === 0
    ) {
      return;
    }
    this.rowHeight = rowHeight;
    this.headerHeight = headerHeight;
    this.footerHeight = footerHeight;
    //if change heights, then update content size
    this.onDataLengthChanged();
  }

  public onDataLengthChanged(): void {
    if (this.viewport) {
      this.viewport.setTotalContentSize(this.dataLength * this.rowHeight + this.headerHeight + this.footerHeight);
      this.viewport.scrollToOffset(0);//set scroll up
      this.updateContent();
    }
  }

  private updateContent() {
    if (!this.viewport || !this.rowHeight) {
      return;
    }
    const scrollOffset = this.viewport.measureScrollOffset();
    const amount = Math.ceil(this.viewport.getViewportSize() / this.rowHeight);
    const offset = Math.max(scrollOffset - this.headerHeight, 0);
    const buffer = Math.ceil(amount * this.bufferMultiplier);

    const skip = Math.round(offset / this.rowHeight);
    const index = Math.max(0, skip);
    const start = Math.max(0, index - buffer);
    const end = Math.min(this.dataLength, index + amount + buffer);
    const renderedOffset = start * this.rowHeight;

    this.viewport.setRenderedContentOffset(renderedOffset);
    this.viewport.setRenderedRange({ start, end });
    this.indexChange.next(index);
    this.stickyChange.next(renderedOffset);
  }
}