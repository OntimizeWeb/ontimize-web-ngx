
import { Injectable, Injector, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from '../config/app-config';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();
  protected _appConfig: AppConfig;
  config: any;

  constructor(protected injector: Injector) {
    this._appConfig = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>);
    this.config = JSON.parse(localStorage.getItem(this._appConfig.getConfiguration().uuid));

    if (this.config && this.config.theme && typeof this.config.theme.isDark === 'boolean') {
      const isDark = this.config.theme.isDark;
      this.isDarkModeSubject.next(isDark);
    }

  }

  setDarkMode(isDarkMode: boolean) {
    this.isDarkModeSubject.next(isDarkMode);
    if (this.config && this.config.theme) {
      this.config.theme.isDark = isDarkMode;
    }
    localStorage.setItem(this._appConfig.getConfiguration().uuid, JSON.stringify(this.config));
  }
}
