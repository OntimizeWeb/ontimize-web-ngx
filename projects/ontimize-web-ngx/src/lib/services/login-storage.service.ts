import { Injectable, Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import { Config } from '../types/config.type';
import { SessionInfo } from '../types/session-info.type';
import { Codes } from '../util/codes';

@Injectable({ providedIn: 'root' })
export class LoginStorageService {

  private _config: Config;
  public _localStorageKey: string;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    this._localStorageKey = this._config.uuid;
  }

  public getSessionInfo(): SessionInfo {
    const info = localStorage.getItem(this._localStorageKey);
    if (!info) {
      return {};
    }
    const stored = JSON.parse(info);
    return stored[Codes.SESSION_KEY] || {};
  }

  public storeSessionInfo(sessionInfo: SessionInfo): void {
    if (sessionInfo !== undefined) {
      const info = localStorage.getItem(this._localStorageKey);
      let stored = null;
      if (info && info.length > 0) {
        stored = JSON.parse(info);
      } else {
        stored = {};
      }
      stored[Codes.SESSION_KEY] = sessionInfo;
      localStorage.setItem(this._localStorageKey, JSON.stringify(stored));
    }
  }

  public sessionExpired(): void {
    const sessionInfo = this.getSessionInfo();
    delete sessionInfo.id;
    delete sessionInfo.user;
    this.storeSessionInfo(sessionInfo);
  }

  public isLoggedIn(): boolean {
    const sessionInfo = this.getSessionInfo();
    if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
      if (typeof sessionInfo.id === 'number' && (isNaN(sessionInfo.id) || sessionInfo.id < 0)) {
        return false;
      }
      return true;
    }
    return false;
  }

}
