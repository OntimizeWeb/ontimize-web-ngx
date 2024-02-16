import { Component, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'o-grid-skeleton',
  templateUrl: './o-grid-skeleton.component.html',
  styleUrls: ['./o-grid-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-grid-skeleton]': 'true'
  }

})
export class OGridSkeletonComponent {
  constructor(protected elRef: ElementRef) {
  }
  get count() {
    const parentElement = this.elRef.nativeElement.parentElement;
    /** 60+10+10+10*3 */
    return Array(Math.floor(parentElement.offsetHeight / 160));

  }
}
