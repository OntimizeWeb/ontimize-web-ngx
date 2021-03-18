import { Injector, OnInit, PipeTransform, TemplateRef } from '@angular/core';

import { Util } from '../../../../util';
import { OListPickerComponent } from '../o-list-picker.component';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER = [];
export class OListPickerCustomRenderer implements OnInit {

  public templateref: TemplateRef<any>;
  public listpickerComponent: OListPickerComponent;

  protected pipeArguments: any;
  protected componentPipe: PipeTransform;
  

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
      if (this.componentPipe && this.pipeArguments !== undefined && value !== undefined) {
        parsedValue = this.componentPipe.transform(value, this.pipeArguments);
      } else {
        parsedValue = value;
      }
    } else {
      console.warn("getListPickerData() - No value received");
    }
    return parsedValue;
  }
  

}
