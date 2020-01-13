import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[o-form-layout-manager-content]',
})
export class OFormLayoutManagerContentDirective {

  @Input() index: number;

  constructor(public viewContainerRef: ViewContainerRef) { }
}
