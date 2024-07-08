import { Injector } from '@angular/core';
import moment from 'moment';
import { from, isObservable, Observable, of } from 'rxjs';

import { IDataService } from '../interfaces/data-service.interface';
import { IFormDataComponent } from '../interfaces/form-data-component.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { ODateValueType } from '../types/o-date-value.type';
import { OConfigureServiceArgs } from '../types/configure-service-args.type';
import { Base64 } from './base64';
import { Codes } from './codes';
import { OConfigureMessageServiceArgs } from '../types/configure-message-service-args.type';

export class Util {

  static readonly columnAggregates = ['sum', 'count', 'avg', 'min', 'max'];

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
  static parseParentKeysEquivalences(pKeysArray: Array<string>, separator: string = ':'): object {
    const equivalences = {};
    if (pKeysArray && pKeysArray.length > 0) {
      pKeysArray.forEach(item => {
        const aux = item.split(separator);
        if (aux && aux.length === 2) {
          if (/.+\[.+\]/.test(aux[1])) {
            const equivKey = aux[1].substring(0, aux[1].indexOf('['));
            const equivValue = aux[1].substring(aux[1].indexOf('[') + 1, aux[1].indexOf(']'));
            const equiv = {};
            equiv[equivKey] = equivValue;
            equivalences[aux[0]] = equiv;
          } else {
            equivalences[aux[0]] = aux[1];
          }
        } else if (aux && aux.length === 1) {
          equivalences[item] = item;
        }
      });
    }
    return equivalences;
  }

  static encodeParentKeys(parentKeys: object): string {
    let encoded: string = '';
    if (parentKeys) {
      encoded = Base64.encode(JSON.stringify(parentKeys));
    }
    return encoded;
  }

  static decodeParentKeys(parentKeys: string): object {
    let decoded = {};
    if (parentKeys && parentKeys.length > 0) {
      const d = Base64.decode(parentKeys);
      decoded = JSON.parse(d);
    }
    return decoded;
  }

  static isArrayEmpty(array: any[]): boolean {
    if (!Util.isDefined(array) || array.length === 0) {
      return true;
    }
    return false;
  }

