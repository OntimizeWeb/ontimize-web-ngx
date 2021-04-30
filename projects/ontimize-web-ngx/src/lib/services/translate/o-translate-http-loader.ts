import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';

import { AppConfig } from '../../config/app-config';
import { Codes } from '../../util/codes';
import { OTranslateService } from './o-translate.service';

export class OTranslateHttpLoader extends TranslateHttpLoader {

  static BUNDLE_KEY = 'key';
  static BUNDLE_VALUE = 'value';

  protected appConfig: AppConfig;
  protected httpClient: HttpClient;

  constructor(
    httpClient: HttpClient,
    prefix: string = OTranslateService.ASSETS_PATH,
    suffix: string = OTranslateService.ASSETS_EXTENSION,
    protected injector: Injector
  ) {
    super(httpClient, prefix, suffix);
    this.appConfig = this.injector.get(AppConfig);
    this.httpClient = httpClient;
  }

  getAssetsPath(): string {
    return this.prefix;
  }

  getAssetsExtension(): string {
    return this.suffix;
  }

  getLocalTranslation(lang: string): Observable<any> {
    let innerObserver: any;
    const dataObservable = new Observable(observer => innerObserver = observer).pipe(share());
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
    const translationOrigins: any[] = [];

    translationOrigins.push(this.getLocalTranslation(lang));

    if (this.appConfig.useRemoteBundle()) {
      translationOrigins.push(this.getRemoteBundle(lang));
    }

    let innerObserver: any;
    const dataObservable = new Observable(observer => innerObserver = observer).pipe(share());

    combineLatest(translationOrigins).subscribe((res: any[]) => {
      const staticBundle = res[0] || {};
      const remoteBundle = res[1] || {};
      const allBundles = Object.assign(staticBundle, remoteBundle);
      innerObserver.next(allBundles);
    });
    return dataObservable;
  }

  getRemoteBundle(lang: string): Observable<any> {
    const bundleEndpoint = this.appConfig.getBundleEndpoint();
    if (!bundleEndpoint) {
      return of([]);
    }
    const url = bundleEndpoint + '?lang=' + lang;

    return this.httpClient.get(url).pipe(
      map((resp: any) => {
        if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
          return this.parseBundleResponse(resp.data);
        }
        return resp;
      }),
      catchError(err => {
        console.log('Remote Bundle service is not available', err);
        return of([]);
      })
    );
  }

  protected parseBundleResponse(data: any[]): any {
    const result = {};
    if (data) {
      data.forEach((item) => {
        result[item[OTranslateHttpLoader.BUNDLE_KEY]] = item[OTranslateHttpLoader.BUNDLE_VALUE];
      });
    }
    return result;
  }

}
