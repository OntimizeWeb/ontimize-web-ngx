import { Component, ElementRef, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { OSkeletonComponent } from '../../../o-skeleton.component';
import { Observable, of } from 'rxjs';
import { Util } from '../../../../util/util';


@Component({
  selector: 'o-table-skeleton',
  templateUrl: './o-table-skeleton.component.html',
  styleUrls: ['./o-table-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table-skeleton]': 'true'
  }

})
export class OTableSkeletonComponent extends OSkeletonComponent implements OnInit {
  rows$: Observable<Number[]>;

  constructor(protected elRef: ElementRef, protected injector: Injector) {
    super(injector);
  }


  ngOnInit(): void {
    this.rows$ = of(this.getRows());
  }



  getRows() {

    const parentElement = this.elRef.nativeElement.parentElement;

    /* available parentHeight = parentElement height  - (header table header height + margin bottom)*/

    const parentHeight = parentElement?.offsetHeight - 60;
    if (!Util.isDefined(parentHeight) || parentHeight < 0) {
      return [];
    }

    return Array.from(new Array(Math.floor(parentHeight / 30)), (x, i) => i + 1);

  }


}
