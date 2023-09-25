import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { merge, Subscription } from 'rxjs';

import { OAppSidenavComponent } from '../o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = [
  'openedSrc: opened-src',
  'closedSrc: closed-src'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = [];

@Component({
  selector: 'o-app-sidenav-image',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE,
  templateUrl: './o-app-sidenav-image.component.html',
  styleUrls: ['./o-app-sidenav-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-app-sidenav-image]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OAppSidenavImageComponent implements OnInit, OnDestroy, OnChanges {

  protected sidenav: OAppSidenavComponent;
  public openedSrc: string;
  public closedSrc: string;
  private _src: string;

  protected subscription = new Subscription();

  constructor(
    protected injector: Injector,
    protected cd: ChangeDetectorRef
  ) {
    this.sidenav = this.injector.get(OAppSidenavComponent);
  }

  ngOnInit() {
    if (this.sidenav) {
      this.subscription.add(merge(this.sidenav.onSidenavClosedStart, this.sidenav.onSidenavOpenedStart).subscribe(() => this.updateImage()));
    }
    this.updateImage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openedSrc || changes.closedSrc) {
      this.updateImage();
    }
  }

  updateImage() {
    if (this.sidenav && this.sidenav.sidenav && this.sidenav.sidenav.opened) {
      this.setOpenedImg();
    } else {
      this.setClosedImg();
    }
    this.cd.detectChanges();
  }

  set src(val: string) {
    this._src = val;
  }

  get src() {
    return this._src;
  }

  setOpenedImg() {
    this.src = this.openedSrc;
  }

  setClosedImg() {
    this.src = this.closedSrc;
  }

  get showImage(): boolean {
    return (this._src !== undefined && this._src.length > 0);
  }

}
