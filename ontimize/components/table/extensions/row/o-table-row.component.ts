import { Component, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit, forwardRef, Inject, ElementRef, OnDestroy, Renderer } from '@angular/core';
import { MatRow } from '@angular/material';
import { CDK_ROW_TEMPLATE } from '@angular/cdk/table';
import { Subscription } from 'rxjs/Subscription';
import { OTableComponent } from '../../o-table.component';

@Component({
  selector: 'o-table-row',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'mat-row',
    'role': 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'oTableRow'
})
export class OTableRow extends MatRow implements AfterViewInit, OnDestroy {
  protected resizeSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected elementRef: ElementRef,
    protected renderer: Renderer
  ) {
    super();
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
        setTimeout(function () {
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
    this.renderer.setElementStyle(this.elementRef.nativeElement, 'width', widthValue);
    this.table.rowWidth = value;
  }

  get alreadyScrolled(): boolean {
    return this.table.rowWidth !== undefined;
  }

}
