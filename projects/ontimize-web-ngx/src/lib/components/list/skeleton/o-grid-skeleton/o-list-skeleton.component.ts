import { Component, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'o-list-skeleton',
  templateUrl: './o-list-skeleton.component.html',
  styleUrls: ['./o-list-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-skeleton]': 'true'
  }
})
export class OListSkeletonComponent {
  constructor(protected elRef: ElementRef) {
  }

  get count() {
    const parentElement = this.elRef.nativeElement.parentElement;
    return Array(Math.floor(parentElement.offsetHeight / 150));

  }
}
