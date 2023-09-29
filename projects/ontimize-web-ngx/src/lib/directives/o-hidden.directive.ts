import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[oHidden]'
})
export class OHiddenDirective {
  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'display', 'none');
  }
}
