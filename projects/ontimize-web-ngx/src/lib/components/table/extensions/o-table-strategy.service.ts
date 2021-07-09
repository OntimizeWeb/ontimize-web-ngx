import { CdkVirtualScrollViewport, VirtualScrollStrategy } from "@angular/cdk/scrolling";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export class CustomVirtualScrollStrategy implements VirtualScrollStrategy {
    private viewport: CdkVirtualScrollViewport;
    public readonly indexChange = new Subject<number>();
    private rowHeight!: number;
    private headerHeight!: number;
    private footerHeight!: number;
    public scrolledIndexChange: Observable<number>;
    public amount!: number;
    public offset!: number;
    buffer: number;

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
        this.updateContent(viewport);
    }

    public detach(): void {
        // no-op
    }
    public onContentRendered(): void {
        // no-op
    }

    public onRenderedOffsetChanged(): void {
        // no-op
    }

    public scrollToIndex(index: number, behavior: ScrollBehavior): void {
        // if (!this.viewport || !this.rowHeight) {
        //     return;
        //   }
        //   this.viewport.scrollToOffset((index - 1 ) * this.rowHeight + this.headerHeight, behavior);
    }

    public onContentScrolled(): void {
        this.updateContent(this.viewport);
    }

    public setScrollHeight(rowHeight: number, headerHeight: number, footerHeight: number) {
        this.rowHeight = rowHeight;
        this.headerHeight = headerHeight;
        this.footerHeight = footerHeight;
        this.updateContent(this.viewport);
    }

    public onDataLengthChanged(): void {
        if (this.viewport) {
            this.viewport.setTotalContentSize(this.dataLength * this.rowHeight);
        }
    }

    private updateContent(viewport: CdkVirtualScrollViewport) {
        if (this.viewport && this.rowHeight) {
            const newIndex = Math.max(0, Math.round((viewport.measureScrollOffset() - this.headerHeight) / this.rowHeight) - 2);
            const itemsByViewport = Math.ceil(this.viewport.getViewportSize() / this.rowHeight);

            //if header is fixed, then set top Offset 
            this.offset = newIndex * this.rowHeight;
            this.buffer = itemsByViewport / 2
            this.amount = Math.ceil(itemsByViewport);

            viewport.setRenderedContentOffset(this.rowHeight * newIndex);

            console.log('newIndex: ', newIndex, ' itemsByViewport:', itemsByViewport, ' offset: ', this.offset, ' setRenderedContentOffset: ', this.rowHeight * newIndex, ' indexChange ', Math.round((viewport.measureScrollOffset() - this.headerHeight) / this.rowHeight) + 1)
            this.indexChange.next(

                Math.round((viewport.measureScrollOffset() - this.headerHeight) / this.rowHeight)

            );

            // const scrollOffset = this.viewport.measureScrollOffset();
            // this.amount = Math.ceil(this.viewport.getViewportSize() / this.rowHeight);
            // const offset = Math.max(scrollOffset - this.headerHeight, 0);

            // const buffer = Math.ceil(this.amount * 0.5);


            // const skip = Math.round(this.offset / this.rowHeight);
            // const index = Math.max(0, skip);
            // const start = Math.max(0, index - buffer);
            // const renderedOffset = start * this.rowHeight;
            // const end = Math.min(this.dataLength, index + this.amount);
            // this.amount += buffer*2;
            // this.offset =  start * this.rowHeight;
            // console.log('start: ', start, 'end :', end)
            // console.log('scrollOffset: ', scrollOffset, ' amount:', this.amount, ' offset: ', this.offset, ' renderedOffset: ', renderedOffset, ' indexChange ', index)
            // this.viewport.setRenderedContentOffset(renderedOffset);
            // this.viewport.setRenderedRange({ start, end });
            // this.indexChange.next(start);
        }
    }
}