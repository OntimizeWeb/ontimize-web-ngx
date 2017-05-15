import {
  Component,
  Inject,
  Injector,
  forwardRef,
  ViewEncapsulation,
  ElementRef,
  Renderer,
  Optional,
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import {
  MdIconModule,
  MdListModule
} from '@angular/material';

import { OListItemComponent } from '../list-item/o-list-item.component';
import { OListItemTextRenderer } from './o-list-item-text-renderer.class';
import { OSharedModule } from '../../../shared.module';

export const DEFAULT_INPUTS_O_LIST_ITEM_TEXT = [
  ...OListItemTextRenderer.DEFAULT_INPUTS_O_TEXT_RENDERER,
  'iconPosition : icon-position'
];

export const DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT = [
  ...OListItemTextRenderer.DEFAULT_OUTPUTS_O_TEXT_RENDERER
];

@Component({
  selector: 'o-list-item-text',
  template: require('./o-list-item-text.component.html'),
  styles: [require('./o-list-item-text.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST_ITEM_TEXT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT
  ],
  encapsulation: ViewEncapsulation.None
})

export class OListItemTextComponent extends OListItemTextRenderer {

  protected iconPosition: string;
  private ICON_POSITION_LEFT = 'left';
  private ICON_POSITION_RIGHT = 'right';

  constructor(
    elRef: ElementRef,
    _renderer: Renderer,
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
    this.modifyMdListItemElement();
  }
}

@NgModule({
  declarations: [OListItemTextComponent],
  imports: [
    OSharedModule,
    MdIconModule,
    MdListModule
  ],
  exports: [OListItemTextComponent]
})

export class OListItemTextModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListItemTextModule,
      providers: []
    };
  }
}
