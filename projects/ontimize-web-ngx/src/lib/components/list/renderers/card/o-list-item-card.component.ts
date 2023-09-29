import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Optional,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { OListItemComponent } from '../../list-item/o-list-item.component';
import {
  OListItemCardRenderer
} from '../o-list-item-card-renderer.class';


@Component({
  selector: 'o-list-item-card',
  templateUrl: './o-list-item-card.component.html',
  styleUrls: ['./o-list-item-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-custom-list-item]': 'true',
    '[class.o-list-item-card]': 'true'
  }
})
export class OListItemCardComponent extends OListItemCardRenderer implements AfterViewInit {

  constructor(
    elRef: ElementRef,
    _renderer: Renderer2,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
  }

  ngAfterViewInit() {
    this.modifyMatListItemElement();
  }

}

