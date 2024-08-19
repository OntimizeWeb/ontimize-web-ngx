import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JSONAPIService } from './jsonapi.service';
import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { Util } from '../../util';

@Injectable()
export class JSONAPIPreferencesService extends JSONAPIService {

  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path || '/preferences';
  }

  public saveAsPreferences(preferencesparams: object): Observable<any> {
    preferencesparams['preferencepreferences'] = btoa(JSON.stringify(preferencesparams['preferencepreferences']));
    preferencesparams['preferenceentity'] = preferencesparams['preferenceentity'] + '-' + preferencesparams['preferenceservice'];
    preferencesparams['preferencetype'] = preferencesparams['preferencetype'] === 'REPORT' ? 0 : 1;
    delete preferencesparams['preferenceservice'];
    return super.insert(preferencesparams, 'Preference');
  }

  public savePreferences(id: number, preferencesparams: object): Observable<any> {
    preferencesparams['preferencetype'] = preferencesparams['type'] === 'REPORT' ? 0 : 1;
    return super.update({ id: id }, preferencesparams, preferencesparams['entity']);
  }

  public getPreferences(entity: string, service: string, type: string): Observable<any> {
    let queryParams: JSONAPIQueryParameter = { fields: {}, filter: {} };

    let fields = { preference: 'preferenceid,preferencename,preferencedescription,preferencepreferences,preferenceentity,preferencetype' };
    queryParams.fields['Preference'] = Util.parseColumnsToNameConvention(this._appConfig.nameConvention, fields);
    queryParams.filter = { preferenceentity: entity + '-' + service, preferencetype: (type === 'REPORT' ? 0 : 1) };
    return super.query(queryParams);
  }


  public deletePreferences(id?: number): Observable<any> {
    const url = this.urlBase + '/Preferences/' + id;
    return this.doRequest({
      method: 'DELETE',
      url: url
    });
  }
}
