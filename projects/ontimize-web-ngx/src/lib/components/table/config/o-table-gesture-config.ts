import { Injectable } from '@angular/core';
import { GestureConfig, HammerManager } from '@angular/material/core';

@Injectable()
export class OTableGestureConfig extends GestureConfig {
  buildHammer(element: HTMLElement) {
    let mc = <HammerManager>super.buildHammer(element);
    mc.set({ touchAction: 'pan-x pan-y' });
    return mc;
  }
}
