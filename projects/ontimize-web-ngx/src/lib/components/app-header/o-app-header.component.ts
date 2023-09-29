import { Component, EventEmitter, Injector, Type, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';

import { BooleanInputConverter } from '../../decorators/input-converter';
import { AuthService } from '../../services';
import { DialogService } from '../../services/dialog.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
import { Codes } from '../../util/codes';
import { OUserInfoBase } from '../user-info/o-user-info-base.class';
import { OAppHeaderBase } from './o-app-header-base.class';

export const DEFAULT_INPUTS_O_APP_HEADER = [
  'showUserInfo: show-user-info',
  'showLanguageSelector: show-language-selector',
  'useFlagIcons: use-flag-icons',
  'color',
  'headerHeight:header-height',
  'showTitle: show-title',
  'staticTitle: static-title',
  'showStaticTitle: show-static-title'
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
    '[class.o-app-header]': 'true',
    '[class.o-app-header-small]': 'headerHeight==="small"',
    '[class.o-app-header-medium]': 'headerHeight==="medium"',
    '[class.o-app-header-large]': 'headerHeight==="large"'
  },
  providers: [
    { provide: OAppHeaderBase, useExisting: forwardRef(() => OAppHeaderComponent) }

  ]
})
export class OAppHeaderComponent {

  protected dialogService: DialogService;
  protected modulesInfoService: OModulesInfoService;
  protected authService: AuthService;
  public showTitle = false;
  public showStaticTitle = false;
  public staticTitle: string;
  public headerTitle$: Observable<string>;

  @ViewChild('userInfo')
  public userInfo: OUserInfoBase;

  @BooleanInputConverter()
  showUserInfo: boolean = true;
  @BooleanInputConverter()
  showLanguageSelector: boolean = true;
  @BooleanInputConverter()
  useFlagIcons: boolean = false;

  public onSidenavToggle = new EventEmitter<void>();
  protected _headerHeight = Codes.DEFAULT_ROW_HEIGHT;

  set headerHeight(value) {
    this._headerHeight = value ? value.toLowerCase() : value;
    if (!Codes.isValidRowHeight(this._headerHeight)) {
      this._headerHeight = Codes.DEFAULT_ROW_HEIGHT;
    }
  }

  get headerHeight(): string {
    return this._headerHeight;
  }

  private _color: ThemePalette;

  constructor(
    protected injector: Injector,
  ) {
    this.dialogService = this.injector.get<DialogService>(DialogService as Type<DialogService>);
    this.modulesInfoService = this.injector.get<OModulesInfoService>(OModulesInfoService as Type<OModulesInfoService>);
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
  }
  ngOnInit() {
    if (!this.showStaticTitle) {
      this.headerTitle$ = this.modulesInfoService.getModuleChangeObservable();
    }
  }
  onLogoutClick() {
    this.authService.logoutWithConfirmation();
  }
  set color(newValue: ThemePalette) {
    this._color = newValue;
  }

  get color(): ThemePalette {
    return this._color;
  }

}
