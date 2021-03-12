import { Injector, TemplateRef } from '@angular/core';

import { Util } from '../../../../util';
import { OComboComponent } from '../o-combo.component';

export class OComboCustomRenderer {

  public templateref: TemplateRef<any>;
  public comboComponent: OComboComponent;
  

  constructor(protected injector: Injector) {
    this.comboComponent = this.injector.get(OComboComponent);
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

  public getComboData(value: any): string {
    let parsedValue: string;
    if (Util.isDefined(value)) {
      parsedValue = value;
    } else {
      console.warn("getComboData() - No value received");
    }
    return parsedValue;
  }
  

}
