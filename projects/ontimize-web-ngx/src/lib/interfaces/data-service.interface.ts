import { Observable } from 'rxjs';

export interface IDataService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any): void;
  query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<any>;
  advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object, offset?: number, pagesize?: number, orderby?: Array<object>): Observable<any>;
  insert(av: object, entity?: string, sqltypes?: object): Observable<any>;
  update(kv: object, av: object, entity?: string, sqltypes?: object): Observable<any>;
  'delete'(kv: object, entity?: string, sqltypes?: object): Observable<any>;
}
