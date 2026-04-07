import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ORepeatableSkeletonComponent } from '../../o-repeatable-skeleton.component';

@Component({
  standalone: true,
  imports: [AsyncPipe, FlexLayoutModule, NgxSkeletonLoaderModule],
  selector: 'o-list-skeleton',
  templateUrl: './o-list-skeleton.component.html',
  styleUrls: ['./o-list-skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-skeleton]': 'true'
  }
})

export class OListSkeletonComponent extends ORepeatableSkeletonComponent {
  getParentElement(): HTMLElement {
    return this.elRef.nativeElement.parentElement;
  }
  getSkeletonItemElement(parentElement: HTMLElement): HTMLElement {
    return parentElement.querySelector('div.o-list-skeleton-item');
  }

}
