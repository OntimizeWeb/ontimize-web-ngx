import { Component, ElementRef, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { OSkeletonComponent } from '../../../../o-skeleton.component';


@Component({
  selector: 'o-table-skeleton',
  templateUrl: './o-table-skeleton.component.html',
  styleUrls: ['./o-table-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-skeleton]': 'true'
  }

})
export class OTableSkeletonComponent extends OSkeletonComponent implements OnDestroy {

  constructor(protected elRef: ElementRef, protected injector: Injector) {
    super(injector)
  }

  get count() {
    const parentElement = this.elRef.nativeElement.parentElement;
    /* available parentHeight = parentElement height  - header table header height*/
    const parentHeight = parentElement.offsetHeight - 40;
    return Math.floor(parentHeight / 38);
  }

}
