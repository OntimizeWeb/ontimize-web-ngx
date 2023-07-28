import { Directive, ElementRef, Injector, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { OMatErrorOptions } from '../types/o-mat-error.type';
import { Codes } from '../util/codes';
import { ErrorsUtils } from '../util/errors';

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
    this.errorOptions = ErrorsUtils.getErrorOptions(this.injector);
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
