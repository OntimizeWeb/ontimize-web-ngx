import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface UserInfo {
  username?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OUserInfoService {
  protected storedInfo: UserInfo;
  private subject = new Subject<any>();

  constructor(protected injector: Injector) {
  }

  setUserInfo(info: UserInfo) {
    this.storedInfo = info;
    this.subject.next(info);
  }

  getUserInfo(): UserInfo {
    return this.storedInfo;
  }

  getUserInfoObservable(): Observable<any> {
    return this.subject.asObservable();
  }

}