  static isObjectEmpty(obj: object): boolean {
    return typeof obj === 'object' && Object.keys(obj).length === 0;
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
   * Checks wether specified service as argument implements 'IDataService' interface
   * @param arg The service instance for checking.
   * @returns boolean
   */
  static isPermissionsService(arg: any): arg is IPermissionsService {
    if (arg === undefined || arg === null) {
      return false;
    }
    return ((arg as IPermissionsService).loadPermissions !== undefined);
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
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different, objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      // If values of same property are not equal, objects are not equivalent
      let bValue = b[propName];
      if (typeof a[propName] === 'number') {
        const intB = parseInt(bValue, 10);
        bValue = isNaN(intB) ? bValue : intB;
      }
      if (a[propName] !== bValue) {
        return false;
      }
    }

    // If we made it this far, objects are considered equivalent
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
    const t1 = typeof o1;
    const t2 = typeof o2;
    let length: number;
    let key: any;
    let keySet: any;
    if (t1 === t2 && t1 === 'object') {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) {
          return false;
        }
        length = o1.length;
        if (length === o2.length) {
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
   * Returns the a random number
  */
  static randomNumber() {
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    return randomArray[0];
  }


  /**
   * Returns the provided string in lowercase and without accent marks.
   * @param value the text to normalize
   */
  static normalizeString(value: string, toLowerCase: boolean = true): string {
    if (typeof value === 'string') {
      if (value && value.length) {
        let result = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (toLowerCase) {
          result = result.toLowerCase();
        }
        return result;
      }
      return '';
    }
    return value;
  }

  /**
   * Returns the provided array flattend.
   * @param array the array to flat
   */
  static flatten(array: Array<any>): Array<any> {
    let flattened = [];
    for (const current of array) {
      if (!Array.isArray(current)) {
        flattened.push(current);
        continue;
      }
      for (const childCurrent of current) {
        flattened.push(childCurrent)
      }
    }
    return flattened
  }

  /**
   * Returns a list with all the values from the provided object.
   * @param obj the object
   */
  static getValuesFromObject(obj: object = {}): Array<any> {
    const array: Array<any> = [];
    Object.keys(obj).forEach(key => {
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

  static copyToClipboard(data: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', data);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  static checkPixelsValueString(value: string): boolean {
    return typeof value === 'string' ? value.toLowerCase().endsWith('px') : false;
  }

  static extractPixelsValue(value: any, defaultValue?: number): number {
    let result: number = typeof value === 'number' ? value : undefined;
    if (Util.checkPixelsValueString(value)) {
      const parsed = parseFloat(value.substr(0, value.length - 'px'.length));
      result = isNaN(parsed) ? defaultValue : parsed;
    }
    return Util.isDefined(result) ? result : defaultValue;
  }
  /**
   * Added class 'accent' in <mat-form-field> and set the color  accent in the icons
   * @param elRef
   * @param oInputsOptions
   */

  static parseOInputsOptions(elRef, oInputsOptions) {

    if (oInputsOptions.iconColor === Codes.O_INPUTS_OPTIONS_COLOR_ACCENT) {
      const matFormFieldEL = elRef.nativeElement.getElementsByTagName('mat-form-field')[0];
      if (Util.isDefined(matFormFieldEL)) {
        matFormFieldEL.classList.add('accent');
      }
    }
  }


  /**
   *  Return string with escaped special character
   */
  static escapeSpecialCharacter(S: string): string {

    const str = String(S);

    const cpList = Array.from(str[Symbol.iterator]());

    const cuList = [];
    for (const c of cpList) {
      // i. If c is a SpecialCharacter then do:
      if ('^$\\.*+?()[]{}|'.indexOf(c) !== -1) {
        // a. Append "\" to cuList.
        cuList.push('\\');
      }
      // Append c to cpList.
      cuList.push(c);
    }
    const L = cuList.join('');
    return L;

  }

  static isArrayEqual(array1: Array<any>, array2: Array<any>) {
    return array1.length === array2.length && array1.every((v, i) => v === array2[i])
  };

  static differenceArrays(array1: Array<any>, array2: Array<any>): Array<any> {
    const difference = array1.filter(obj => {
      return !array2.some(obj2 => {
        return this.equals(obj, obj2);
      });
    });
    return difference;
  }

  static convertToODateValueType(val: any): ODateValueType {
    let result: ODateValueType = 'timestamp';
    const lowerVal = (val || '').toLowerCase();
    if (lowerVal === 'string' || lowerVal === 'date' || lowerVal === 'timestamp' || lowerVal === 'iso-8601') {
      result = lowerVal;
    }
    return result;
  }


  static uniqueBy(a: Array<any>, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  /**
   * Compares two strings and returns a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise.
   */
  static compare(a: string, b: string): number {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  static parseByValueType(value: any, valueType: ODateValueType, format: string) {
    if (!Util.isDefined(value)) {
      return void 0;
    }

    let result = value;
    const m = moment(value);
    if (!m.isValid()) {
      return void 0;
    }
    switch (valueType) {
      case 'string':
        result = m.format(format);
        break;
      case 'date':
        result = m.toDate();
        break;
      case 'iso-8601':
        result = m.toISOString();
        break;
      case 'timestamp':
        result = m.valueOf();
        break;
      default:
        result = void 0;
        break;
    }
    return result;
  }

  static wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
    if (isObservable(value)) {
      return value;
    }

    if (Util.isPromise(value)) {
      // Use `Promise.resolve()` to wrap promise-like instances.
      return from(Promise.resolve(value));
    }

    return of(value);
  }

  static isPromise<T = any>(obj: any): obj is Promise<T> {
    return !!obj && typeof obj.then === 'function';
  }


  static configureService(configureServiceArgs: OConfigureServiceArgs): any {
    let dataService = configureServiceArgs.baseService;
    const entity = configureServiceArgs.entity;
    const service = configureServiceArgs.service;
    const serviceType = configureServiceArgs.serviceType;
    const injector = configureServiceArgs.injector;

    if (serviceType) {
      dataService = serviceType;
    }
    try {
      dataService = injector.get<any>(dataService);
      if (serviceType) {
        dataService = Util.createServiceInstance(dataService, injector)
      }
      if (Util.isDataService(dataService)) {
        const serviceCfg = dataService.getDefaultServiceConfiguration(service);
        if (entity) {
          serviceCfg.entity = entity;
        }
        dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
    return dataService;
  }

  /**
 * Returns an instance of the provided service class
 * @param clazz the class reference
 * @param injector the injector
 */
  static createServiceInstance(clazz: any, injector: Injector) {
    if (!Util.isDefined(clazz)) {
      return;
    }

    const newInstance = new clazz(injector);
    return newInstance;
  }

  static configureMessageService(configureServiceArgs: OConfigureMessageServiceArgs): any {
    let messageService = configureServiceArgs.baseService;
    const serviceType = configureServiceArgs.serviceType;
    const injector = configureServiceArgs.injector;

    if (serviceType) {
      messageService = serviceType;
    }
    try {
      messageService = injector.get<any>(messageService);
      if (serviceType) {
        messageService = Util.createServiceInstance(messageService, injector)
      }
    } catch (e) {
      console.error(e);
    }
    return messageService;
  }

  static isBase64(file: string) {
    const pattern = new RegExp(/^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/g)

    if (file.substring(0, 4) === 'data') {
      file = file.substring(file.indexOf('base64') + 7);
    }
    return pattern.test(file.replace(/\s+/g, ''));

  }
  /**
 * Converts an object to a JSON string, avoiding circular references.
 * @param obj The object to convert to JSON.
 * @returns A JSON string representing the object.
 */
  static stringify(obj: object) {
    let cache = [];
    let str = JSON.stringify(obj, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          return; // Avoid circular references
        }
        cache.push(value);
      }
      return value;
    });
    cache = null;
    return str;
  }

  static readonly objectToQueryString = (initialObj) => {
    const reducer = (obj, parentPrefix = null) => (prev, key) => {
      const val = obj[key];
      key = encodeURIComponent(key);
      let prefix: string;
      if (key === 'filterParentKeys') {
        prefix = parentPrefix;
      } else {
        prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;
      }

      if (key === 'filter' && !Util.isObjectEmpty(obj[key])) {
        prev.push(Object.keys(val).map(itemfilter => {
          const filterKey = `filter[${itemfilter}]`;
          return `${encodeURIComponent(filterKey)}=${encodeURIComponent(JSON.stringify(val[itemfilter]))}`;
        }).join('&'));

        return prev;
      }


      if (val == null || typeof val === 'function') {
        prev.push(`${encodeURIComponent(prefix)}=`);
        return prev;
      }

      if (['number', 'boolean', 'string'].includes(typeof val)) {
        prev.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(val)}`);
        return prev;
      }

      prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join('&'));
      return prev;
    };

    return Object.keys(initialObj).reduce(reducer(initialObj), []).join('&');
  };

  static parseColumnsToNameConvention(convention: string, value: object) {
    const parsedColumns = Object.values(value)[0].split(',');
    let parsedValues;
    switch (convention) {
      case 'lower':
        parsedValues = Util.parseToLowerCase(parsedColumns);
        parsedValues = parsedValues.join();
        break;
      case 'upper':
        parsedValues = Util.parseToUpperCase(parsedColumns)
        parsedValues = parsedValues.join();
        break;
      default:
        parsedValues = parsedColumns;
    }
    return parsedValues;
  }

  static parseDataToNameConvention(convention: string, data: any): any {
    if (convention === 'database') {
      return data;
    }
    return Util.mapKeys(data, (val, key) => convention === 'lower' ? Util.toLowerCase(key) : Util.toUpperCase(key));
  }

  /**
   * Map keys of object
   * For example: converting the keys of an object to uppercase
   */
  static readonly mapKeys = (obj, fn) =>
    Object.keys(obj).reduce((acc, k) => {
      acc[fn(obj[k], k, obj)] = obj[k];
      return acc;
    }, {});

  static toLowerCase(value: string) {
    return value.toLocaleLowerCase();
  }

  static toUpperCase(value: string) {
    return value.toUpperCase();
  }


  static parseToLowerCase(value: any) {
    if (Util.isArray(value)) {
      return value.map((x: string) => x.toLocaleLowerCase());
    } else if (typeof value === 'string') {
      return value.toLocaleLowerCase();
    } else if (typeof value === 'object') {
      return Util.mapKeys(value, Util.toLowerCase);
    }
    return value;
  }

  static parseToUpperCase(value: any) {
    if (Util.isArray(value)) {
      return value.map((x: string) => x.toLocaleUpperCase());
    } else if (typeof value === 'string') {
      return value.toLocaleUpperCase();
    } else if (typeof value === 'object') {
      return Util.mapKeys(value, Util.toUpperCase);
    }
    return value;
  }

}
