import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { Util } from '../../../../util/util';
import { OSkeletonComponent } from '../../../o-skeleton.component';


@Component({
  standalone: true,
  imports: [AsyncPipe, NgxSkeletonLoaderModule],
  selector: 'o-table-skeleton',
  templateUrl: './o-table-skeleton.component.html',
  styleUrls: ['./o-table-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-skeleton]': 'true'
  }

})
export class OTableSkeletonComponent extends OSkeletonComponent  {

  getRows() {

    const parentElement = this.elRef.nativeElement.parentElement;
    if (!parent) return [];

    /* available parentHeight = parentElement height  - (header table header height + margin bottom)*/
    const header = parentElement.querySelector('div.o-table-skeleton-header');
    const item = parentElement.querySelector('div.o-table-skeleton-item');

    const totalHeightHeader = this.getElementTotalHeight(header);
    const totalHeightItem = this.getElementTotalHeight(item);

    if (!totalHeightItem) return [];

    const parentHeight = parentElement?.offsetHeight - totalHeightHeader;
    if (!Util.isDefined(parentHeight) || parentHeight < 0) {
      return [];
    }

    return Array.from(new Array(Math.floor(parentHeight / totalHeightItem)), (x, i) => i + 1);

  }

  private getElementTotalHeight(element: HTMLElement | null): number {
    if (!element) return 0;

    const styles = getComputedStyle(element);
    const height = element.offsetHeight || 0;
    const marginTop = Number.parseFloat(styles.marginTop) || 0;
    const marginBottom = Number.parseFloat(styles.marginBottom) || 0;

    return height + marginTop + marginBottom;
  }

}
