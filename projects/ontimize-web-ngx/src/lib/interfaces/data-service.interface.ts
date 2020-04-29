import { Observable } from 'rxjs';

import { OntimizeServiceResponse } from '../types/ontimize-service-response.type';

export interface IDataService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any): void;
  query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<OntimizeServiceResponse>;
  advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object, offset?: number, pagesize?: number, orderby?: Array<object>): Observable<OntimizeServiceResponse>;
  insert(av: object, entity?: string, sqltypes?: object): Observable<OntimizeServiceResponse>;
  update(kv: object, av: object, entity?: string, sqltypes?: object): Observable<OntimizeServiceResponse>;
  'delete'(kv: object, entity?: string, sqltypes?: object): Observable<OntimizeServiceResponse>;
}
