import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnInit,
  Optional,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { OListItemComponent } from '../../list-item/o-list-item.component';
import {
  DEFAULT_INPUTS_O_TEXT_RENDERER,
  DEFAULT_OUTPUTS_O_TEXT_RENDERER,
  OListItemTextRenderer,
} from '../o-list-item-text-renderer.class';

export const DEFAULT_INPUTS_O_LIST_ITEM_TEXT = [
  ...DEFAULT_INPUTS_O_TEXT_RENDERER,
  'iconPosition : icon-position'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT = [
  ...DEFAULT_OUTPUTS_O_TEXT_RENDERER
];

@Component({
  selector: 'o-list-item-text',
  templateUrl: './o-list-item-text.component.html',
  styleUrls: ['./o-list-item-text.component.scss'],
  inputs: DEFAULT_INPUTS_O_LIST_ITEM_TEXT,
  outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-custom-list-item]': 'true'
  }
})
export class OListItemTextComponent extends OListItemTextRenderer implements OnInit, AfterViewInit {

  public ICON_POSITION_LEFT = 'left';
  public ICON_POSITION_RIGHT = 'right';

  public _iconPosition: string;

  constructor(
    elRef: ElementRef,
    _renderer: Renderer2,
    _injector: Injector,
    @Optional() @Inject(forwardRef(() => OListItemComponent)) protected _listItem: OListItemComponent
  ) {
    super(elRef, _renderer, _injector, _listItem);
    this.elRef.nativeElement.classList.add('o-list-item-text');
  }

  ngOnInit(): void {
    if (!this.iconPosition || [this.ICON_POSITION_LEFT, this.ICON_POSITION_RIGHT].indexOf(this.iconPosition.toLowerCase()) === -1) {
      this.iconPosition = this.ICON_POSITION_RIGHT;
    }
  }

  ngAfterViewInit() {
    this.modifyMatListItemElement();
  }

  get iconPosition(): string {
    return this._iconPosition;
  }

  set iconPosition(val: string) {
    this._iconPosition = val;
  }
}
