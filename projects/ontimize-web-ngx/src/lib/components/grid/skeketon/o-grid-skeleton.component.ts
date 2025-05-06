import { Component, ViewEncapsulation } from '@angular/core';

import { ORepetableSkeletonComponent } from '../../o-repetable-skeleton.component';

@Component({
  selector: 'o-grid-skeleton',
  templateUrl: './o-grid-skeleton.component.html',
  styleUrls: ['./o-grid-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-grid-skeleton]': 'true'
  }

})
export class OGridSkeletonComponent extends ORepetableSkeletonComponent {

  getParentElement(): HTMLElement {
    return this.elRef.nativeElement.parentElement;
  }
  getSkeletonItemElement(parentElement: HTMLElement): HTMLElement {
    return parentElement.querySelector('div.o-grid-skeleton-item');
  }


}
