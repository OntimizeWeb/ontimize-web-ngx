import { Injector, OnInit, TemplateRef } from '@angular/core';

import { Util } from '../../../../util';
import { OComboComponent } from '../o-combo.component';

export class OComboCustomRenderer implements OnInit {

  public templateref: TemplateRef<any>;
  public comboComponent: OComboComponent;
  

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
    // let dataArray = this.comboComponent.getDataArray()
    // dataArray.forEach((element, index) => {
      
    // });
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
