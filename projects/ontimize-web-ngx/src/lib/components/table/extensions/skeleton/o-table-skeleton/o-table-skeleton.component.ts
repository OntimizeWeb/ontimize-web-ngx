import { Component, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'o-table-skeleton',
  templateUrl: './o-table-skeleton.component.html',
  styleUrls: ['./o-table-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-skeleton]': 'true'
  }

})
export class OTableSkeletonComponent {
  constructor(protected elRef: ElementRef){
  }

  get count() {
    const parentElement = this.elRef.nativeElement.parentElement;
    return Math.floor(parentElement.offsetHeight / 36);

  }
  //public count = 0;
}
