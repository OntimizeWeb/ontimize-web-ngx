import { Injector, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfileService {

  protected httpClient: HttpClient;

  constructor(protected injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
  }

  getPermissions(): Observable<any> {

    let innerObserver: any;
    let dataObservable = new Observable(observer => innerObserver = observer).share();

    this.httpClient.get('assets/profile.json').subscribe((resp: any) => {
      innerObserver.next(resp);
    },
      error => {
        console.log('profile permissions is not available');
        innerObserver.next(error);
      },
      () => innerObserver.complete()
    );

    return dataObservable;
  }

}
