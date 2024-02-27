import { Component, ElementRef, Injector, ViewEncapsulation } from '@angular/core';
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
export class OListSkeletonComponent extends OSkeletonComponent {

  constructor(protected elRef: ElementRef, protected injector: Injector) {
    super(injector)
  }

  get count() {
    const parentElement = this.elRef.nativeElement.parentElement;
    return Array(Math.floor(parentElement.offsetHeight / 150));

  }
}
