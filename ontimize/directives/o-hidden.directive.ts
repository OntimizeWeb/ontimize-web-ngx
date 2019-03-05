import { Directive, ElementRef, Renderer2 } from '@angular/core';

export type OTabMode = 'ontimize' | 'material';

@Directive({
  selector: '[oHidden]'
})
export class OHiddenDirective {
  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'display', 'none');
  }
}
