import { AfterViewInit, Directive, ElementRef, forwardRef, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { OTableBase } from '../../o-table-base.class';


@Directive({
  selector: '[oTableRow]'
})
export class OTableRowDirective implements AfterViewInit, OnDestroy {
  protected resizeSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => OTableBase)) public table: OTableBase,
    protected elementRef: ElementRef,
    protected renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    this.registerResize();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  registerResize() {
    if (this.table.horizontalScroll) {
      const self = this;
      this.table.onUpdateScrolledState.subscribe(scrolled => {
        setTimeout(() => {
          if (scrolled) {
            self.calculateRowWidth();
          } else {
            self.setRowWidth(undefined);
          }
        }, 0);
      });
    }
  }

  calculateRowWidth() {
    if (!this.table.horizontalScroll) {
      return;
    }
    if (this.alreadyScrolled) {
      this.setRowWidth(this.table.rowWidth);
    }
    let totalWidth: number = 0;
    try {
      this.elementRef.nativeElement.childNodes.forEach(element => {
        if (element && element.tagName && element.tagName.toLowerCase() === 'mat-cell') {
          totalWidth += element.clientWidth;
        }
      });
    } catch (error) {
      //
    }
    if (!isNaN(totalWidth) && totalWidth > 0) {
      totalWidth += 48;
      this.setRowWidth(totalWidth);
    }
  }

  setRowWidth(value: number) {
    const widthValue = value !== undefined ? value + 'px' : 'auto';
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', widthValue);
    this.table.rowWidth = value;
  }

  get alreadyScrolled(): boolean {
    return this.table.rowWidth !== undefined;
  }

}
