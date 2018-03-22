import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import { AppConfig } from '../../config/app-config';

export class OTranslateHttpLoader extends TranslateHttpLoader {
  protected appConfig: AppConfig;
  protected httpClient: HttpClient;

  static BUNDLE_KEY = 'key';
  static BUNDLE_VALUE = 'value';

  constructor(
    httpClient: HttpClient,
    prefix: string = '/assets/i18n/',
    suffix: string = '.json',
    protected injector: Injector
  ) {

    super(httpClient, prefix, suffix);

    this.httpClient = httpClient;
    this.appConfig = this.injector.get(AppConfig);
  }

  getLocalTranslation(lang: string): Observable<any> {
    let innerObserver: any;
    const dataObservable = new Observable(observer => innerObserver = observer).share();
    super.getTranslation(lang)
      .subscribe((res) => {
        innerObserver.next(res);
        innerObserver.complete();
      }, error => {
        innerObserver.next(undefined);
      },
      () => innerObserver.complete());
    return dataObservable;
  }

  getTranslation(lang: string): any {
    let translationOrigins: any[] = [];

    translationOrigins.push(this.getLocalTranslation(lang));

    if (this.appConfig.useRemoteBundle()) {
      translationOrigins.push(this.getRemoteBundle(lang));
    }

    let innerObserver: any;
    const dataObservable = new Observable(observer => innerObserver = observer).share();

    Observable.combineLatest(...translationOrigins)
      .subscribe((res: any[]) => {
        const staticBundle = res[0] || {};
        const remoteBundle = res[1] || {};
        const allBundles = Object.assign(staticBundle, remoteBundle);
        innerObserver.next(allBundles);
      });
    return dataObservable;
  }

  getRemoteBundle(lang: string): Observable<any> {
    const bundleEndpoint = this.appConfig.getBundleEndpoint();
    let innerObserver: any;
    let dataObservable = new Observable(observer => innerObserver = observer).share();
    if (!bundleEndpoint) {
      innerObserver.next([]);
    }
    const url = bundleEndpoint + '?lang=' + lang;

    this.httpClient.get(url).subscribe((resp: any) => {
      let response = {};
      if (resp.code === 0) {
        response = this.parseBundleResponse(resp.data);
      }
      innerObserver.next(response);
    },
      error => {
        console.log('Remote Bundle service is not available');
        innerObserver.next(error);
      },
      () => innerObserver.complete()
    );

    return dataObservable;
  }

  protected parseBundleResponse(data: any[]): any {
    let result = {};
    data.forEach((item) => {
      result[item[OTranslateHttpLoader.BUNDLE_KEY]] = item[OTranslateHttpLoader.BUNDLE_VALUE];
    });
    return result;
  }
}
