import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OntimizeEEService } from './ontimize-ee.service';

@Injectable()
export class OntimizePreferencesService extends OntimizeEEService {

  public path: string = '';
  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path || '/preferences';
  }

  public saveAsPreferences(preferencesparams?: object): Observable<any> {
    const body = JSON.stringify(
      preferencesparams
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
      preferencesparams
    )
    const url = `${this.urlBase}${this.path}/update/${id}`;

    return this.doRequest({
      method: 'PUT',
      url: url,
      body: body
    });
  }

  public getPreferences(entity?: string, service?: string, type?:string): Observable<any> {

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
