import { Component, ElementRef, ViewEncapsulation, Injector } from '@angular/core';
import { OSkeletonComponent } from '../../../o-skeleton.component';

@Component({
  selector: 'o-grid-skeleton',
  templateUrl: './o-grid-skeleton.component.html',
  styleUrls: ['./o-grid-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-grid-skeleton]': 'true'
  }

})
export class OGridSkeletonComponent extends OSkeletonComponent {

  constructor(protected elRef: ElementRef, protected injector: Injector) {
    super(injector);
  }

  get count() {
    const parentElement = this.elRef.nativeElement.parentElement;
    /** 60+10+10+10*3 */
    return Array(Math.floor(parentElement.offsetHeight / 130));

  }
}
