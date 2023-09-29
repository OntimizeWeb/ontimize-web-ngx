import { Directive, ElementRef, Host, Input, OnDestroy, Optional, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { OFormServiceComponent } from '../components/input/o-form-service-component.class';

export const DEFAULT_INPUTS_O_LOCKER = [
  'oLockerMode',
  /*Default:250ms*/
  'oLockerDelay'
];

@Directive({
  selector: '[oLocker]',
  inputs: DEFAULT_INPUTS_O_LOCKER
})

export class OLockerDirective implements OnDestroy {

  private loadingParentDiv;
  private componentDiv;

  private _oLockerMode = 'load';
  private subscription: Subscription;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Optional() @Host() private parent: OFormServiceComponent
  ) {
    if (parent) {
      this.subscription = parent.loadingSubject.subscribe(x => this.manageLockerMode(x));
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private manageLockerMode(loading: boolean): void {
    if (this._oLockerMode === 'disable') {
      this.manageDisableMode(loading);
    } else {
      this.manageLoadMode(loading);
    }
  }

  private manageDisableMode(loading: boolean): void {
    if (loading) {
      this.parent.enabled = false;
    } else {
      this.parent.enabled = true;
    }
  }

  private manageLoadMode(loading: boolean): void {
    if (loading) {
      this.addLoading();
    } else {
      this.removeLoading();
    }
  }

  private addLoading(): void {
    this.componentDiv = this.element.nativeElement.children[0]; // set opacity in componentDiv
    this.loadingParentDiv = this.renderer.createElement('div');
    const loaderChild1 = this.renderer.createElement('div');
    const loaderChild2 = this.renderer.createElement('div');
    const loaderChild3 = this.renderer.createElement('div');
    const loaderChild4 = this.renderer.createElement('div');
    this.renderer.appendChild(this.loadingParentDiv, loaderChild4);
    this.renderer.appendChild(this.loadingParentDiv, loaderChild3);
    this.renderer.appendChild(this.loadingParentDiv, loaderChild2);
    this.renderer.appendChild(this.loadingParentDiv, loaderChild1);
    this.renderer.insertBefore(this.element.nativeElement, this.loadingParentDiv, this.componentDiv);
    this.renderer.addClass(this.loadingParentDiv, 'o-loading');
    this.renderer.addClass(this.element.nativeElement, 'relative');
    this.renderer.setStyle(this.componentDiv, 'opacity', '0.6');
  }

  private removeLoading(): void {
    if (this.loadingParentDiv) {
      this.renderer.removeChild(this.element.nativeElement, this.loadingParentDiv);
      this.renderer.removeClass(this.element.nativeElement, 'relative');
      this.renderer.removeStyle(this.componentDiv, 'opacity');
    }
  }

  @Input()
  set oLockerMode(value: 'load' | 'disabled') {
    this._oLockerMode = value;
  }

  @Input()
  set oLockerDelay(value: number) {
    this.parent.delayLoad = value;
  }

}
