import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { IIconPipeArgument, OIconPipe } from '../../../../../pipes/o-icon.pipe';
import { IconService } from '../../../../../services/icon.service';
import { OComboCustomRenderer } from '../o-combo-renderer.class';

export const DEFAULT_INPUTS_O_COMBO_RENDERER_ICON = [
  // icon-position [left|right]: position of the icon/image symbol. Default: left.
  'iconPosition: icon-position'
];

@Component({
  selector: 'o-combo-renderer-icon',
  templateUrl: './o-combo-renderer-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_COMBO_RENDERER_ICON
})

export class OComboRendererIconComponent extends OComboCustomRenderer implements OnInit {

  protected iconService: IconService;
  protected iconPosition: string;

  protected componentPipe: OIconPipe;
  protected pipeArguments: IIconPipeArgument;
  
  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.iconService = this.injector.get(IconService);
    this.setComponentPipe();
  }

  setComponentPipe() {
    this.componentPipe = new OIconPipe(this.injector);
  }

  initialize() {
    super.initialize();
    if (typeof this.iconPosition === 'undefined') {
      this.iconPosition = this.iconService.iconPosition;
    }
    
    this.pipeArguments = {
      iconPosition: this.iconPosition
    };
  }

}
