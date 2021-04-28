import { Injectable } from '@angular/core';
import { GestureConfig, HammerManager } from '@angular/material';

@Injectable()
export class OTableGestureConfig extends GestureConfig {
  buildHammer(element: HTMLElement) {
    let mc = <HammerManager>super.buildHammer(element);
    mc.set({ touchAction: 'pan-y' });
    mc.set({ touchAction: 'pan-x' });
    return mc;
  }
}
