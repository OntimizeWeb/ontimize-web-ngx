import { Injector, OnInit, PipeTransform, TemplateRef } from '@angular/core';

import { Util } from '../../../../util';
import { OComboComponent } from '../o-combo.component';

export const DEFAULT_INPUTS_O_COMBO_RENDERER = [];
export class OComboCustomRenderer implements OnInit {

  public templateref: TemplateRef<any>;
  public comboComponent: OComboComponent;
  
  protected pipeArguments: any;
  protected componentPipe: PipeTransform;
  
  public flag: boolean = false;
  

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

  public getComboData(value: any): string {
    let parsedValue: string;
    if (Util.isDefined(value) && Util.isDefined(value.value)) {
      if (this.componentPipe && this.pipeArguments !== undefined && value !== undefined) {
        if(Util.isDefined(value.key)) {
          this.pipeArguments["key"] = value.key;
        }
        parsedValue = this.componentPipe.transform(value.value, this.pipeArguments);
      } else {
        parsedValue = value.value;
      }
    } else {
      console.warn("getComboData() - No value received");
    }
    return parsedValue;
  }
  

}
