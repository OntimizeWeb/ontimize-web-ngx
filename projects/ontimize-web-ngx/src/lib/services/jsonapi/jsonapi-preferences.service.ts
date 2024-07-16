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

  public saveAsPreferences(preferencesparams?: object): Observable<any> {
    preferencesparams['preferences'] = JSON.stringify(preferencesparams['params']);
    preferencesparams['entity'] = preferencesparams['entity'] + '-' + preferencesparams['service'];
    preferencesparams['type'] = preferencesparams['type'] === 'REPORT' ? 0 : 1;
    delete preferencesparams['params'];
    delete preferencesparams['service'];
    return super.insert(preferencesparams, preferencesparams['entity']);
  }

  public savePreferences(id: number, preferencesparams?: object): Observable<any> {
    preferencesparams['type'] = preferencesparams['type'] === 'REPORT' ? 0 : 1;
    return super.update({ id: id }, preferencesparams, preferencesparams['entity']);
  }

  public getPreferences(entity: string, service: string, type: string): Observable<any> {
    let queryParams: JSONAPIQueryParameter = { fields: {}, filter: {} };

    let fields = { preference: 'id,name,description,preferences,entity,type' };
    queryParams.fields['Preference'] = Util.parseColumnsToNameConvention(this._appConfig.nameConvention, fields);
    queryParams.filter = { entity: entity + '-' + service, type: (type === 'REPORT' ? 0 : 1) };
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
