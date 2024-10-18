import { Util } from '../../util/util';
import { BaseNameConvention } from './base-name-convention.service';

export class NameConventionLower extends BaseNameConvention {

  parseToStringCase(value: any) {
    return Util.parseToLowerCase(value);
  }

  /**
   * Uses in method `parseResultToNameConvention` in abstract class BaseNameConvention because,
    *  if nameConvention is lowercase return result keys in uppercase
   */

  parseOppositeToStringCase(value) {
    return Util.parseToUpperCase(value);
  }



}
