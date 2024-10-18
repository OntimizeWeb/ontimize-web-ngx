import { INameConvention } from '../../interfaces/name-convention.interface';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { Util } from '../../util/util';

export abstract class BaseNameConvention implements INameConvention {

  abstract parseToStringCase(value: string | object | string[]): any;

  abstract parseOppositeToStringCase(value: string | object | string[]): any;


  parseFilterToNameConvention(data: any) {
    let filter = {};
    Object.keys(data).forEach(filterKey => {
      if (FilterExpressionUtils.instanceofExpression(data[filterKey])) {
        Object.assign(filter, { [filterKey]: this.parseFilterExpresionNameConvention(data[filterKey]) });
      } else {
        const mapfilter = Util.mapKeys(data, (val, key) => {
          return this.parseToStringCase(key);
        });
        Object.assign(filter, mapfilter);
      }
    });
    return filter;
  }



  parseColumnsToNameConventionForOntimize(value: object | string) {
    let parsedColumns = value;

    if (!Util.isArray(value) && Util.isObject(value)) {
      parsedColumns = Object.values(value)[0].split(',');
    }
    let parsedValues = this.parseToStringCase(parsedColumns);
    return parsedValues;
  }

  parseColumnsToNameConventionForJSONAPI(value: string) {
    let parsedColumns = value.split(',');
    let parsedValues = this.parseToStringCase(parsedColumns);
    if (Util.isArray(parsedValues)) {
      parsedValues = parsedValues.join();
    }
    return parsedValues;
  }

  parseDataToNameConvention(data: any): any {
    return Util.mapKeys(data, (val, key) => {
      return this.parseToStringCase(key);
    });

  }

  /**
 *
 * @param data
 * @returns result to name convention,
 *  if nameConvention is uppercase return result keys in lowercase
 *  if nameConvention is lowercase return result keys in uppercase
 */
  parseResultToNameConvention(data: any): any {
    return Util.mapKeys(data, (val, key) => {
      return this.parseOppositeToStringCase(key);
    });

  }
  parseValuesDataToNameConvention(data: any): any {
    return Util.mapValues(data, (val, key) => {
      return this.parseToStringCase(val);
    });

  }

  parseFilterExpresionNameConvention(data: any): any {
    if (Util.isObject(data['rop'])) {
      return { 'lop': this.parseFilterExpresionNameConvention(data['lop']), 'op': data['op'], 'rop': this.parseFilterExpresionNameConvention(data['rop']) };
    } else {
      return { 'lop': this.parseToStringCase(data['lop']), 'op': data['op'], 'rop': data['rop'] };
    }

  }
}