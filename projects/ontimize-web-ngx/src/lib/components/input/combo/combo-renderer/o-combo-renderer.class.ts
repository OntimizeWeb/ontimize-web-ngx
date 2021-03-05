import { Injector, OnInit, PipeTransform, TemplateRef } from '@angular/core';

import { Util } from '../../../../util';
import { OComboComponent } from '../o-combo.component';

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
   * Returns the displayed combo value
   * @param combovalue Internal combo value
  */

  public getComboData(combovalue: any): string {
    let parsedValue: string;
    if (Util.isDefined(combovalue)) {
      parsedValue = combovalue;
    } else {
      console.warn("getComboData() - No combovalue received");
    }
    return parsedValue;
  }
  

}
