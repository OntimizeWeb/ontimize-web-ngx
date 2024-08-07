import { FilterExpressionUtils } from "./filter-expression.utils";
import { Util } from "./util";

export class NameConvention {

  static parseColumnsToNameConvention(convention: string, serviceType: string, value: object | string) {
    let parsedColumns = value;
    if (!Util.isArray(value) && Util.isObject(value)) {
      parsedColumns = Object.values(value)[0].split(',');
    }
    let parsedValues;
    switch (convention) {
      case 'lower':
        parsedValues = Util.parseToLowerCase(parsedColumns);
        if (Util.isArray(parsedValues) && serviceType === 'JSONAPI') {
          parsedValues = parsedValues.join();
        }
        break;
      case 'upper':
        parsedValues = Util.parseToUpperCase(parsedColumns);
        if (Util.isArray(parsedValues) && serviceType === 'JSONAPI') {
          parsedValues = parsedValues.join();
        }
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
    if (Util.isDefined(data) && Util.isObject(data) &&
      FilterExpressionUtils.instanceofExpression(data)) {
      return NameConvention.parseFilterExpresionNameConvention(convention, data);

    } else {
      return Util.mapKeys(data, (val, key) => {
        return convention === 'lower' ? Util.toLowerCase(key) : Util.toUpperCase(key)
      });
    }
  }

  static parseValuesDataToNameConvention(convention: string, data: any): any {
    if (convention === 'database') {
      return data;
    }

    return Util.mapValues(data, (val, key) => {
      console.log(val, key);
      return convention === 'lower' ? Util.toLowerCase(val) : Util.toUpperCase(val)
    });

  }

  static parseFilterExpresionNameConvention(convention: string, data: any): any {
    if (Util.isObject(data['rop'])) {
      return { 'lop': NameConvention.parseFilterExpresionNameConvention(convention, data['lop']), 'op': data['op'], 'rop': NameConvention.parseDataToNameConvention(convention, data['rop']) };
    } else {
      return { 'lop': (convention === 'lower' ? Util.toLowerCase(data['lop']) : Util.toUpperCase(data['lop'])), 'op': data['op'], 'rop': data['rop'] };
    }
  }
}
