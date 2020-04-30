import { Observable } from 'rxjs';

import { ServiceResponse } from './service-response.interface';

export interface IDataService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any): void;
  query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
  advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object, offset?: number, pagesize?: number, orderby?: Array<object>): Observable<ServiceResponse>;
  insert(av: object, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
  update(kv: object, av: object, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
  'delete'(kv: object, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
}
