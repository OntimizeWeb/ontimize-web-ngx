import {
  Injector,
  OnDestroy,
  NgModule,
  Component,
  EventEmitter,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../shared';
import { AppConfig } from '../../config/app-config';
import {
  DialogService,
  OTranslateService,
  OModulesInfoService
} from '../../services';

import { OUserInfoModule } from '../../components';


export const DEFAULT_INPUTS_O_APP_HEADER = [
];

export const DEFAULT_OUTPUTS_O_APP_HEADER = [
  'toggleSidenav'
];

@Component({
  selector: 'o-app-header',
  inputs: DEFAULT_INPUTS_O_APP_HEADER,
  outputs: DEFAULT_OUTPUTS_O_APP_HEADER,
  template: require('./o-app-header.component.html'),
  styles: [require('./o-app-header.component.scss')],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-app-header]': 'true'
  }
})
export class OAppHeaderComponent implements OnDestroy {

  public static DEFAULT_INPUTS_O_APP_HEADER = DEFAULT_INPUTS_O_APP_HEADER;
  public static DEFAULT_OUTPUTS_O_APP_HEADER = DEFAULT_OUTPUTS_O_APP_HEADER;

  protected dialogService: DialogService;
  protected translateService: OTranslateService;
  protected modulesInfoService: OModulesInfoService;
  protected _config: AppConfig;
  protected availableLangs: string[];
  protected headerTitle: '';

  modulesInfoSubscription: Subscription;
  toggleSidenav = new EventEmitter<void>();

  constructor(
    private router: Router,
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.translateService = this.injector.get(OTranslateService);
    this._config = this.injector.get(AppConfig);
    this.availableLangs = this._config.getConfiguration().applicationLocales;
    this.modulesInfoService = this.injector.get(OModulesInfoService);

    // this.userInfo = this.modulesInfoService.();
    this.modulesInfoSubscription = this.modulesInfoService.getModuleChangeObservable().subscribe(res => {
      this.headerTitle = res.name;
    });
  }

  ngOnDestroy() {
    this.modulesInfoSubscription.unsubscribe();
  }

  onLogoutClick() {
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(
      res => {
        if (res === true) {
          this.router.navigate(['/login', {
            'session-expired': true
          }]);
        }
      }
    );
  }

  configureI18n(lang: any) {
    if (this.translateService && this.translateService.getCurrentLang() !== lang) {
      this.translateService.use(lang);
    }
  }

  getFlagClass(lang: string) {
    const flagName = (lang !== 'en') ? lang : 'gb';
    return 'flag-icon-' + flagName;
  }
}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    OUserInfoModule
  ],
  declarations: [
    OAppHeaderComponent
  ],
  exports: [OAppHeaderComponent]
})
export class OAppHeaderModule { }
