import { Injector, OnInit, TemplateRef } from '@angular/core';

import { Util } from '../../../../util';
import { OListPickerComponent } from '../o-list-picker.component';

export class OListPickerCustomRenderer implements OnInit {

  public templateref: TemplateRef<any>;
  public listpickerComponent: OListPickerComponent;
  

  constructor(protected injector: Injector) {
    this.listpickerComponent = this.injector.get(OListPickerComponent);
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
    this.listpickerComponent.registerRenderer(this);
  }

  /**
   * Returns the displayed value for listPicker
   * @param value Internal listPicker value
  */

  public getListPickerValue(value: any): string {
    let parsedValue: string;
    if (Util.isDefined(value)) {
      parsedValue = value;
    } else {
      console.warn("getListPickerData() - No value received");
    }
    return parsedValue;
  }
  

}
