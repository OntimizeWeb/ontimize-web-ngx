import { Component, ElementRef, EventEmitter, Injector, NgModule, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ServiceUtils } from '../../utils';
import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { OUserInfoModule } from '../../components';
import { DialogService, OModulesInfoService } from '../../services';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.component';

export const DEFAULT_INPUTS_O_APP_HEADER = [
  'showUserInfo: show-user-info',
  'showLanguageSelector: show-language-selector',
  'useFlagIcons: use-flag-icons'
];

export const DEFAULT_OUTPUTS_O_APP_HEADER = [
  'onSidenavToggle'
];

@Component({
  moduleId: module.id,
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

  public static DEFAULT_INPUTS_O_APP_HEADER = DEFAULT_INPUTS_O_APP_HEADER;
  public static DEFAULT_OUTPUTS_O_APP_HEADER = DEFAULT_OUTPUTS_O_APP_HEADER;

  protected dialogService: DialogService;
  protected modulesInfoService: OModulesInfoService;
  protected _headerTitle = '';

  protected modulesInfoSubscription: Subscription;

  @InputConverter()
  showUserInfo: boolean = true;
  @InputConverter()
  showLanguageSelector: boolean = true;
  @InputConverter()
  useFlagIcons: boolean = false;

  public onSidenavToggle = new EventEmitter<void>();

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

}

@NgModule({
  imports: [CommonModule, OLanguageSelectorModule, OUserInfoModule, OSharedModule],
  declarations: [OAppHeaderComponent],
  exports: [OAppHeaderComponent]
})
export class OAppHeaderModule { }
