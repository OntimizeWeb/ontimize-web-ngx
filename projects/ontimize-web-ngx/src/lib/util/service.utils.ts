import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { OExpandableContainerComponent } from '../components/expandable-container/o-expandable-container.component';
import { OFormValue } from '../components/form/o-form-value';
import { OFormComponent } from '../components/form/o-form.component';
import { SQLOrder } from '../types/sql-order.type';
import { Codes } from './codes';
import { SQLTypes } from './sqltypes';
import { Util } from './util';

export class ServiceUtils {

  static getParentKeysFromExpandableContainer(parentKeysObject: object, expandableContainer: OExpandableContainerComponent, route?: ActivatedRoute, checkRouteParamsRecursive: boolean = true): {} {
    const result = {};
    const ownKeys = Object.keys(parentKeysObject || {});

    const dataComponent = expandableContainer ? expandableContainer.data : {};
    const existsData = Object.keys(dataComponent).length > 0;

    const routeParams = route ? ServiceUtils.getRouteParams(route.snapshot, checkRouteParamsRecursive) : {};
    const existsRouteParams = Object.keys(routeParams).length > 0;

    if (existsData || existsRouteParams) {
      ownKeys.forEach(ownKey => {
        const keyValue = parentKeysObject[ownKey];
        let value;
        if (dataComponent.hasOwnProperty(keyValue)) {
          value = dataComponent[keyValue];
        } else if (routeParams.hasOwnProperty(keyValue)) {
          value = routeParams[keyValue];
        }
        if (Util.isDefined(value)) {
          switch (typeof (value)) {
            case 'string':
              if (value.trim().length > 0) {
                result[ownKey] = value.trim();
              }
              break;
            case 'number':
              if (!isNaN(value)) {
                result[ownKey] = value;
              }
              break;
          }
        }
      });
    }
    return result;
  }

  static getParentKeysFromForm(parentKeysObject: object, form: OFormComponent, route?: ActivatedRoute, checkRouteParamsRecursive: boolean = true) {
    const result = {};
    const ownKeys = Object.keys(parentKeysObject || {});

    const formComponents = form ? form.getComponents() : {};
    const existsComponents = Object.keys(formComponents).length > 0;

    const formDataProperties = form ? form.getDataValues() : {};
    const existsProperties = Object.keys(formDataProperties).length > 0;

    const urlData = form ? form.getFormNavigation().getFilterFromUrlParams() : {};
    const existsUrlData = Object.keys(urlData).length > 0;
    if (existsUrlData) {
      form.keysArray.forEach((key: string, i: number) => {
        if (urlData.hasOwnProperty(key)) {
          urlData[key] = SQLTypes.parseUsingSQLType(urlData[key], form.keysSqlTypesArray[i]);
        }
      });
    }

    const routeParams = route ? ServiceUtils.getRouteParams(route.snapshot, checkRouteParamsRecursive) : {};
    const existsRouteParams = Object.keys(routeParams).length > 0;

    if (existsComponents || existsProperties || existsUrlData || existsRouteParams) {
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
        } else if (routeParams.hasOwnProperty(formFieldAttr)) {
          currentData = routeParams[formFieldAttr];
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

  static getFilterUsingParentKeys(parentItem: any, parentKeysObject: object) {
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

  static parseSortColumns(sortColumns: string): Array<SQLOrder> {
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

  /**
   * Return the params of the provided route.
   * Params from parent routes are replaced by child route param values if repeated.
   * @param route the route
   * @param recursive indicates whether or not to return route params from route ancestors.
   * @returns params containing all the route parameters
   */
  static getRouteParams(route: ActivatedRouteSnapshot, recursive: boolean): object {
    let params = { ...route.params };
    if (recursive && route.parent) {
      params = { ...this.getRouteParams(route.parent, recursive), ...params };
    }
    return params;
  }

}
