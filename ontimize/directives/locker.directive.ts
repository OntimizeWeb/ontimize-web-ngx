import { Directive, Input, ElementRef, Renderer2, Optional, Host } from '@angular/core';
import { OFormServiceComponent } from '../components';
import { Subscription } from 'rxjs/Subscription';

export const DEFAULT_INPUTS_O_LOCKER = [
  'oLockerMode',
  /*Default:250ms*/
  'oLockerDelay'
];

@Directive({
  selector: '[oLocker]',
  inputs: DEFAULT_INPUTS_O_LOCKER
})

export class OLockerDirective {
  private loadingParentDiv;
  static DEFAULT_INPUTS_O_LOCKER = DEFAULT_INPUTS_O_LOCKER;

  private _oLockerMode = 'disable';
  subscription: Subscription;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Optional() @Host() private parent: OFormServiceComponent
  ) {
    if (parent) {
      this.subscription = parent.loadingSubject.subscribe(x => this.manageLockerMode(x));
    }
  }

  private manageLockerMode(loading: boolean) {
    if (this._oLockerMode === 'load') {
      this.manageLoadMode(loading);
    } else {
      this.manageDisableMode(loading);
    }
  }


  private manageDisableMode(loading: boolean) {
    if (loading) {
      this.parent.disabled = true;
    } else {
      this.parent.disabled = false;
    }
  }
  private manageLoadMode(loading: boolean) {
    if (loading) {
      this.addLoading();
    } else {
      this.removeLoading();
    }
  }

  private addLoading() {
    this.loadingParentDiv = this.renderer.createElement('div');
    var loaderChild1 = this.renderer.createElement('div');
    var loaderChild2 = this.renderer.createElement('div');
    var loaderChild3 = this.renderer.createElement('div');
    var loaderChild4 = this.renderer.createElement('div');
    this.renderer.appendChild(this.loadingParentDiv, loaderChild4);
    this.renderer.appendChild(this.loadingParentDiv, loaderChild3);
    this.renderer.appendChild(this.loadingParentDiv, loaderChild2);
    this.renderer.appendChild(this.loadingParentDiv, loaderChild1);
    this.renderer.insertBefore(this.element.nativeElement, this.loadingParentDiv, this.element.nativeElement.firstChild);
    this.renderer.addClass(this.loadingParentDiv, 'o-loading');
    this.renderer.addClass(this.element.nativeElement, 'relative');
    this.renderer.setStyle(this.element.nativeElement, 'opacity', '0.6');
  }

  private removeLoading() {
    if (this.loadingParentDiv) {
      this.renderer.removeChild(this.element.nativeElement, this.loadingParentDiv);
      this.renderer.removeClass(this.element.nativeElement, 'relative');
      this.renderer.removeStyle(this.element.nativeElement, 'opacity');
    }
  }

  @Input()
  set oLockerMode(value: 'load' | 'disabled') {
    console.log('oLockerMode', value);
    this._oLockerMode = value;
  }

  @Input()
  set oLockerDelay(value: number) {
    console.log('delay', value);
    this.parent.delayLoad = value;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
