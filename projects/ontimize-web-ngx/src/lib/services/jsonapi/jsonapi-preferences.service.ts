import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { JSONAPIService } from './jsonapi.service';
import { OPreferenceMappingUtils } from '../../util/preference-mapping-util';

@Injectable()
export class JSONAPIPreferencesService extends JSONAPIService {

  public configureService(config: any): void {
    super.configureService(config);
    this.path = config['preferences']?.path ? config['preferences']?.path : '/Preference'
  }

  protected parseObjectToPreference(preferencesparams: object) {
    preferencesparams['preferenceparameters'] = btoa(JSON.stringify(preferencesparams['preferenceparameters']));
    preferencesparams['preferenceentity'] = preferencesparams['preferenceentity'] + '-' + preferencesparams['preferenceservice'];
    preferencesparams['preferencetype'] = preferencesparams['preferencetype'] === 'REPORT' ? 0 : 1;
    delete preferencesparams['preferenceservice'];
    return preferencesparams;
  }

  public saveAsPreferences(preferencesparams: object): Observable<any> {
    preferencesparams = this.parseObjectToPreference(preferencesparams);
    preferencesparams = OPreferenceMappingUtils.jsonApiPreferencesDataMapping(preferencesparams);
    return super.insert(preferencesparams, 'Preference');
  }

  public savePreferences(id: number, preferencesparams: object): Observable<any> {
    preferencesparams = this.parseObjectToPreference(preferencesparams);
    preferencesparams = OPreferenceMappingUtils.jsonApiPreferencesDataMapping(preferencesparams);
    return super.update(id.toString(), preferencesparams, 'Preference');
  }

  public getPreferences(entity: string, service: string, type: string): Observable<any> {
    let queryParams: JSONAPIQueryParameter = { fields: {}, filter: {} };

    let fields = { preference: 'PREFERENCEID,PREFERENCENAME,PREFERENCEDESCRIPTION,PREFERENCEPREFERENCES,PREFERENCEENTITY,PREFERENCETYPE' };
    queryParams.fields['Preference'] = fields.preference;
    queryParams.filter = { preferenceentity: entity + '-' + service, preferencetype: (type === 'REPORT' ? 0 : 1) };
    return super.query(queryParams);
  }


  public deletePreferences(id?: number): Observable<any> {
    const url = `${this.urlBase}${this.path}/${id}`;
    return this.doRequest({
      method: 'DELETE',
      url: url
    });
  }
}
