
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

  constructor(protected injector: Injector) {
    this._appConfig = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>);
    const config = JSON.parse(localStorage.getItem(this._appConfig.getConfiguration().uuid));

    if (config && config.theme && typeof config.theme.isDark === 'boolean') {
      const isDark = config.theme.isDark;
      this.isDarkModeSubject.next(isDark);
    }

  }

  setDarkMode(isDarkMode: boolean) {
    const config = JSON.parse(localStorage.getItem(this._appConfig.getConfiguration().uuid));
    this.isDarkModeSubject.next(isDarkMode);
    if (config) {
      config.theme.isDark = isDarkMode;
    }
    localStorage.setItem(this._appConfig.getConfiguration().uuid, JSON.stringify(config));
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
