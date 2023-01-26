import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OContextMenuOverlayService {
  protected overlays: OverlayRef[] = [];

  public addOverlay(value: OverlayRef) {
    this.overlays.push(value);
  }

  public destroyOverlays(): void {
    if (this.overlays) {
      this.overlays.forEach((overlay) => {
        overlay.detach();
        overlay.dispose();
      });
    }
    this.overlays = [];
  }
}