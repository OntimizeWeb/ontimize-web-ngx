import {
  Injector,
  NgModule,
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdSidenav } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
import { OSharedModule } from '../../shared';


import { OAppSidenavMenuItemModule } from './o-app-sidenav-menu-item.component';
import { OAppSidenavMenuGroupModule } from './o-app-sidenav-menu-group.component';


import {
  AppMenuService,
  MenuRootItem
} from '../../services';

const SMALL_WIDTH_BREAKPOINT = 840;

export const DEFAULT_INPUTS_O_APP_SIDENAV = [];
export const DEFAULT_OUTPUTS_O_APP_SIDENAV = [];

@Component({
  selector: 'o-app-sidenav',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV,
  template: require('./o-app-sidenav.component.html'),
  styles: [require('./o-app-sidenav.component.scss')],
  encapsulation: ViewEncapsulation.None
})
export class OAppSidenavComponent implements OnInit {

  public static DEFAULT_INPUTS_O_APP_LAYOUT = DEFAULT_INPUTS_O_APP_SIDENAV;
  public static DEFAULT_OUTPUTS_O_APP_LAYOUT = DEFAULT_OUTPUTS_O_APP_SIDENAV;

  @ViewChild(MdSidenav) sidenav: MdSidenav;

  protected appMenuService: AppMenuService;
  protected menuRootArray: MenuRootItem[];

  protected imageSrc: string;

  constructor(
    protected injector: Injector,
    private router: Router,
    protected elRef: ElementRef
  ) {
    this.appMenuService = this.injector.get(AppMenuService);
    this.menuRootArray = this.appMenuService.getMenuRoots();

    this.elRef.nativeElement.classList.add('o-app-sidenav');
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    OAppSidenavMenuItemModule,
    OAppSidenavMenuGroupModule,
    RouterModule
  ],
  declarations: [
    OAppSidenavComponent
  ],
  exports: [OAppSidenavComponent]
})
export class OAppSidenavModule { }
