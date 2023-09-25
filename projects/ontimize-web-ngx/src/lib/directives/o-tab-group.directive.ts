import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

export type OTabMode = 'ontimize' | 'material';

@Directive({
  selector: '[oTabGroup]'
})
export class OTabGroupDirective {

  protected static OTabModes = {
    ontimize: 'o-tab-ontimize',
    material: 'o-tab-material'
  };

  protected _mode: OTabMode = 'ontimize';
  protected _defaultMode: OTabMode = 'ontimize';

  @Input('oTabGroup')
  set mode(mode: OTabMode) {
    this._mode = mode;
    this.applyMode();
  }

  get mode(): OTabMode {
    return this._mode;
  }

  constructor(protected renderer: Renderer2, protected el: ElementRef) { }

  protected applyMode(mode?: OTabMode): void {
    this.renderer.removeClass(this.el.nativeElement, OTabGroupDirective.OTabModes.material);
    this.renderer.removeClass(this.el.nativeElement, OTabGroupDirective.OTabModes.ontimize);
    this.renderer.addClass(this.el.nativeElement, OTabGroupDirective.OTabModes[this.mode || this._defaultMode]);
  }

}
