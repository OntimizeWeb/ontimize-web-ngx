import { ListRange } from "@angular/cdk/collections";
import { CdkVirtualScrollViewport, VirtualScrollStrategy } from "@angular/cdk/scrolling";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export class CustomVirtualScrollStrategy implements VirtualScrollStrategy {
    private viewport: CdkVirtualScrollViewport;

    private rowHeight!: number;
    private headerHeight!: number;
    private footerHeight!: number;
    public readonly indexChange = new Subject<number>();
    public scrolledIndexChange: Observable<number>;
    public renderedRangeStream = new BehaviorSubject<ListRange>({ start: 0, end: 0 });
    public stickyChange = new Subject<number>();
    buffer: number;
    bufferMultiplier: number = 0.5;

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
        this.viewport.renderedRangeStream.subscribe(this.renderedRangeStream);

        this.onDataLengthChanged();
        this.updateContent();
    }

    public detach(): void {
        this.indexChange.complete();
        this.stickyChange.complete();
        this.renderedRangeStream.complete();
    }
    public onContentRendered(): void {
        // no-op
    }

    public onRenderedOffsetChanged(): void {
        // no-op
    }

    public scrollToIndex(index: number, behavior: ScrollBehavior): void {
        // no-op
    }

    public onContentScrolled(): void {
        this.updateContent();
    }

    public setScrollHeight(rowHeight: number, headerHeight: number, footerHeight: number) {
        this.rowHeight = rowHeight;
        this.headerHeight = headerHeight;
        this.footerHeight = footerHeight;
        this.updateContent();
    }

    public onDataLengthChanged(): void {
        if (this.viewport) {
            this.viewport.setTotalContentSize(this.dataLength * this.rowHeight + this.headerHeight + this.footerHeight);
        }
        this.updateContent();
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