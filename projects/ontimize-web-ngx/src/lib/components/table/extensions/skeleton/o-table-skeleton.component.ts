import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewEncapsulation } from '@angular/core';
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
export class OTableSkeletonComponent extends OSkeletonComponent implements OnInit, AfterViewInit {
  rows$: Observable<number[]>;
  private cd: ChangeDetectorRef;
  constructor(protected elRef: ElementRef, protected injector: Injector) {
    super(injector);
    this.cd = injector.get(ChangeDetectorRef);
  }

  ngOnInit(): void {
    this.rows$ = of([1]);
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();// sure detect changes
    this.rows$ = of(this.getRows());
  }

  getRows() {

    const parentElement = this.elRef.nativeElement.parentElement;

    /* available parentHeight = parentElement height  - (header table header height + margin bottom)*/
    const header = parentElement.querySelector('div.o-table-skeleton-header');
    const item = parentElement.querySelector('div.o-table-skeleton-item');

    let totalHeightHeader: number;
    let totalHeightItem: number;
    if (header) {
      // Obtén las dimensiones y estilos computados del elemento
      const headerComputedStyle = getComputedStyle(header);
      const height = header.offsetHeight; // Altura incluyendo padding
      const marginTop = parseFloat(headerComputedStyle.marginTop); // Margen superior
      const marginBottom = parseFloat(headerComputedStyle.marginBottom); // Margen inferior

      // Calcula la altura total
      totalHeightHeader = height + marginBottom + marginTop;
    }
    if (item) {
      // Obtén las dimensiones y estilos computados del elemento
      const itemComputedStyle = getComputedStyle(item);
      const height = item.offsetHeight; // Altura incluyendo padding
      const marginBottom = parseFloat(itemComputedStyle.marginBottom); // Margen inferior

      // Calcula la altura total
      totalHeightItem = height + marginBottom;
    }

    const parentHeight = parentElement?.offsetHeight - totalHeightHeader;
    if (!Util.isDefined(parentHeight) || parentHeight < 0) {
      return [];
    }

    return Array.from(new Array(Math.floor(parentHeight / totalHeightItem)), (x, i) => i + 1);

  }


}
