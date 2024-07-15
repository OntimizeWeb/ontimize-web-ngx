import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OntimizeBaseService } from './ontimize-base-service.class';

@Injectable()
export class OntimizePreferencesService extends OntimizeBaseService {

  public path: string = '';
  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path ||  '/preferences';
  }

  public saveAsPreferences(preferencesparams?: object): Observable<any> {
    const body = JSON.stringify(
      preferencesparams
    )

    const url = this.urlBase + `/${this.path}/save`;

    return this.doRequest({
      method: 'POST',
      url: url,
      body: body
    });
  }

  public savePreferences(id: number, preferencesparams?: object): Observable<any> {
    const body = JSON.stringify(
      preferencesparams
    )
    const url = this.urlBase + `/${this.path}/update/${id}`;

    return this.doRequest({
      method: 'PUT',
      url: url,
      body: body
    });
  }

  public getPreferences(entity?: string, service?: string): Observable<any> {

    const url = this.urlBase + `${this.path}/${entity}?entity=${entity}&service=${service}&type=REPORT`;

    return this.doRequest({
      method: 'GET',
      url: url
    });

  }

  public deletePreferences(id?: number): Observable<any> {

    const url = this.urlBase + '/preferences/remove/' + id;
    return this.doRequest({
      method: 'DELETE',
      url: url
    });

  }
}
