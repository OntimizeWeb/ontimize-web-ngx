import { CdkVirtualScrollViewport, VirtualScrollStrategy } from "@angular/cdk/scrolling";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export class CustomVirtualScrollStrategy implements VirtualScrollStrategy {
    private viewport: CdkVirtualScrollViewport;
    public readonly indexChange = new Subject<number>();
    private scrollHeight!: number;
    private scrollHeader!: number;
    public scrolledIndexChange: Observable<number>;

    constructor() {
        this.scrolledIndexChange = this.indexChange.asObservable().pipe(distinctUntilChanged());

    }

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
        // no-op
    }

    public onContentScrolled(): void {
        this.updateContent(this.viewport);
    }

    public setScrollHeight(rowHeight: number, headerHeight: number) {
        this.scrollHeight = rowHeight;
        this.scrollHeader = headerHeight;
        this.updateContent(this.viewport);
    }
    public onDataLengthChanged(): void {
        if (this.viewport) {
            console.log('onDataLengthChanged', this.viewport.getDataLength());
            this.viewport.setTotalContentSize(this.viewport.getDataLength() * this.scrollHeight);
        }
    }

    private updateContent(viewport: CdkVirtualScrollViewport) {
        if (this.viewport) {
            const newIndex = Math.max(0, Math.round((viewport.measureScrollOffset() - this.scrollHeader) / this.scrollHeight) - 2);
            console.log('viewport.measureScrollOffset() ', viewport.measureScrollOffset(), newIndex, this.viewport.getRenderedRange());
            viewport.setRenderedContentOffset(this.scrollHeight * newIndex);
            this.indexChange.next(
                Math.round((viewport.measureScrollOffset() - this.scrollHeader) / this.scrollHeight) + 1
            );
        }
    }
}