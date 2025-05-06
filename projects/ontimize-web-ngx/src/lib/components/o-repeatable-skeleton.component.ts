import { Directive } from '@angular/core';

import { OSkeletonComponent } from './o-skeleton.component';
import { Util } from '../util/util';

@Directive({})
export abstract class ORepeatableSkeletonComponent extends OSkeletonComponent  {

  abstract getParentElement(): HTMLElement;
  abstract getSkeletonItemElement(parentElement: HTMLElement): HTMLElement;

  getRows() {

    const parentElement = this.getParentElement();

    if (!parentElement) {
      return [1];
    }

    /* available parentHeight = parentElement height  - (header table header height + margin bottom)*/
    const item =this.getSkeletonItemElement(parentElement);

    let totalHeightItem: number = 0;

    if (item) {
      // Get the element's dimensions and computed styles
      const itemComputedStyle = getComputedStyle(item);
      const height = item.offsetHeight; // Height including padding
      const marginBottom = parseFloat(itemComputedStyle.marginBottom); // Bottom margin
      const marginTop = parseFloat(itemComputedStyle.marginTop);

      // Calculate the total vertical space taken by the item
      totalHeightItem = height + marginBottom + marginTop;
    }


    // Calculate the available height in the parent container (excluding one item height)
    const availableHeight = parentElement?.offsetHeight - totalHeightItem;
    if (!Util.isDefined(availableHeight) || availableHeight < 0) {
      return [1];
    }

    // Return an array with the number of items that can fit within the parent's height
    return Array.from(new Array(Math.ceil(parentElement?.offsetHeight / totalHeightItem)), (x, i) => i + 1);

  }
}
