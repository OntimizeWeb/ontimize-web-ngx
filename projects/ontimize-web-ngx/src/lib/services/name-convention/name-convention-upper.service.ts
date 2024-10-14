import { INameConvention } from '../../interfaces/name-convention.interface';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { Util } from '../../util/util';

export class NameConventionUpper implements INameConvention {

  parseFilterToNameConvention(data: any) {
    let filter = {};
    Object.keys(data).forEach(filterKey => {
      if (FilterExpressionUtils.instanceofExpression(data[filterKey])) {
        Object.assign(filter, { [filterKey]: this.parseFilterExpresionNameConvention(data[filterKey]) });
      } else {
        const mapfilter = Util.mapKeys(data, (val, key) => {
          return Util.toUpperCase(key);
        });
        Object.assign(filter, mapfilter);
      }
    });
    return filter;
  }

  parseColumnsToNameConventionForOntimize( value: object | string) {
    let parsedColumns = value;

    if (!Util.isArray(value) && Util.isObject(value)) {
      parsedColumns = Object.values(value)[0].split(',');
    }
    let parsedValues = Util.parseToUpperCase(parsedColumns);
    return parsedValues;
  }

  parseColumnsToNameConventionForJSONAPI( value: string) {
    let parsedColumns = value.split(',');;

    let parsedValues = Util.parseToUpperCase(parsedColumns);

    if (Util.isArray(parsedValues)) {
      parsedValues = parsedValues.join();
    }
    return parsedValues;
  }

  parseDataToNameConvention(data: any): any {

    if (Util.isDefined(data) && Util.isObject(data) &&
      FilterExpressionUtils.instanceofExpression(data)) {
      return this.parseFilterExpresionNameConvention(data);

    } else {
      return Util.mapKeys(data, (val, key) => {
        return Util.toUpperCase(key);
      });
    }
  }

  parseResultToNameConvention(data: any): any {
    return Util.mapKeys(data, (val, key) => {
      return Util.toLowerCase(key);
    });

  }

  parseValuesDataToNameConvention(data: any): any {
    return Util.mapValues(data, (val, key) => {
      return Util.toUpperCase(val);
    });

  }

  parseFilterExpresionNameConvention(data: any): any {
    if (Util.isObject(data['rop'])) {
      return { 'lop': this.parseFilterExpresionNameConvention(data['lop']), 'op': data['op'], 'rop': this.parseFilterExpresionNameConvention(data['rop']) };
    } else {
      return { 'lop': Util.toUpperCase(data['lop']), 'op': data['op'], 'rop': data['rop'] };
    }

  }

}
