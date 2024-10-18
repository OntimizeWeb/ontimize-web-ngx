import { SQLOrder } from './../../types/sql-order.type';
import { Injectable } from '@angular/core';

import { Expression } from '../../types/expression.type';
import { JSONAPIQueryParameter } from '../../types/json-query-parameter.type';
import { BaseQueryArgument } from './base-query-argument.adapter';
import { IBaseQueryArgument } from './base-query-argument.interface';
import { OQueryParams } from '../../types/query-params.type';
import { Util } from '../../util/util';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';

@Injectable()
export class JSONAPIQueryArgumentsAdapter extends BaseQueryArgument implements IBaseQueryArgument {

  parseQueryParameters(args: OQueryParams): JSONAPIQueryParameter[] {

    if (!Util.isDefined(args)) return [];
    let fields = {};

    fields[args.entity] = args.columns.toString();

    let queryargs: JSONAPIQueryParameter = {
      fields: fields
    };

    if (args.pageable) {
      queryargs.page = {};
      queryargs.page['offset'] = args.ovrrArgs.offset;
      queryargs.page['limit'] = args.ovrrArgs.length;
    }

    if (!Util.isArrayEmpty(args.sort)) {

      queryargs.sort = args.sort.map((sortElement: SQLOrder, idx: number, array: SQLOrder[]) => {
        return sortElement.ascendent ? sortElement.columnName : ('-' + sortElement.columnName);
      }).join(',');
    }

    if (Util.isDefined(args.filter)) {
      queryargs.filter = {};
      Object.keys(args.filter).forEach(filter => {
        queryargs.filter[filter] = args.filter[filter];
      });
    }

    return [queryargs];
  }


  deCompose(expresion, columns: Array<string>, kv: Object) {
    const basicExpresion: Expression = expresion[FilterExpressionUtils.BASIC_EXPRESSION_KEY];
    const filterExpresion: Expression = expresion[FilterExpressionUtils.FILTER_EXPRESSION_KEY];

    let decomposedExpresion = kv;
    if (Util.isDefined(basicExpresion)) {
      decomposedExpresion = this.deComposeExpresion(basicExpresion, columns, kv);
    }

    /* Required for column filtering which is currently disabled */
    if (Util.isDefined(filterExpresion)) {
      decomposedExpresion = this.deComposeExpresion(filterExpresion, columns, decomposedExpresion);
    }
    return decomposedExpresion;
  }

  deComposeExpresion(expresion: any, columns: Array<string>, kv: Object) {
    if (FilterExpressionUtils.instanceofExpression(expresion)) {
      if (!(typeof expresion.lop === 'string')) {
        kv = this.deComposeExpresion(expresion.lop, columns, kv);
        return this.deComposeExpresion(expresion.rop, columns, kv);
      } else {
        const key = expresion.lop as string;
        return kv;
      }
    }
  }

}