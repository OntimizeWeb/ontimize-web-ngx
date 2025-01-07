import moment from "moment";
import { SQLTypes } from "./sqltypes";
import { Util } from "./util";

export class DateUtil {

  static ensureDateValueType(val: any, valueType: 'string' | 'date' | 'timestamp' | 'iso-8601', format: string, sqlType: number): Date | undefined {

    if (!Util.isDefined(val)) {
      return val;
    }
    let result = val;
    switch (valueType) {
      case 'string':
        if (typeof val === 'string') {
          const m = moment(val, format);
          if (m.isValid()) {
            result = new Date(m.valueOf());
          }
        } else {
          result = undefined;
        }
        break;
      case 'date':
        if ((val instanceof Date)) {
          result = val;
        } else {
          result = undefined;
        }
        break;
      case 'timestamp':
        if (typeof val === 'number') {
          result = new Date(val);
        } else {
          result = undefined;
        }
        break;
      case 'iso-8601':
        if (typeof val !== 'string') {
          const acceptTimestamp = typeof val === 'number' && sqlType === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            result = new Date(val);
          } else {
            result = undefined;
          }
        } else {
          const m = moment(val);
          if (m.isValid()) {
            result = new Date(m.valueOf());
          } else {
            result = undefined;
          }
        }
        break;
      default:
        break;
    }
    return result;
  }
}
