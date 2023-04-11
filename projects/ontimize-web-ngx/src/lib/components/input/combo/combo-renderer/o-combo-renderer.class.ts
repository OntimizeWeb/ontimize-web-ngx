import { Injector, OnInit, PipeTransform, TemplateRef, Directive } from '@angular/core';

import { Util } from '../../../../util';
import { OComboComponent } from '../o-combo.component';

export const DEFAULT_INPUTS_O_COMBO_RENDERER = [];
@Directive()
export class OComboCustomRenderer implements OnInit {

  public templateref: TemplateRef<any>;
  public comboComponent: OComboComponent;

  protected pipeArguments: any;
  protected componentPipe: PipeTransform;

  constructor(protected injector: Injector) {
    this.comboComponent = this.injector.get(OComboComponent);
  }

  public ngOnInit() {
    this.initialize();
  }

  public initialize(): void {
  }

  public ngAfterContentInit(): void {
    this.registerRenderer();
  }

  public registerRenderer(): void {
    this.comboComponent.registerRenderer(this);
  }

  /**
   * Returns the displayed combo data
   * @param value Internal combo data
  */

  public getComboData(record: any): string {
    let descTxt = '';
    if (!Util.isDefined(record)) {
      return descTxt;
    }
    this.comboComponent.descriptionColArray.forEach((col, index) => {
      if (Util.isDefined(record[col])) {
        let value = record[col];
        if (this.componentPipe && this.pipeArguments != null) {
          value = this.componentPipe.transform(value, this.pipeArguments);
        }
        if (Util.isDefined(value)) {
          descTxt += value;

          if (index < this.comboComponent.descriptionColArray.length - 1) {
            descTxt += this.comboComponent.separator;
          }
        }
      }
    });
    return descTxt;
  }
}