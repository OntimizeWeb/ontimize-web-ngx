import { Base64 } from './base64';
import { Observable } from 'rxjs/Observable';
import { IFormDataComponent } from '../components/o-form-data-component.class';
import { SessionInfo } from '../services/login.service';
import { Codes } from './codes';

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
  redirectLogin?(sessionExpired?: boolean);
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
    } else if (Util.isDefined(defaultValue)) {
      return defaultValue;
    }
    return false;
  }

  static parseArray(value: string, excludeRepeated: boolean = false): string[] {
    let result = [];
    if (value) {
      result = value.split(Codes.ARRAY_INPUT_SEPARATOR);
    }
    if (excludeRepeated && result.length > 0) {
      result = Array.from(new Set(result));
    }
    return result;
  }

  /**
   * Returns an object with parent keys equivalences.
   * @param  pKeysArray Array of strings. Accepted format: key | key:alias
   * @returns Object
   */
  static parseParentKeysEquivalences(pKeysArray: Array<string>, separator: string = ':'): Object {
    let equivalences = {};
    if (pKeysArray && pKeysArray.length > 0) {
      pKeysArray.forEach(item => {
        let aux = item.split(separator);
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
   * @param arg The service instance for checking.
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
   * @param arg The component instance for checking.
   * @returns boolean
   */
  static isFormDataComponent(arg: any): arg is IFormDataComponent {
    if (arg === undefined || arg === null) {
      return false;
    }
    return ((arg as IFormDataComponent).isAutomaticBinding !== undefined);
  }


  /**
   * Compare is equal two objects
   * @param a Object 1
   * @param b Object 2
   *
   */
  static isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      let bValue = b[propName];
      if (typeof a[propName] === 'number') {
        let intB = parseInt(bValue);
        bValue = isNaN(intB) ? bValue : intB;
      }
      if (a[propName] !== bValue) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  static equals(o1: any, o2: any): boolean {
    if (o1 === o2) {
      return true;
    }
    if (o1 === null || o2 === null) {
      return false;
    }
    if (o1 !== o1 && o2 !== o2) {
      // NaN === NaN
      return true;
    }
    let t1 = typeof o1, t2 = typeof o2, length: number, key: any, keySet: any;
    if (t1 === t2 && t1 === 'object') {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) {
          return false;
        }
        if ((length = o1.length) === o2.length) {
          for (key = 0; key < length; key++) {
            if (!Util.equals(o1[key], o2[key])) {
              return false;
            }
          }
          return true;
        }
      } else {
        if (Array.isArray(o2)) {
          return false;
        }
        keySet = Object.create(null);
        for (key in o1) {
          if (!Util.equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
        for (key in o2) {
          if (!(key in keySet) && typeof o2[key] !== 'undefined') {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  static isDefined(value: any): boolean {
    return typeof value !== 'undefined' && value !== null;
  }

  /**
   * Returns the provided string in lowercase and without accent marks.
   * @param value the text to normalize
   */
  static normalizeString(value: string): string {
    if (value && value.length) {
      return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    return '';
  }

  /**
   * Returns the provided array flattend.
   * @param array the array to flat
   */
  static flatten(array: Array<any>): Array<any> {
    return [].concat(...array);
  }

  /**
   * Returns a list with all the values from the provided object.
   * @param obj the object
   */
  static getValuesFromObject(obj: Object = {}): Array<any> {
    let array: Array<any> = [];
    Object.keys(obj).map(key => {
      if (typeof obj[key] === 'object') {
        array.push(Util.getValuesFromObject(obj[key]));
      }
      array.push(obj[key]);
    });
    return Util.flatten(array);
  }

  static parseIconPosition(value: string, defaultValue?: string): string {
    let result = defaultValue || Codes.ICON_POSITION_LEFT;
    const availablePositions = [Codes.ICON_POSITION_LEFT, Codes.ICON_POSITION_RIGHT];
    if (value && value.length) {
      result = value.toLowerCase();
    }
    if (availablePositions.indexOf(result) === -1) {
      result = defaultValue || Codes.ICON_POSITION_LEFT;
    }
    return result;
  }
}
