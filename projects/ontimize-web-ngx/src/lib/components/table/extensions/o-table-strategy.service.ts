import { CdkVirtualScrollViewport, VirtualScrollStrategy } from "@angular/cdk/scrolling";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable()
export class OTableVirtualScrollStrategy implements VirtualScrollStrategy {
  private viewport: CdkVirtualScrollViewport;

  private rowHeight!: number;
  private headerHeight!: number;
  private footerHeight!: number;
  private readonly indexChange = new Subject<number>();
  public scrolledIndexChange: Observable<number> = this.indexChange.pipe(distinctUntilChanged());
  public readonly stickyChange = new Subject<number>();
  private bufferMultiplier: number = 1;

  get dataLength(): number {
    return this._dataLength;
  }

  set dataLength(value: number) {
    this._dataLength = value;
    this.onDataLengthChanged();
  }

  private _dataLength = 0;

  public attach(viewport: CdkVirtualScrollViewport): void {
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
      this.rowHeight === rowHeight
      && this.headerHeight === headerHeight
      && this.footerHeight === footerHeight
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
    if (!this.viewport || !this.rowHeight || this.dataLength === 0) {
      return;
    }
    const scrollOffset = this.viewport.measureScrollOffset();
    const itemsDisplayed = Math.ceil(this.viewport.getViewportSize() / this.rowHeight);
    const renderedOffset = this.viewport.getOffsetToRenderedContentStart();
    const start = renderedOffset / this.rowHeight;
    const bufferItems = Math.ceil(itemsDisplayed * this.bufferMultiplier);
    const bufferOffset = renderedOffset + bufferItems * this.rowHeight;

    const relativeScrollOffset = scrollOffset - bufferOffset;// How far the scroll offset is from the lower buffer, which is usually where items start being displayed
    const rowsScrolled = relativeScrollOffset / this.rowHeight;

    const displayed = scrollOffset / this.rowHeight;
    this.indexChange.next(displayed);

    const rowsToMove = Math.sign(rowsScrolled) * Math.floor(Math.abs(rowsScrolled));

    const adjustedRenderedOffset = Math.max(0, renderedOffset + rowsToMove * this.rowHeight);
    this.viewport.setRenderedContentOffset(adjustedRenderedOffset);

    const adjustedStart = Math.max(0, start + rowsToMove);
    const adjustedEnd = adjustedStart + itemsDisplayed + bufferItems;
    this.viewport.setRenderedRange({ start: adjustedStart, end: adjustedEnd });
    this.stickyChange.next(adjustedRenderedOffset);
  }
}