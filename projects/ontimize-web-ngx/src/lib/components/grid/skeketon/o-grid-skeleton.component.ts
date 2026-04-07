import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ORepeatableSkeletonComponent } from '../../o-repeatable-skeleton.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, FlexLayoutModule, NgxSkeletonLoaderModule],
  selector: 'o-grid-skeleton',
  templateUrl: './o-grid-skeleton.component.html',
  styleUrls: ['./o-grid-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-grid-skeleton]': 'true'
  }

})
export class OGridSkeletonComponent extends ORepeatableSkeletonComponent {

  getParentElement(): HTMLElement {
    return this.elRef.nativeElement.parentElement;
  }
  getSkeletonItemElement(parentElement: HTMLElement): HTMLElement {
    return parentElement.querySelector('div.o-grid-skeleton-item');
  }


}
