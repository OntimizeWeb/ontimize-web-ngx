import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  Injector,
  Input,
  Optional,
} from '@angular/core';

import { OMatErrorOptions, OMatErrorType } from '../../../types/o-mat-error.type';
import { Codes } from '../../../util/codes';

export const O_MAT_ERROR_OPTIONS = new InjectionToken<OMatErrorOptions>('o-mat-error-options');

let nextUniqueId = 0;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mat-error',
  templateUrl: './o-mat-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mat-error',
    role: 'alert',
    '[attr.id]': 'id'
  }
})
export class OMatErrorComponent {
  @Input() id: string = `mat-error-${nextUniqueId++}`;
  @Input() text: string = '';

  protected errorOptions: OMatErrorOptions;
  protected errorType: OMatErrorType;

  constructor(
    protected injector: Injector,
    protected elementRef: ElementRef,
    protected cd: ChangeDetectorRef,
    @Optional() @Inject(O_MAT_ERROR_OPTIONS) errorOptions: OMatErrorOptions
  ) {
    this.errorOptions = errorOptions ? errorOptions : {};
    this.errorType = this.errorOptions.type || 'standard';
  }

  get isStandardError(): boolean {
    return this.errorType === Codes.O_MAT_ERROR_STANDARD;
  }
}
