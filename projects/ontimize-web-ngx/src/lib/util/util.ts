import { IDataService } from '../interfaces/data-service.interface';
import { IFormDataComponent } from '../interfaces/form-data-component.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { ODateValueType } from '../types/o-date-value.type';
import { Base64 } from './base64';
import { Codes } from './codes';

export class Util {

  static columnAggregates = ['sum', 'count', 'avg', 'min', 'max'];

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
   * Returns the provided string in lowercase and without accent marks.
   * @param value the text to normalize
   */
  static normalizeString(value: string, toLowerCase: boolean = true): string {
    if (value && value.length) {
      let result = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (toLowerCase) {
        result = result.toLowerCase();
      }
      return result;
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

}
