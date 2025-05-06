import { Component, ViewEncapsulation } from '@angular/core';

import { Util } from '../../../util/util';
import { OSkeletonComponent } from '../../o-skeleton.component';

@Component({
  selector: 'o-list-skeleton',
  templateUrl: './o-list-skeleton.component.html',
  styleUrls: ['./o-list-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-skeleton]': 'true'
  }
})
export class OListSkeletonComponent extends OSkeletonComponent  {

  getRows() {
    const parentElement = this.elRef.nativeElement.parentElement;

    // Find the skeleton item element inside the parent
    const item = parentElement.querySelector('div.o-list-skeleton-item');

    let totalHeightItem: number = 0;

    if (item) {
      // Get the element's dimensions and computed styles
      const itemComputedStyle = getComputedStyle(item);
      const height = item.offsetHeight; // Height including padding
      const marginBottom = parseFloat(itemComputedStyle.marginBottom); // Bottom margin
      const marginTop = parseFloat(itemComputedStyle.marginTop); // Top margin

      // Calculate the total vertical space taken by the item
      totalHeightItem = height + marginBottom + marginTop;
    }

    // Calculate the available height in the parent container (excluding one item height)
    const availableHeight = parentElement?.offsetHeight - totalHeightItem;
    if (!Util.isDefined(availableHeight) || availableHeight < 0) {
      return [];
    }

    // Return an array with the number of items that can fit within the parent's height
    return Array.from(
      new Array(Math.ceil(parentElement?.offsetHeight / totalHeightItem)),
      (x, i) => i + 1
    );
  }

}
