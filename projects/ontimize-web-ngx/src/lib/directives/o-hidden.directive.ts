import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[oHidden]',
  standalone: true
})
export class OHiddenDirective {
  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'display', 'none');
  }
}
