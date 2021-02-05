import { ViewChild } from '@angular/core';
import { Component, ElementRef, EventEmitter, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { DialogService } from '../../services/dialog.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
import { ServiceUtils } from '../../util/service.utils';
import { OUserInfoComponent } from '../user-info/o-user-info.component';

export const DEFAULT_INPUTS_O_APP_HEADER = [
  'showUserInfo: show-user-info',
  'showLanguageSelector: show-language-selector',
  'useFlagIcons: use-flag-icons',
  'color'
];

export const DEFAULT_OUTPUTS_O_APP_HEADER = [
  'onSidenavToggle'
];

@Component({
  selector: 'o-app-header',
  inputs: DEFAULT_INPUTS_O_APP_HEADER,
  outputs: DEFAULT_OUTPUTS_O_APP_HEADER,
  templateUrl: './o-app-header.component.html',
  styleUrls: ['./o-app-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-app-header]': 'true'
  }
})
export class OAppHeaderComponent implements OnDestroy {

  protected dialogService: DialogService;
  protected modulesInfoService: OModulesInfoService;
  protected _headerTitle = '';

  protected modulesInfoSubscription: Subscription;

  @ViewChild('userInfo', { static: false })
  public userInfo: OUserInfoComponent;

  @InputConverter()
  showUserInfo: boolean = true;
  @InputConverter()
  showLanguageSelector: boolean = true;
  @InputConverter()
  useFlagIcons: boolean = false;

  public onSidenavToggle = new EventEmitter<void>();

  private _color: ThemePalette;

  constructor(
    protected router: Router,
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.modulesInfoService = this.injector.get(OModulesInfoService);

    this.modulesInfoSubscription = this.modulesInfoService.getModuleChangeObservable().subscribe(res => {
      this.headerTitle = res.name;
    });
  }

  ngOnDestroy() {
    this.modulesInfoSubscription.unsubscribe();
  }

  onLogoutClick() {
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
      if (res) {
        ServiceUtils.redirectLogin(this.router, false);
      }
    });
  }

  get headerTitle(): string {
    return this._headerTitle;
  }

  set headerTitle(value: string) {
    this._headerTitle = value;
  }

  get showHeaderTitle(): boolean {
    return this._headerTitle.length > 0;
  }

  set color(newValue: ThemePalette) {
    this._color = newValue;
  }

  get color(): ThemePalette {
    return this._color;
  }

}
