import { Base64 } from './base64';
import { Observable } from 'rxjs/Observable';
import { IFormDataComponent } from '../components/o-form-data-component.class';
import { SessionInfo } from '../services/login.service';

export interface IDataService {
  getDefaultServiceConfiguration(serviceName?: string): Object;
  configureService(config: any): void;
  query(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any>;
  advancedQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object,
    offset?: number, pagesize?: number, orderby?: Array<Object>): Observable<any>;
  insert(av: Object, entity?: string, sqltypes?: Object): Observable<any>;
  update(kv: Object, av: Object, entity?: string, sqltypes?: Object): Observable<any>;
  'delete'(kv: Object, entity?: string, sqltypes?: Object): Observable<any>;
}

export interface IAuthService {
  startsession(user: string, password: string): Observable<any>;
  endsession(user: string, sessionId: number): Observable<any>;
}

export interface IOntimizeServiceConf {
  urlBase?: string;
  session: SessionInfo;
  entity?: string;
  kv?: Object;
  av?: Array<string>;
  sqltypes?: Object;
  pagesize?: number;
  offset?: number;
  orderby?: Array<Object>;
  totalsize?: number;
}

export class Util {

  static isObject(val: any): boolean {
    const valType = typeof val;
    return valType === 'object';
  }

  static isArray(val: any): boolean {
    return val instanceof Array;
  }


  static parseBoolean(value: string, defaultValue?: boolean): boolean {
    if ((typeof value === 'string') && (value.toUpperCase() === 'TRUE' || value.toUpperCase() === 'YES')) {
      return true;
    } else if ((typeof value === 'string') && (value.toUpperCase() === 'FALSE' || value.toUpperCase() === 'NO')) {
      return false;
    } else if (defaultValue !== undefined && defaultValue !== null) {
      return defaultValue;
    }
    return false;
  }

  static parseArray(value: string): string[] {
    if (value) {
      return value.split(';');
    }
    return [];
  }

  /**
   * Returns an object with parent keys equivalences.
   * @param  {Array<string>} pKeysArray Array of strings. Accepted format: key | key:alias
   * @returns Object
   */
  static parseParentKeysEquivalences(pKeysArray: Array<string>): Object {
    let equivalences = {};
    if (pKeysArray && pKeysArray.length > 0) {
      pKeysArray.forEach(item => {
        let aux = item.split(':');
        if (aux && aux.length === 2) {
          equivalences[aux[0]] = aux[1];
        } else if (aux && aux.length === 1) {
          equivalences[item] = item;
        }
      });
    }
    return equivalences;
  }

  static encodeParentKeys(parentKeys: Object): string {
    let encoded: string = '';
    if (parentKeys) {
      encoded = Base64.encode(JSON.stringify(parentKeys));
      // test
      // var d = Base64.decode(encoded);
      // console.log(parentKeys, encoded, d, JSON.parse(d));
    }
    return encoded;
  }

  static decodeParentKeys(parentKeys: string): Object {
    let decoded = {};
    if (parentKeys && parentKeys.length > 0) {
      let d = Base64.decode(parentKeys);
      decoded = JSON.parse(d);
    }
    return decoded;
  }

  static isArrayEmpty(array: any[]): boolean {
    if (array && array.length === 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks wether specified service as argument implements 'IDataService' interface
   * @param  {any} arg The service instance for checking.
   * @returns boolean
   */
  static isDataService(arg: any): arg is IDataService {
    if (arg === undefined || arg === null) {
      return false;
    }
    return ((arg as IDataService).getDefaultServiceConfiguration !== undefined &&
      (arg as IDataService).configureService !== undefined);
  }

  /**
   * Checks wether specified component as argument implements 'IFormDataComponent' interface
   * @param  {any} arg The component instance for checking.
   * @returns boolean
   */
  static isFormDataComponent(arg: any): arg is IFormDataComponent {
    if (arg === undefined || arg === null) {
      return false;
    }
    return ((arg as IFormDataComponent).isAutomaticBinding !== undefined);
  }

}
