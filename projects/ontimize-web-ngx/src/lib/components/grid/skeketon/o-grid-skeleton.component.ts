import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

import { Util } from '../../../util/util';
import { OSkeletonComponent } from '../../o-skeleton.component';

@Component({
  selector: 'o-grid-skeleton',
  templateUrl: './o-grid-skeleton.component.html',
  styleUrls: ['./o-grid-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-grid-skeleton]': 'true'
  }

})
export class OGridSkeletonComponent extends OSkeletonComponent implements AfterViewInit {


  getRows() {

    const parentElement = this.elRef.nativeElement.parentElement;

    /* available parentHeight = parentElement height  - (header table header height + margin bottom)*/
    const item = parentElement.querySelector('div.o-grid-skeleton-item');

    let totalHeightItem: number = 0;

    if (item) {
      // Obtén las dimensiones y estilos computados del elemento
      const itemComputedStyle = getComputedStyle(item);
      const height = item.offsetHeight; // Altura incluyendo padding
      const marginBottom = parseFloat(itemComputedStyle.marginBottom); // Margen inferior
      const marginTop = parseFloat(itemComputedStyle.marginTop);

      // Calcula la altura total
      totalHeightItem = height + marginBottom + marginTop;
    }

    const availableHeight = parentElement?.offsetHeight - totalHeightItem;
    if (!Util.isDefined(availableHeight) || availableHeight < 0) {
      return [];
    }

    return Array.from(new Array(Math.ceil(parentElement?.offsetHeight / totalHeightItem)), (x, i) => i + 1);

  }
}
