import { Injectable } from '@angular/core';
import { TranslateDefaultParser } from '@ngx-translate/core';

import { Util } from '../../util/util';

@Injectable()
export class OTranslateParser extends TranslateDefaultParser {
  public templateMatcher: RegExp = /{\s?([0-9][^{}\s]*)\s?}/g;

  public interpolate(expr: string, params?: any): string {
    if (typeof expr !== 'string' || !params) {
      return expr;
    }
    return expr.replace(this.templateMatcher, (substring: string, index: string) => {
      const argValue = Util.isDefined(params[index]) ? params[index] : '';
      return !isNaN(parseInt(index, 10)) ? argValue : substring;
    });
  }
}
