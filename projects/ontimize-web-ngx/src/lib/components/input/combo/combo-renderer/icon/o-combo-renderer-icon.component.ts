import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { IIconPipeArgument, OIconPipe } from '../../../../../pipes/o-icon.pipe';
import { IconService } from '../../../../../services/icon.service';
import { Util } from '../../../../../util/util';
import { OComboCustomRenderer } from '../o-combo-renderer.class';

export const DEFAULT_INPUTS_O_COMBO_RENDERER_ICON = [
  // icon-position [left|right]: position of the icon/image symbol. Default: left.
  'iconPosition: icon-position',
  // icon-column [string]: Column key to icon name. Default: icon
  'iconColumn: icon-column'
];

@Component({
  selector: 'o-combo-renderer-icon',
  templateUrl: './o-combo-renderer-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_COMBO_RENDERER_ICON
})

export class OComboRendererIconComponent extends OComboCustomRenderer implements OnInit {

  protected iconService: IconService;
  protected iconColumn: string;
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

    this.pipeArguments = {
      iconPosition: this.iconPosition,
      icon: undefined
    };
  }

  public getComboData(record: any): string {
    if (!Util.isDefined(record)) {
      return '';
    }
    const descriptionColsValue = this.comboComponent.getOptionDescriptionValue(record);
    return `${descriptionColsValue} ${record[this.iconColumn]}`;
  }

  public getSafeHtmlComboData(record: any): SafeHtml {
    if (!Util.isDefined(record)) {
      return '';
    }
    if (Util.isDefined(record[this.iconColumn])) {
      this.pipeArguments.icon = record[this.iconColumn];
    }
    const descriptionColsValue = this.comboComponent.getOptionDescriptionValue(record);
    return this.componentPipe.transform(descriptionColsValue, this.pipeArguments);
  }
}
