import { Injector, OnInit, PipeTransform, TemplateRef, Directive } from '@angular/core';

import { Util } from '../../../../util';
import { OListPickerComponent } from '../o-list-picker.component';

export const DEFAULT_INPUTS_O_LISTPICKER_RENDERER = [];
@Directive()
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

  public getListPickerValue(record: any): string {
    let result = '';
    if (!Util.isDefined(record)) {
      return result;
    }
    this.listpickerComponent.descriptionColArray.forEach((col, index) => {
      if (Util.isDefined(record[col])) {
        let value = record[col];
        if (this.componentPipe && this.pipeArguments != null) {
          value = this.componentPipe.transform(value, this.pipeArguments);
        }
        if (Util.isDefined(value)) {
          result += value;

          if (index < this.listpickerComponent.descriptionColArray.length - 1) {
            result += this.listpickerComponent.separator;
          }
        }
      }
    });
    return result;
  }
}
