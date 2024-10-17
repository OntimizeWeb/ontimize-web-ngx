import { INameConvention } from '../../interfaces/name-convention.interface';
import { Util } from '../../util/util';
import { BaseNameConvention } from './base-name-convention.service';

export class NameConventionLower extends BaseNameConvention implements INameConvention {

  parseToStringCase(value: any) {
    return Util.parseToLowerCase(value);
  }

  parseOppositeToStringCase(value) {
    //implement in child class
    return Util.parseToUpperCase(value);
  }



}
