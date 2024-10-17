import { INameConvention } from '../../interfaces/name-convention.interface';
import { Util } from '../../util/util';
import { BaseNameConvention } from './base-name-convention.service';

export class NameConventionUpper extends BaseNameConvention implements INameConvention {

  parseToStringCase(value: any) {
    return Util.parseToUpperCase(value);
  }

  parseOppositeToStringCase(value) {
    //implement in child class
    return Util.parseToLowerCase(value);
  }

}
