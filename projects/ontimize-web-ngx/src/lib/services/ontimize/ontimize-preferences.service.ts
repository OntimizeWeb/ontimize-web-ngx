import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { OPreferenceMappingUtils } from '../../util/preference-mapping-util';
import { OntimizeEEService } from './ontimize-ee.service';
import { OPreferenceResponseAdapter } from './o-preference-response.adapter';

@Injectable()
export class OntimizePreferencesService extends OntimizeEEService {
  constructor(injector:Injector) {
    super(injector);
  }

  public path: string = '';
  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path || '/preferences';
  }

  public configureAdapter() {
    this.adapter = this.injector.get(OPreferenceResponseAdapter);
  }

  public saveAsPreferences(preferencesparams?: object): Observable<any> {

    const body = JSON.stringify(
      OPreferenceMappingUtils.ontimizePreferencesDataMapping(preferencesparams)
    )

    const url = `${this.urlBase}${this.path}/save`;

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body
    });
  }

  public savePreferences(id: number, preferencesparams?: object): Observable<any> {

    const body = JSON.stringify(
      OPreferenceMappingUtils.ontimizePreferencesDataMapping(preferencesparams)
    )
    const url = `${this.urlBase}${this.path}/update/${id}`;

    return this.doRequest({
      method: 'PUT',
      url: url,
      body: body
    });
  }

  public getPreferences(entity: string, service: string, type: string): Observable<any> {

    const url = `${this.urlBase}${this.path}/preferences?entity=${entity}&service=${service}&type=${type}`;

    return this.doRequest({
      method: 'GET',
      url: url
    });

  }

  public deletePreferences(id?: number): Observable<any> {

    const url = `${this.urlBase}${this.path}/remove/${id}`;
    return this.doRequest({
      method: 'DELETE',
      url: url
    });

  }
}
