import { Util } from '../../util/util';
import { BaseNameConvention } from './base-name-convention.service';

export class NameConventionUpper extends BaseNameConvention {

  parseToStringCase(value: any) {
    return Util.parseToUpperCase(value);
  }

  /**
   * Uses in method `parseResultToNameConvention` in abstract class BaseNameConvention because,
    *  if nameConvention is lowercase return result keys in uppercase
   */
  parseOppositeToStringCase(value) {
    return Util.parseToLowerCase(value);
  }

}
