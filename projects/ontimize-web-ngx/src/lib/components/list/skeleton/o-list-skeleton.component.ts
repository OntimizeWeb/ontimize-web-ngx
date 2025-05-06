import { Component, ViewEncapsulation } from '@angular/core';

import { ORepetableSkeletonComponent } from '../../o-repetable-skeleton.component';

@Component({
  selector: 'o-list-skeleton',
  templateUrl: './o-list-skeleton.component.html',
  styleUrls: ['./o-list-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-skeleton]': 'true'
  }
})

export class OListSkeletonComponent extends ORepetableSkeletonComponent {
  getParentElement(): HTMLElement {
    return this.elRef.nativeElement.parentElement;
  }
  getSkeletonItemElement(parentElement: HTMLElement): HTMLElement {
    return parentElement.querySelector('div.o-list-skeleton-item');
  }

}
