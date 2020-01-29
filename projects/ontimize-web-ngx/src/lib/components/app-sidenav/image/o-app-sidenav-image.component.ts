import { Injector, NgModule, Component, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OSharedModule } from '../../../shared/shared.module';
import { OAppSidenavComponent } from '../o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = [
  'openedSrc: opened-src',
  'closedSrc: closed-src'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = [
];

@Component({
  moduleId: module.id,
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
export class OAppSidenavImageComponent implements OnInit, OnDestroy {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE;

  protected sidenav: OAppSidenavComponent;
  protected openedSrc: string;
  protected closedSrc: string;
  private _src: string;

  protected sidenavOpenSubs: Subscription;
  protected sidenavCloseSubs: Subscription;

  constructor(
    protected injector: Injector,
    protected cd: ChangeDetectorRef
  ) {
    this.sidenav = this.injector.get(OAppSidenavComponent);
  }

  ngOnInit() {
    if (this.sidenav) {
      const self = this;
      this.sidenavOpenSubs = this.sidenav.onSidenavClosedStart.subscribe(() => {
        self.updateImage();
      });
      this.sidenavCloseSubs = this.sidenav.onSidenavOpenedStart.subscribe(() => {
        self.updateImage();
      });
    }
    this.updateImage();
  }

  ngOnDestroy() {
    if (this.sidenavOpenSubs) {
      this.sidenavOpenSubs.unsubscribe();
    }
    if (this.sidenavCloseSubs) {
      this.sidenavCloseSubs.unsubscribe();
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

@NgModule({
  imports: [CommonModule, OSharedModule],
  declarations: [OAppSidenavImageComponent],
  exports: [OAppSidenavImageComponent]
})
export class OAppSidenavImageModule { }
