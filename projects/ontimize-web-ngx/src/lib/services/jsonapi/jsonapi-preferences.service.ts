import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { NameConvention } from '../../util/name-convention.utils';
import { JSONAPIService } from './jsonapi.service';
import { ServiceType } from '../../types/service-type.type';

@Injectable()
export class JSONAPIPreferencesService extends JSONAPIService {

  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path || '/preferences';
  }

  public saveAsPreferences(preferencesparams: object): Observable<any> {
    preferencesparams = this.parseObjectToPreference(preferencesparams);
    return super.insert(preferencesparams, 'Preference');
  }

  public savePreferences(id: number, preferencesparams: object): Observable<any> {
    preferencesparams = this.parseObjectToPreference(preferencesparams);
    return super.update({ id: id }, preferencesparams, 'Preference');
  }

  protected parseObjectToPreference(preferencesparams: object) {
    preferencesparams['preferencepreferences'] = btoa(JSON.stringify(preferencesparams['preferenceparameters']));
    preferencesparams['preferenceentity'] = preferencesparams['preferenceentity'] + '-' + preferencesparams['preferenceservice'];
    preferencesparams['preferencetype'] = preferencesparams['preferencetype'] === 'REPORT' ? 0 : 1;
    delete preferencesparams['preferenceparameters'];
    delete preferencesparams['preferenceservice'];
    return preferencesparams;
  }

  public getPreferences(entity: string, service: string, type: string): Observable<any> {
    let queryParams: JSONAPIQueryParameter = { fields: {}, filter: {} };

    let fields = { preference: 'preferenceid,preferencename,preferencedescription,preferencepreferences,preferenceentity,preferencetype' };
    queryParams.fields['Preference'] = NameConvention.parseColumnsToNameConvention(this.nameConvention, ServiceType.JSONAPI, fields);
    queryParams.filter = { preferenceentity: entity + '-' + service, preferencetype: (type === 'REPORT' ? 0 : 1) };
    return super.query(queryParams);
  }


  public deletePreferences(id?: number): Observable<any> {
    const url = this.urlBase + '/Preference/' + id;
    return this.doRequest({
      method: 'DELETE',
      url: url
    });
  }
}
