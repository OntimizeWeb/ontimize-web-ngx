
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from '../config/app-config';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();
  protected _appConfig: AppConfig;
  protected localStorageService: LocalStorageService;
  constructor(protected injector: Injector) {
    this.localStorageService = this.injector.get(LocalStorageService);

    const config = this.localStorageService.getStoredData();

    if (config && config["theme"] && typeof config["theme"].isDark === 'boolean') {
      const isDark = config["theme"].isDark;
      this.isDarkModeSubject.next(isDark);
    }

  }

  setDarkMode(isDarkMode: boolean) {
    const config = this.localStorageService.getStoredData();
    if (config) {
      config["theme"] = config["theme"] || {};
      config["theme"].isDark = isDarkMode;
    }
    this.localStorageService.setLocalStorage(config);
    this.isDarkModeSubject.next(isDarkMode);
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
