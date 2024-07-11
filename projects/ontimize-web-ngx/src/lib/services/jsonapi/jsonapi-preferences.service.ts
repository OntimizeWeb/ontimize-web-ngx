import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JSONAPIService } from './jsonapi.service';
import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { Util } from '../../util';

@Injectable()
export class JSONAPIPreferencesService extends JSONAPIService {

  public configureService(config: any): void {
    super.configureService(config);
    this.path = config.path || 'preferences';
  }

  public saveAsPreferences(preferencesparams?: object): Observable<any> {
    preferencesparams['preferences'] = JSON.stringify(preferencesparams['params']);
    preferencesparams['entity'] = preferencesparams['entity'] + '-' + preferencesparams['service'];
    delete preferencesparams['params'];
    delete preferencesparams['service'];
    return super.insert(preferencesparams, preferencesparams['entity']);
  }

  public savePreferences(id: number, preferencesparams?: object): Observable<any> {
    return super.update({ id: id }, preferencesparams, preferencesparams['entity']);
  }

  public getPreferences(entity?: string, service?: string): Observable<any> {
    let queryParams: JSONAPIQueryParameter = { fields: {}, filter: {} };
    let fields = { preference: 'id,name,description,preferences,entity,type' };
    queryParams.fields['Preference'] = Util.parseColumnsToNameConvention(this._appConfig.nameConvention, fields);
    //queryParams.filter = { entity: entity + '-' + service, type: 0 };
    queryParams.filter = { entity: entity + '-' + service };
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
