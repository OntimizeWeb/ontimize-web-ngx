import { Router } from '@angular/router';

import { OFormComponent } from '../components/form/o-form.component';
import { OFormValue } from '../components/form/OFormValue';
import { Codes, Util } from '../utils';

export type OQueryDataArgs = {
  replace?: boolean; // Used in the list component for replacing data in setValue method when reloadData method is called
  sqltypes?: Object;
  offset?: number;
  length?: number;
};

export interface ISQLOrder {
  columnName: string;
  ascendent: boolean;
}

export class ServiceUtils {

  static getParentKeysFromForm(parentKeysObject: Object, form: OFormComponent) {
    const result = {};
    const ownKeys = Object.keys(parentKeysObject || {});

    const formComponents = form ? form.getComponents() : {};
    const existsComponents = Object.keys(formComponents).length > 0;

    const formDataProperties = form ? form.getDataValues() : {};
    const existsProperties = Object.keys(formDataProperties).length > 0;

    const urlData = form ? form.getFormNavigation().getFilterFromUrlParams() : {};
    const existsUrlData = Object.keys(urlData).length > 0;

    if (existsComponents || existsProperties || existsUrlData) {
      ownKeys.forEach(ownKey => {
        const keyValue = parentKeysObject[ownKey];
        // Parent key equivalence may be an object
        const isEquivObject = Util.isObject(keyValue);
        const formFieldAttr = isEquivObject ? Object.keys(keyValue)[0] : keyValue;
        let currentData;
        if (formComponents.hasOwnProperty(formFieldAttr)) {
          const component = formComponents[formFieldAttr];
          // Is service component (combo, listpicker, radio)
          if ('getSelectedRecord' in component && isEquivObject) {
            currentData = ((component as any).getSelectedRecord() || {})[keyValue[formFieldAttr]];
          } else {
            currentData = component.getValue();
          }
        } else if (formDataProperties.hasOwnProperty(formFieldAttr)) {
          const formPropValue = formDataProperties[formFieldAttr];
          currentData = formPropValue instanceof OFormValue ? formPropValue.value : formPropValue;
        } else if (urlData.hasOwnProperty(formFieldAttr)) {
          currentData = urlData[formFieldAttr];
        }
        if (Util.isDefined(currentData)) {
          switch (typeof (currentData)) {
            case 'string':
              if (currentData.trim().length > 0) {
                result[ownKey] = currentData.trim();
              }
              break;
            case 'number':
              if (!isNaN(currentData)) {
                result[ownKey] = currentData;
              }
              break;
          }
        }
      });
    }
    return result;
  }

  static filterContainsAllParentKeys(parentKeysFilter, parentKeys): boolean {
    const pkKeys = Object.keys(parentKeys);
    if ((pkKeys.length > 0) && Util.isDefined(parentKeysFilter)) {
      const parentKeysFilterKeys = Object.keys(parentKeysFilter);
      return pkKeys.every(a => parentKeysFilterKeys.indexOf(a) !== -1);
    }
    return true;
  }

  static getFilterUsingParentKeys(parentItem: any, parentKeysObject: Object) {
    const filter = {};
    const ownKeys = Object.keys(parentKeysObject);
    if (ownKeys.length > 0 && Util.isDefined(parentItem)) {
      ownKeys.forEach(ownKey => {
        const parentKey = parentKeysObject[ownKey];
        if (parentItem.hasOwnProperty(parentKey)) {
          let currentData = parentItem[parentKey];
          if (currentData instanceof OFormValue) {
            currentData = currentData.value;
          }
          filter[ownKey] = currentData;
        }
      });
    }
    return filter;
  }

  static getArrayProperties(array: any[], properties: any[]): any[] {
    const result = array.map(item => {
      return ServiceUtils.getObjectProperties(item, properties);
    });
    return result;
  }

  static getObjectProperties(object: any, properties: any[]): any {
    const objectProperties = {};
    properties.forEach(key => {
      objectProperties[key] = object[key];
    });
    return objectProperties;
  }

  static parseSortColumns(sortColumns: string): Array<ISQLOrder> {
    const sortColArray = [];
    if (sortColumns) {
      const cols = Util.parseArray(sortColumns);
      cols.forEach(col => {
        const colDef = col.split(Codes.TYPE_SEPARATOR);
        if (colDef.length > 0) {
          const colName = colDef[0];
          const colSort = colDef[1] || Codes.ASC_SORT;
          sortColArray.push({
            columnName: colName,
            ascendent: colSort === Codes.ASC_SORT
          });
        }
      });
    }
    return sortColArray;
  }

  static redirectLogin(router: Router, sessionExpired: boolean = false) {
    const arg = {};
    arg[Codes.SESSION_EXPIRED_KEY] = sessionExpired;
    const extras = {};
    extras[Codes.QUERY_PARAMS] = arg;
    router.navigate([Codes.LOGIN_ROUTE], extras);
  }

}
