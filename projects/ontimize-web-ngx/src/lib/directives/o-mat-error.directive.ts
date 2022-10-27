import { Directive, ElementRef, Injector, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { O_MAT_ERROR_OPTIONS } from '../services/factories';
import { OMatErrorOptions, OMatErrorType } from '../types/o-mat-error.type';
import { Codes } from '../util/codes';
import { Util } from '../util/util';

@Directive({
  selector: '[oMatError]'
})
export class OMatErrorDirective {
  public text: string;
  private errorOptions: OMatErrorOptions;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private injector: Injector
  ) {
    try {
      this.errorOptions = this.injector.get(O_MAT_ERROR_OPTIONS) || {};
    } catch (e) {
      this.errorOptions = {};
    }
    if (!Util.isDefined(this.errorOptions.type)) {
      this.errorOptions.type = Codes.O_MAT_ERROR_STANDARD as OMatErrorType;
    }
  }

  @Input()
  set oMatError(val) {
    if (val) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      if (this.errorOptions.type === Codes.O_MAT_ERROR_LITE) {
        setTimeout(() => {
          try {
            this.text = this.element.nativeElement.parentElement.getElementsByTagName('mat-error')[0].textContent;
          } catch (e) {
            this.text = undefined
          }
          this.viewContainer.clear();
        }, 0)
      }
    } else {
      this.text = undefined;
      this.viewContainer.clear();
    }
  }
}
